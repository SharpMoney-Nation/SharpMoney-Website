import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { getAuthContext } from "@/lib/admin";

// Item 5 — admin-only assignment queue.
// GET  -> { members: unassigned (affiliate_id null), affiliates: [{id, whop_username, display_name}] }
// POST { member_id, affiliate_id } -> assign a captured member to an affiliate.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin() {
	const { user, isAdmin } = await getAuthContext();
	if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
	if (!isAdmin) return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
	return { error: null };
}

export async function GET() {
	const { error } = await requireAdmin();
	if (error) return error;
	const supabase = createAdminClient();
	const [{ data: members }, { data: affiliates }] = await Promise.all([
		supabase
			.from("members")
			.select("id, whop_member_id, username, product, plan_price_usd, status, referred_at")
			.is("affiliate_id", null)
			.order("referred_at", { ascending: false }),
		supabase
			.from("affiliates")
			.select("id, whop_username, display_name")
			.neq("source", "system")
			.order("whop_username"),
	]);
	return NextResponse.json({ members: members ?? [], affiliates: affiliates ?? [] });
}

export async function POST(req: NextRequest) {
	const { error } = await requireAdmin();
	if (error) return error;
	let body: { member_id?: string; affiliate_id?: string };
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
	}
	if (!body.member_id || !body.affiliate_id) {
		return NextResponse.json({ error: "member_id and affiliate_id required" }, { status: 400 });
	}
	const supabase = createAdminClient();
	// Only assign rows that are currently unassigned (guard against races).
	const { data, error: upErr } = await supabase
		.from("members")
		.update({ affiliate_id: body.affiliate_id })
		.eq("id", body.member_id)
		.is("affiliate_id", null)
		.select("id");
	if (upErr) return NextResponse.json({ error: "assign failed", detail: upErr.message }, { status: 500 });
	if (!data?.length) return NextResponse.json({ error: "member not found or already assigned" }, { status: 409 });
	return NextResponse.json({ assigned: body.member_id, to: body.affiliate_id });
}
