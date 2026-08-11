import { createBrowserClient } from "@supabase/ssr";

// Browser Supabase client for the affiliate portal. Uses the public anon key,
// so all access is constrained by RLS (own rows only). Never use the service key here.
export function createClient() {
	return createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);
}
