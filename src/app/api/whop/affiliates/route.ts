import { NextResponse } from "next/server";
import { fetchAffiliates, WhopError } from "@/lib/whop";

export async function GET() {
	try {
		const affiliates = await fetchAffiliates();
		return NextResponse.json({ affiliates });
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
