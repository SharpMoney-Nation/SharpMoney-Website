"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	async function onLogout() {
		setLoading(true);
		const supabase = createClient();
		await supabase.auth.signOut();
		router.push("/portal/login");
		router.refresh();
	}

	return (
		<button
			onClick={onLogout}
			disabled={loading}
			className="px-4 py-2 rounded-xl border border-white/15 text-sm text-white/80 hover:bg-white/5 disabled:opacity-50"
		>
			{loading ? "…" : "Log out"}
		</button>
	);
}
