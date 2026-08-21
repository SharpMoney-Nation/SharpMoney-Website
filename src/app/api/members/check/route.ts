import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

// Payment-recency checker (item 3). Daily job that compares each commission-relevant
// member's live Whop state to expectations and raises member_flags for OWNER REVIEW.
// It NEVER flips commission_active — the owner decides. Auth: Vercel cron Bearer
// CRON_SECRET, or manual ?secret=/x-snapshot-secret against SNAPSHOT_SECRET.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(req: NextRequest): boolean {
	const cronSecret = process.env.CRON_SECRET;
	if (cronSecret && req.headers.get("authorization") === `Bearer ${cronSecret}`) return true;
	const manual = process.env.SNAPSHOT_SECRET;
	if (manual) {
		const p = req.nextUrl.searchParams.get("secret") ?? req.headers.get("x-snapshot-secret");
		if (p === manual) return true;
	}
	return false;
}

async function fetchWhopMember(mberId: string, key: string) {
	const res = await fetch(`https://api.whop.com/api/v1/members/${mberId}`, {
		headers: { Authorization: `Bearer ${key}` },
		cache: "no-store",
	});
	return res.ok ? res.json() : null;
}

const CHURN_ACTIONS = ["canceling", "churned", "left"];
const GRACE_MS = 3 * 24 * 60 * 60 * 1000;

async function handle(req: NextRequest) {
	if (!process.env.CRON_SECRET && !process.env.SNAPSHOT_SECRET) {
		return NextResponse.json({ error: "No auth configured" }, { status: 500 });
	}
	if (!authorized(req)) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	const key = process.env.WHOP_API_KEY;
	if (!key) return NextResponse.json({ error: "Missing WHOP_API_KEY" }, { status: 500 });

	const supabase = createAdminClient();

	// Commission-relevant members: confirmed paying (detect stops) or currently active.
	const { data: members, error } = await supabase
		.from("members")
		.select("id, whop_member_id, username, commission_active, status")
		.or("commission_active.eq.true,status.eq.active")
		.not("whop_member_id", "is", null);
	if (error) {
		return NextResponse.json({ error: "read members failed", detail: error.message }, { status: 500 });
	}

	// Dedup against existing OPEN flags so a daily run doesn't pile up duplicates.
	const { data: openFlags } = await supabase
		.from("member_flags")
		.select("member_id, flag_type")
		.eq("status", "open");
	const seen = new Set((openFlags ?? []).map((f) => `${f.member_id}:${f.flag_type}`));

	const now = Date.now();
	const toInsert: { member_id: string; flag_type: string; detail: string; status: string }[] = [];
	let checked = 0;

	for (const m of members ?? []) {
		const wm = await fetchWhopMember(m.whop_member_id as string, key);
		if (!wm) continue;
		checked++;
		const action: string | null = wm.most_recent_action ?? null;
		const at = wm.most_recent_action_at ? Date.parse(wm.most_recent_action_at) : null;

		const found: [string, string][] = [];
		// Payment stopped: a member you're being paid for is now churning/left.
		if (m.commission_active === true && action && CHURN_ACTIONS.includes(action)) {
			found.push(["payment_stopped", `${m.username}: commission_active but Whop action is '${action}'`]);
		}
		// Payment overdue: renewal was expected (most_recent_action_at) but hasn't happened.
		if (action === "renewing" && at && at < now - GRACE_MS) {
			found.push(["payment_overdue", `${m.username}: renewal expected ${wm.most_recent_action_at}, past grace`]);
		}

		for (const [flag_type, detail] of found) {
			const k = `${m.id}:${flag_type}`;
			if (seen.has(k)) continue;
			seen.add(k);
			toInsert.push({ member_id: m.id as string, flag_type, detail, status: "open" });
		}
	}

	if (toInsert.length) {
		const { error: insErr } = await supabase.from("member_flags").insert(toInsert);
		if (insErr) {
			return NextResponse.json({ error: "insert flags failed", detail: insErr.message }, { status: 500 });
		}
	}
	return NextResponse.json({ checked, flagged: toInsert.length });
}

export async function GET(req: NextRequest) {
	return handle(req);
}
export async function POST(req: NextRequest) {
	return handle(req);
}
