import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server Supabase client bound to the request's auth cookies. Uses the anon key
// and the signed-in user's session, so RLS enforces own-rows-only access.
// The service key is NEVER used in the portal — RLS does the filtering.
export async function createClient() {
	const cookieStore = await cookies();

	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						cookiesToSet.forEach(({ name, value, options }) =>
							cookieStore.set(name, value, options)
						);
					} catch {
						// setAll called from a Server Component — safe to ignore; the
						// browser client refreshes the session on the next client request.
					}
				},
			},
		}
	);
}
