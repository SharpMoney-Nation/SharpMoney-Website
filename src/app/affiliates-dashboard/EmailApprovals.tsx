"use client";

import { useEffect, useState } from "react";

type Req = {
	id: string;
	created_at: string;
	member: { username: string | null; whop_member_id: string } | null;
	affiliate: { whop_username: string | null } | null;
};

const td: React.CSSProperties = { padding: 8, borderBottom: "1px solid #eee" };

export default function EmailApprovals() {
	const [reqs, setReqs] = useState<Req[]>([]);
	const [busy, setBusy] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		fetch("/api/admin/email-requests")
			.then((r) => r.json())
			.then((d) => {
				if (d.error) setError(d.error);
				else setReqs(d.requests);
			})
			.catch((e) => setError(String(e)))
			.finally(() => setLoading(false));
	}, []);

	async function act(id: string, action: "approve" | "deny") {
		setBusy(id);
		try {
			const res = await fetch("/api/admin/email-requests", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ request_id: id, action }),
			});
			if (res.ok) setReqs((rs) => rs.filter((r) => r.id !== id));
			else {
				const d = await res.json().catch(() => ({}));
				setError(d.error || `${action} failed`);
			}
		} finally {
			setBusy(null);
		}
	}

	return (
		<section style={{ padding: 32, maxWidth: 1100, margin: "0 auto", fontFamily: "sans-serif" }}>
			<h2 style={{ marginBottom: 4 }}>Email requests {reqs.length ? `(${reqs.length})` : ""}</h2>
			<p style={{ color: "#666", marginTop: 0 }}>
				Affiliates requesting a member&apos;s email. Approving fetches it from Whop and reveals it to that affiliate only.
			</p>
			{loading ? (
				<p style={{ color: "#666" }}>Loading…</p>
			) : error ? (
				<p style={{ color: "crimson" }}>Error: {error}</p>
			) : reqs.length === 0 ? (
				<p style={{ color: "#666" }}>No pending requests.</p>
			) : (
				<table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
					<thead>
						<tr style={{ textAlign: "left", borderBottom: "2px solid #ddd" }}>
							<th style={{ padding: 8 }}>Affiliate</th>
							<th style={{ padding: 8 }}>Member</th>
							<th style={{ padding: 8 }}>Requested</th>
							<th style={{ padding: 8 }}></th>
						</tr>
					</thead>
					<tbody>
						{reqs.map((r) => (
							<tr key={r.id}>
								<td style={td}>{r.affiliate?.whop_username ?? "—"}</td>
								<td style={td}>
									{r.member?.username ?? "—"}
									<div style={{ color: "#999", fontSize: 11 }}>{r.member?.whop_member_id}</div>
								</td>
								<td style={td}>{new Date(r.created_at).toLocaleDateString()}</td>
								<td style={td}>
									<button disabled={busy === r.id} onClick={() => act(r.id, "approve")} style={{ marginRight: 8 }}>
										{busy === r.id ? "…" : "Approve"}
									</button>
									<button disabled={busy === r.id} onClick={() => act(r.id, "deny")}>
										Deny
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
