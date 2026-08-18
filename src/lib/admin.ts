import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

// Admin auth for the owner dashboard. An admin is an authenticated Supabase user
// whose service-role-controlled app_metadata carries role === "admin". app_metadata
// is NOT user-editable (unlike user_metadata) and is validated in getUser(), so this
// is a trustworthy server-side check.
export async function getAuthContext(): Promise<{ user: User | null; isAdmin: boolean }> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	const isAdmin = user?.app_metadata?.role === "admin";
	return { user, isAdmin };
}
