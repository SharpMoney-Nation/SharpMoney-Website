"use client";

import { useEffect, useState } from "react";

type UMember = {
	id: string;
	whop_member_id: string;
	username: string | null;
	product: string | null;
	plan_price_usd: number | null;
	status: string;
	referred_at: string | null;
};
type Aff = { id: string; whop_username: string | null; display_name: string | null };

const td: React.CSSProperties = { padding: 8, borderBottom: "1px solid #eee" };

export default function UnassignedQueue() {
	const [members, setMembers] = useState<UMember[]>([]);
	const [affiliates, setAffiliates] = useState<Aff[]>([]);
	const [choice, setChoice] = useState<Record<string, string>>({});
	const [busy, setBusy] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		fetch("/api/admin/unassigned")
			.then((r) => r.json())
			.then((d) => {
				if (d.error) setError(d.error);
				else {
					setMembers(d.members);
					setAffiliates(d.affiliates);
				}
			})
			.catch((e) => setError(String(e)))
			.finally(() => setLoading(false));
	}, []);

	async function assign(memberId: string) {
		const affiliate_id = choice[memberId];
		if (!affiliate_id) return;
		setBusy(memberId);
		try {
			const res = await fetch("/api/admin/unassigned", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ member_id: memberId, affiliate_id }),
			});
			if (res.ok) setMembers((ms) => ms.filter((m) => m.id !== memberId));
			else {
				const d = await res.json().catch(() => ({}));
				setError(d.error || "assign failed");
			}
		} finally {
			setBusy(null);
		}
	}

	return (
		<section style={{ padding: 32, maxWidth: 1100, margin: "0 auto", fontFamily: "sans-serif" }}>
			<h2 style={{ marginBottom: 4 }}>Unassigned members {members.length ? `(${members.length})` : ""}</h2>
			<p style={{ color: "#666", marginTop: 0 }}>
				Auto-captured from payments with no affiliate yet. Assign the ones that belong to an affiliate.
			</p>
			{loading ? (
				<p style={{ color: "#666" }}>Loading…</p>
			) : error ? (
				<p style={{ color: "crimson" }}>Error: {error}</p>
			) : members.length === 0 ? (
				<p style={{ color: "#666" }}>Queue is empty.</p>
			) : (
				<table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
					<thead>
						<tr style={{ textAlign: "left", borderBottom: "2px solid #ddd" }}>
							<th style={{ padding: 8 }}>Member</th>
							<th style={{ padding: 8 }}>Product</th>
							<th style={{ padding: 8, textAlign: "right" }}>Plan</th>
							<th style={{ padding: 8 }}>Status</th>
							<th style={{ padding: 8 }}>Assign to</th>
							<th style={{ padding: 8 }}></th>
						</tr>
					</thead>
					<tbody>
						{members.map((m) => (
							<tr key={m.id}>
								<td style={td}>
									{m.username ?? "—"}
									<div style={{ color: "#999", fontSize: 11 }}>{m.whop_member_id}</div>
								</td>
								<td style={td}>{(m.product ?? "—").replace("SharpMoney ", "")}</td>
								<td style={{ ...td, textAlign: "right" }}>
									{m.plan_price_usd != null ? "$" + m.plan_price_usd.toFixed(2) : "—"}
								</td>
								<td style={td}>{m.status}</td>
								<td style={td}>
									<select
										value={choice[m.id] ?? ""}
										onChange={(e) => setChoice((c) => ({ ...c, [m.id]: e.target.value }))}
									>
										<option value="">— pick affiliate —</option>
										{affiliates.map((a) => (
											<option key={a.id} value={a.id}>
												{a.whop_username} {a.display_name ? `(${a.display_name})` : ""}
											</option>
										))}
									</select>
								</td>
								<td style={td}>
									<button
										disabled={!choice[m.id] || busy === m.id}
										onClick={() => assign(m.id)}
									>
										{busy === m.id ? "…" : "Assign"}
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</section>
	);
}
