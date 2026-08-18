import { NextRequest, NextResponse } from "next/server";
import { fetchAffiliates, WhopError } from "@/lib/whop";
import { createAdminClient } from "@/lib/supabase-admin";

// Snapshot writer: pulls current affiliate totals from Whop, upserts the
// affiliate roster into Supabase, and appends one stat_snapshots row per
// affiliate. Run on a schedule; monthly breakdowns come from diffing snapshots.
//
// Guarded so it can't be triggered publicly once deployed. Two accepted paths:
//   1. Vercel Cron — Vercel sends `Authorization: Bearer $CRON_SECRET` (set the
//      CRON_SECRET env var; scheduled in vercel.json). This is how the daily run authenticates.
//   2. Manual — `?secret=...` or `x-snapshot-secret` header against SNAPSHOT_SECRET.
// GET and POST both work.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(req: NextRequest): boolean {
	// Vercel Cron auth pattern (no secret in the URL).
	const cronSecret = process.env.CRON_SECRET;
	if (cronSecret && req.headers.get("authorization") === `Bearer ${cronSecret}`) {
		return true;
	}
	// Manual invocation.
	const manual = process.env.SNAPSHOT_SECRET;
	if (manual) {
		const provided =
			req.nextUrl.searchParams.get("secret") ?? req.headers.get("x-snapshot-secret");
		if (provided === manual) return true;
	}
	return false;
}

async function handle(req: NextRequest) {
	if (!process.env.CRON_SECRET && !process.env.SNAPSHOT_SECRET) {
		return NextResponse.json({ error: "No snapshot auth configured" }, { status: 500 });
	}
	if (!authorized(req)) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	// 1) Current totals from Whop (same endpoint + filters as the live dashboard).
	let affiliates;
	try {
		affiliates = await fetchAffiliates();
	} catch (e) {
		if (e instanceof WhopError) {
			return NextResponse.json(
				{ error: e.message, detail: e.detail || undefined },
				{ status: e.status }
			);
		}
		return NextResponse.json({ error: "Whop fetch failed", detail: String(e) }, { status: 500 });
	}

	if (affiliates.length === 0) {
		return NextResponse.json({ snapshotted: 0, newAffiliates: 0 });
	}

	const supabase = createAdminClient();

	// 2a) Which affiliates already exist? (to report how many are new)
	const { data: existing, error: existingErr } = await supabase
		.from("affiliates")
		.select("whop_affiliate_id");
	if (existingErr) {
		return NextResponse.json(
			{ error: "Failed to read affiliates", detail: existingErr.message },
			{ status: 500 }
		);
	}
	const existingIds = new Set((existing ?? []).map((r) => r.whop_affiliate_id));
	const newAffiliates = affiliates.filter((a) => !existingIds.has(a.id)).length;

	// 2b) Upsert the roster (insert new, refresh username/name/status on existing).
	const { data: upserted, error: upsertErr } = await supabase
		.from("affiliates")
		.upsert(
			affiliates.map((a) => ({
				whop_affiliate_id: a.id,
				whop_username: a.username,
				display_name: a.name,
				status: a.status,
			})),
			{ onConflict: "whop_affiliate_id" }
		)
		.select("id, whop_affiliate_id");
	if (upsertErr) {
		return NextResponse.json(
			{ error: "Failed to upsert affiliates", detail: upsertErr.message },
			{ status: 500 }
		);
	}

	// Map whop_affiliate_id -> affiliates.id so snapshots reference the local row.
	const idByWhop = new Map((upserted ?? []).map((r) => [r.whop_affiliate_id, r.id]));

	// 3) One snapshot row per affiliate with their current totals.
	const snapshotRows = affiliates
		.map((a) => {
			const affiliateId = idByWhop.get(a.id);
			if (affiliateId == null) return null;
			return {
				affiliate_id: affiliateId,
				total_referrals: a.referrals,
				active_members: a.activeMembers,
				total_revenue_usd: a.revenueUsd,
				mrr_usd: a.mrrUsd,
				total_earnings_usd: a.earningsUsd,
				retention_pct: a.retentionPct,
				retention_90d_pct: a.retention90dPct,
			};
		})
		.filter((r): r is NonNullable<typeof r> => r !== null);

	const { error: snapErr } = await supabase.from("stat_snapshots").insert(snapshotRows);
	if (snapErr) {
		return NextResponse.json(
			{ error: "Failed to insert snapshots", detail: snapErr.message },
			{ status: 500 }
		);
	}

	// 4) Summary.
	return NextResponse.json({ snapshotted: snapshotRows.length, newAffiliates });
}

export async function GET(req: NextRequest) {
	return handle(req);
}

export async function POST(req: NextRequest) {
	return handle(req);
}
