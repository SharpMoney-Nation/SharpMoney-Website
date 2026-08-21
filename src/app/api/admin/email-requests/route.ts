import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { getAuthContext } from "@/lib/admin";

// Item 4 — admin-only email-request approvals.
// GET  -> pending requests with member + affiliate context.
// POST { request_id, action: "approve" | "deny" }
//   approve: fetch the member's email from Whop, store it in revealed_email so the
//            affiliate can see it (PII stored only on approved rows).

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin() {
	const { user, isAdmin } = await getAuthContext();
	if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	return null;
}

export async function GET() {
	const denied = await requireAdmin();
	if (denied) return denied;
	const supabase = createAdminClient();
	const { data, error } = await supabase
		.from("email_requests")
		.select("id, status, created_at, member:members(username, whop_member_id), affiliate:affiliates(whop_username)")
		.eq("status", "pending")
		.order("created_at", { ascending: true });
	if (error) return NextResponse.json({ error: "read failed", detail: error.message }, { status: 500 });
	return NextResponse.json({ requests: data ?? [] });
}

export async function POST(req: NextRequest) {
	const denied = await requireAdmin();
	if (denied) return denied;
	let body: { request_id?: string; action?: string };
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
	}
	if (!body.request_id || !["approve", "deny"].includes(body.action ?? "")) {
		return NextResponse.json({ error: "request_id and action(approve|deny) required" }, { status: 400 });
	}
	const supabase = createAdminClient();

	if (body.action === "deny") {
		const { error } = await supabase
			.from("email_requests")
			.update({ status: "denied", resolved_at: new Date().toISOString() })
			.eq("id", body.request_id)
			.eq("status", "pending");
		if (error) return NextResponse.json({ error: "deny failed", detail: error.message }, { status: 500 });
		return NextResponse.json({ ok: true, action: "denied" });
	}

	// approve: look up the member's whop id, fetch email from Whop, store it
	const { data: reqRow, error: reqErr } = await supabase
		.from("email_requests")
		.select("id, member:members(whop_member_id)")
		.eq("id", body.request_id)
		.eq("status", "pending")
		.maybeSingle();
	if (reqErr) return NextResponse.json({ error: "lookup failed", detail: reqErr.message }, { status: 500 });
	if (!reqRow) return NextResponse.json({ error: "request not found or already resolved" }, { status: 409 });

	const mber = (reqRow as any).member?.whop_member_id;
	const key = process.env.WHOP_API_KEY;
	let email: string | null = null;
	if (mber && key) {
		const res = await fetch("https://api.whop.com/api/v1/members/" + mber, {
			headers: { Authorization: "Bearer " + key },
			cache: "no-store",
		});
		if (res.ok) {
			const wm = await res.json();
			email = wm?.user?.email ?? null;
		}
	}
	if (!email) return NextResponse.json({ error: "could not fetch member email from Whop" }, { status: 502 });

	const { error: upErr } = await supabase
		.from("email_requests")
		.update({ status: "approved", revealed_email: email, resolved_at: new Date().toISOString() })
		.eq("id", body.request_id)
		.eq("status", "pending");
	if (upErr) return NextResponse.json({ error: "approve failed", detail: upErr.message }, { status: 500 });
	return NextResponse.json({ ok: true, action: "approved" });
}
