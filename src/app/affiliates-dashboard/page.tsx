import { redirect } from "next/navigation";
import { getAuthContext } from "@/lib/admin";
import AffiliatesDashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

// Owner dashboard — admin only. Logged-out users go to login; authenticated
// non-admins (e.g. affiliates) are sent to their own portal. The data API
// (/api/whop/affiliates) is independently gated too (defense in depth).
export default async function AffiliatesDashboardPage() {
	const { user, isAdmin } = await getAuthContext();
	if (!user) {
		redirect("/portal/login");
	}
	if (!isAdmin) {
		redirect("/portal");
	}
	return <AffiliatesDashboardClient />;
}
