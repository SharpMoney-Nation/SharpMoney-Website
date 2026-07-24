// Shared Whop affiliate fetching + cleaning.
// Used by the live dashboard route (/api/whop/affiliates) and the snapshot
// writer (/api/snapshots/run) so the endpoint and filters stay identical.

const COMPANY_ID = "biz_lbUgwQ0bQ8BxtD";

export type CleanAffiliate = {
	id: string;
	username: string;
	name: string;
	status: string;
	referrals: number;
	activeMembers: number;
	revenueUsd: number;
	mrrUsd: number;
	earningsUsd: number;
	retentionPct: number;
	retention90dPct: number;
};

// Thrown on any Whop-side failure so callers can map it to an HTTP response.
export class WhopError extends Error {
	status: number;
	detail: string;
	constructor(status: number, message: string, detail = "") {
		super(message);
		this.name = "WhopError";
		this.status = status;
		this.detail = detail;
	}
}

// Converts "$9,556.36" -> 9556.36 and "57.94%" -> 57.94
function toNumber(value: unknown): number {
	if (typeof value === "number") return value;
	if (typeof value !== "string") return 0;
	const cleaned = value.replace(/[$,%\s,]/g, "");
	const n = parseFloat(cleaned);
	return isNaN(n) ? 0 : n;
}

// Whop paginates /affiliates with a cursor: the response carries a `page_info`
// { end_cursor, has_next_page }, and the next page is requested with `after=<end_cursor>`.
// Safety cap so a misbehaving cursor can't loop forever (100 pages * 100 = 10k affiliates).
const MAX_PAGES = 100;

// Fetches ALL of the company's affiliates from Whop (paging through every result)
// and returns cleaned rows, excluding the 'whop' store-page user and any archived affiliates.
export async function fetchAffiliates(): Promise<CleanAffiliate[]> {
	const key = process.env.WHOP_API_KEY;
	if (!key) {
		throw new WhopError(500, "Missing WHOP_API_KEY");
	}

	const list: any[] = [];
	let after: string | null = null;

	for (let page = 0; page < MAX_PAGES; page++) {
		const url = new URL("https://api.whop.com/api/v1/affiliates");
		url.searchParams.set("company_id", COMPANY_ID);
		if (after) url.searchParams.set("after", after);

		const res = await fetch(url, {
			headers: { Authorization: `Bearer ${key}` },
			cache: "no-store",
		});

		if (!res.ok) {
			const text = await res.text();
			throw new WhopError(502, "Whop request failed", text);
		}

		const raw = await res.json();
		if (Array.isArray(raw?.data)) list.push(...raw.data);

		const pageInfo = raw?.page_info ?? {};
		if (!pageInfo.has_next_page || !pageInfo.end_cursor) break;
		after = pageInfo.end_cursor as string;
	}

	return list
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
}
