import { NextResponse } from "next/server";
import { fetchAffiliates, WhopError } from "@/lib/whop";
import { createAdminClient } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET() {
	try {
		const affiliates = await fetchAffiliates();

		// Exclude affiliates classified as source='system' in Supabase (the store page
		// and SharpMoney owners) so the dashboard totals reflect real affiliates only.
		// Data-driven: marking more accounts 'system' later updates the dashboard with no code change.
		const supabase = createAdminClient();
		const { data, error } = await supabase
			.from("affiliates")
			.select("whop_affiliate_id")
			.eq("source", "system");
		if (error) {
			throw new Error("Failed to load system affiliates: " + error.message);
		}
		const systemIds = new Set((data ?? []).map((r) => r.whop_affiliate_id));

		const visible = affiliates.filter((a) => !systemIds.has(a.id));
		return NextResponse.json({ affiliates: visible });
	} catch (e) {
		if (e instanceof WhopError) {
			return NextResponse.json(
				{ error: e.message, status: e.status, detail: e.detail || undefined },
				{ status: e.status }
			);
		}
		return NextResponse.json({ error: "Unexpected error", detail: String(e) }, { status: 500 });
	}
}
