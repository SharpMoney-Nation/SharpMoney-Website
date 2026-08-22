import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

// Daily checker — two tiers:
// 1) STATUS is factual and AUTO-MAINTAINED. Each run pulls live /members/{mber_}
//    for every non-free member and updates members.status; every transition is
//    logged to member_flags (flag_type 'status_change', status 'reviewed' = history).
// 2) COMMISSION_ACTIVE is NEVER auto-flipped. If a commission_active member goes
//    non-active, we raise an OPEN 'payment_stopped' flag for owner review only.
// Auth: Vercel cron Bearer CRON_SECRET, or manual ?secret=/x-snapshot-secret.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300; // status refresh fetches /members per non-free member

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

async function fetchWhopMember(mberId: string, key: string) {
	const res = await fetch(`https://api.whop.com/api/v1/members/${mberId}`, {
		headers: { Authorization: `Bearer ${key}` },
		cache: "no-store",
	});
	return res.ok ? res.json() : null;
}

// Factual status from live Whop member state. Returns null if action is unknown
// (leave status unchanged rather than guess).
function computeStatus(wm: any): string | null {
	const action: string | null = wm?.most_recent_action ?? null;
	const accessLost = wm?.status === "left";
	const at = wm?.most_recent_action_at ? Date.parse(wm.most_recent_action_at) : null;
	const daysPast = at != null ? (Date.now() - at) / 86400000 : null; // >0 => past

	if (accessLost || action === "left" || action === "churned") return "expired";
	if (action === "canceling") return "canceled_pending"; // still has access, cancel pending
	if (action === "renewing" || action === "active" || action === "joined" || action === "trialing") {
		if (daysPast == null || daysPast <= 30) return "active"; // next renewal future / within grace
		if (daysPast <= 40) return "lapsed"; // 31–40 days past expected, not renewed
		return "expired"; // >40 days past
	}
	return null;
}

const NON_ACTIVE = new Set(["canceled_pending", "lapsed", "expired"]);

async function handle(req: NextRequest) {
	if (!process.env.CRON_SECRET && !process.env.SNAPSHOT_SECRET) {
		return NextResponse.json({ error: "No auth configured" }, { status: 500 });
	}
	if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const key = process.env.WHOP_API_KEY;
	if (!key) return NextResponse.json({ error: "Missing WHOP_API_KEY" }, { status: 500 });

	const supabase = createAdminClient();
	const { data: members, error } = await supabase
		.from("members")
		.select("id, whop_member_id, username, status, commission_active")
		.neq("status", "free")
		.not("whop_member_id", "is", null);
	if (error) return NextResponse.json({ error: "read members failed", detail: error.message }, { status: 500 });

	// existing OPEN payment_stopped flags -> dedup commission review flags
	const { data: openFlags } = await supabase
		.from("member_flags")
		.select("member_id, flag_type")
		.eq("status", "open");
	const openSet = new Set((openFlags ?? []).map((f) => `${f.member_id}:${f.flag_type}`));

	const nowIso = new Date().toISOString();
	const historyFlags: any[] = [];
	const reviewFlags: any[] = [];
	const transitions: { username: string | null; from: string; to: string }[] = [];
	let checked = 0;

	for (const m of members ?? []) {
		const wm = await fetchWhopMember(m.whop_member_id as string, key);
		if (!wm) continue;
		checked++;
		const next = computeStatus(wm);
		if (next && next !== m.status) {
			// apply factual status change automatically
			const { error: upErr } = await supabase.from("members").update({ status: next }).eq("id", m.id);
			if (!upErr) {
				transitions.push({ username: m.username as string, from: m.status as string, to: next });
				historyFlags.push({
					member_id: m.id,
					flag_type: "status_change",
					detail: `${m.status} → ${next}`,
					status: "reviewed",
					reviewed_at: nowIso,
				});
			}
		}
		// commission stays flags-only: never auto-flip; flag for review if paying+now non-active
		const effective = next ?? (m.status as string);
		if (m.commission_active === true && NON_ACTIVE.has(effective)) {
			const k = `${m.id}:payment_stopped`;
			if (!openSet.has(k)) {
				openSet.add(k);
				reviewFlags.push({
					member_id: m.id,
					flag_type: "payment_stopped",
					detail: `${m.username}: commission_active but status is ${effective} — review commission`,
					status: "open",
				});
			}
		}
	}

	if (historyFlags.length || reviewFlags.length) {
		await supabase.from("member_flags").insert([...historyFlags, ...reviewFlags]);
	}

	return NextResponse.json({
		checked,
		statusChanged: transitions.length,
		commissionReviewFlags: reviewFlags.length,
		transitions,
	});
}

export async function GET(req: NextRequest) {
	return handle(req);
}
export async function POST(req: NextRequest) {
	return handle(req);
}
