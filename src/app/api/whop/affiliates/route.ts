import { NextResponse } from "next/server";

const COMPANY_ID = "biz_lbUgwQ0bQ8BxtD";

// Converts "$9,556.36" -> 9556.36 and "57.94%" -> 57.94
function toNumber(value: unknown): number {
	if (typeof value === "number") return value;
	if (typeof value !== "string") return 0;
	const cleaned = value.replace(/[$,%\s,]/g, "");
	const n = parseFloat(cleaned);
	return isNaN(n) ? 0 : n;
}

export async function GET() {
	const key = process.env.WHOP_API_KEY;
	if (!key) {
		return NextResponse.json({ error: "Missing WHOP_API_KEY" }, { status: 500 });
	}

	const res = await fetch(
		`https://api.whop.com/api/v1/affiliates?company_id=${COMPANY_ID}`,
		{ headers: { Authorization: `Bearer ${key}` }, cache: "no-store" }
	);

	if (!res.ok) {
		const text = await res.text();
		return NextResponse.json({ error: "Whop request failed", status: res.status, detail: text }, { status: 502 });
	}

	const raw = await res.json();
	const list = Array.isArray(raw?.data) ? raw.data : [];

	const affiliates = list
		.filter((a: any) => a?.user?.username !== "whop") // hide Whop store-page row
		.filter((a: any) => a?.status !== "archived") // hide archived affiliates
		.map((a: any) => ({
			id: a.id,
			username: a.user?.username ?? "unknown",
			name: a.user?.name ?? "",
			status: a.status,
			referrals: toNumber(a.total_referrals_count),
			activeMembers: toNumber(a.active_members_count),
			revenueUsd: toNumber(a.total_revenue_usd),
			mrrUsd: toNumber(a.monthly_recurring_revenue_usd),
			earningsUsd: toNumber(a.total_referral_earnings_usd),
			retentionPct: toNumber(a.customer_retention_rate),
			retention90dPct: toNumber(a.customer_retention_rate_ninety_days),
		}));

	return NextResponse.json({ affiliates });
}
