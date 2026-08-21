import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

// Item 5 — auto-capture. Scans recent Whop payments and inserts unknown members
// (affiliate_id = null) into the assignment queue. Owner assigns them later.
// Auth: Vercel cron Bearer CRON_SECRET, or manual ?secret=/x-snapshot-secret.
// Default run = latest 100 payments. ?deep=1 paginates back ~60 days (first-run backfill).

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COMPANY_ID = "biz_lbUgwQ0bQ8BxtD";
const DEEP_DAYS = 60;
const MAX_PAGES_DEEP = 40; // safety cap

function authorized(req: NextRequest): boolean {
	const cron = process.env.CRON_SECRET;
	if (cron && req.headers.get("authorization") === `Bearer ${cron}`) return true;
	const manual = process.env.SNAPSHOT_SECRET;
	if (manual) {
		const p = req.nextUrl.searchParams.get("secret") ?? req.headers.get("x-snapshot-secret");
		if (p === manual) return true;
	}
	return false;
}

function money(v: unknown): number | null {
	if (typeof v === "number") return v;
	if (typeof v === "string") {
		const n = parseFloat(v.replace(/[$,\s]/g, ""));
		return isNaN(n) ? null : n;
	}
	return null;
}

const STATUS_MAP: Record<string, string> = {
	renewing: "active",
	canceling: "canceled_pending",
	churned: "lapsed",
	left: "expired",
};

async function whopGet(path: string, key: string) {
	const res = await fetch("https://api.whop.com/api/v1/" + path, {
		headers: { Authorization: "Bearer " + key },
		cache: "no-store",
	});
	return res.ok ? res.json() : null;
}

async function handle(req: NextRequest) {
	if (!process.env.CRON_SECRET && !process.env.SNAPSHOT_SECRET) {
		return NextResponse.json({ error: "No auth configured" }, { status: 500 });
	}
	if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const key = process.env.WHOP_API_KEY;
	if (!key) return NextResponse.json({ error: "Missing WHOP_API_KEY" }, { status: 500 });

	const deep = req.nextUrl.searchParams.get("deep") === "1";
	const cutoff = Date.now() - DEEP_DAYS * 24 * 60 * 60 * 1000;

	const supabase = createAdminClient();
	const { data: existing, error: exErr } = await supabase.from("members").select("whop_member_id");
	if (exErr) return NextResponse.json({ error: "read members failed", detail: exErr.message }, { status: 500 });
	const known = new Set((existing ?? []).map((m) => m.whop_member_id));

	// Collect candidate member ids from payments (dedup, only unknown).
	const candidates = new Map<string, { username: string; product: string | null; price: number | null }>();
	let after: string | null = null;
	let pages = 0;
	const maxPages = deep ? MAX_PAGES_DEEP : 1;
	outer: while (pages < maxPages) {
		const url = `payments?company_id=${COMPANY_ID}` + (after ? `&after=${after}` : "");
		const d = await whopGet(url, key);
		pages++;
		const rows: any[] = Array.isArray(d?.data) ? d.data : [];
		for (const p of rows) {
			const mber = p?.member?.id;
			if (!mber || known.has(mber) || candidates.has(mber)) continue;
			candidates.set(mber, {
				username: p?.user?.username ?? "unknown",
				product: p?.product?.title ?? null,
				price: money(p?.usd_total ?? p?.total),
			});
			if (deep && p?.created_at && Date.parse(p.created_at) < cutoff) break outer;
		}
		const pi = d?.page_info ?? {};
		if (!pi.has_next_page || !pi.end_cursor) break;
		// stop deep sweep once we've paged past the cutoff window
		if (deep && rows.length && rows[rows.length - 1]?.created_at && Date.parse(rows[rows.length - 1].created_at) < cutoff) break;
		after = pi.end_cursor as string;
	}

	// Enrich each new member via /members/{mber} for join date + status, then insert.
	const toInsert: any[] = [];
	for (const [mber, info] of candidates) {
		const wm = await whopGet("members/" + mber, key);
		const status = wm?.most_recent_action ? STATUS_MAP[wm.most_recent_action] ?? "active" : "active";
		toInsert.push({
			whop_member_id: mber,
			username: info.username,
			affiliate_id: null,
			product: info.product,
			plan_price_usd: info.price,
			monthly_reward_usd: null,
			referred_at: wm?.joined_at ?? null,
			status,
			commission_active: null,
			notes: "auto-captured from payments; unassigned",
		});
	}

	let inserted = 0;
	if (toInsert.length) {
		// ignore-duplicates in case of a race with the manual roster
		const { data, error } = await supabase
			.from("members")
			.upsert(toInsert, { onConflict: "whop_member_id", ignoreDuplicates: true })
			.select("id");
		if (error) return NextResponse.json({ error: "insert failed", detail: error.message }, { status: 500 });
		inserted = data?.length ?? 0;
	}

	return NextResponse.json({ mode: deep ? "deep-backfill" : "daily", pagesScanned: pages, newCandidates: candidates.size, inserted });
}

export async function GET(req: NextRequest) {
	return handle(req);
}
export async function POST(req: NextRequest) {
	return handle(req);
}
