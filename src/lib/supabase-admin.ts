import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-only Supabase client using the service-role key. This bypasses RLS,
// so it must NEVER be imported into client components or exposed to the browser.
// The service-role key lives in SUPABASE_SERVICE_ROLE_KEY (no NEXT_PUBLIC_ prefix).

// createClient expects the project base URL (https://<ref>.supabase.co), but our
// env var may include the REST path (".../rest/v1/"). Strip it so both forms work.
function baseUrl(): string {
	const raw = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
	return raw.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
}

export function createAdminClient(): SupabaseClient {
	const url = baseUrl();
	const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
	if (!serviceKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
	return createClient(url, serviceKey, {
		auth: { persistSession: false, autoRefreshToken: false },
	});
}
