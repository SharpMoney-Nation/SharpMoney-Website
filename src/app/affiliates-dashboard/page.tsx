"use client";

// Owner dashboard: live affiliate stats pulled from /api/whop/affiliates

import { useEffect, useMemo, useState } from "react";

type Affiliate = {
  id: string; username: string; name: string; status: string;
  referrals: number; activeMembers: number; revenueUsd: number;
  mrrUsd: number; earningsUsd: number; retentionPct: number; retention90dPct: number;
};

const usd = (n: number) =>
  "$" + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function AffiliatesDashboard() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hideZero, setHideZero] = useState(true);
  const [sortKey, setSortKey] = useState<keyof Affiliate>("revenueUsd");

  useEffect(() => {
    fetch("/api/whop/affiliates")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error + (d.detail ? ": " + d.detail : ""));
        else setAffiliates(d.affiliates);
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  const rows = useMemo(() => {
    const filtered = hideZero ? affiliates.filter((a) => a.referrals > 0) : affiliates;
    return [...filtered].sort((a, b) => Number(b[sortKey]) - Number(a[sortKey]));
  }, [affiliates, hideZero, sortKey]);

  const totals = useMemo(
    () => ({
      count: rows.length,
      referrals: rows.reduce((s, a) => s + a.referrals, 0),
      revenue: rows.reduce((s, a) => s + a.revenueUsd, 0),
      mrr: rows.reduce((s, a) => s + a.mrrUsd, 0),
      earnings: rows.reduce((s, a) => s + a.earningsUsd, 0),
    }),
    [rows]
  );

  if (loading) return <main style={{ padding: 32, fontFamily: "sans-serif" }}>Loading affiliate data…</main>;
  if (error) return <main style={{ padding: 32, fontFamily: "sans-serif", color: "crimson" }}>Error: {error}</main>;

  return (
    <main style={{ padding: 32, maxWidth: 1100, margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1 style={{ marginBottom: 4 }}>Affiliate dashboard</h1>
      <p style={{ color: "#666", marginTop: 0 }}>
        Live totals from Whop · store-page &amp; owner rows hidden. Revenue &amp; MRR are generated
        for SharpMoney; commissions are paid to affiliates. &ldquo;Active&rdquo; is a
        membership-status count (includes non-billing members), not paying customers.
      </p>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", margin: "24px 0" }}>
        {[
          ["Affiliates shown", String(totals.count)],
          ["Total referrals", totals.referrals.toLocaleString()],
          ["Revenue to company", usd(totals.revenue)],
          ["MRR to company", usd(totals.mrr)],
          ["Commissions paid out", usd(totals.earnings)],
        ].map(([label, value]) => (
          <div key={label} style={{ background: "#f5f5f5", borderRadius: 8, padding: "12px 20px", minWidth: 150 }}>
            <div style={{ fontSize: 13, color: "#666" }}>{label}</div>
            <div style={{ fontSize: 22, fontWeight: 600 }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
        <label style={{ fontSize: 14 }}>
          Sort by{" "}
          <select value={sortKey} onChange={(e) => setSortKey(e.target.value as keyof Affiliate)}>
            <option value="revenueUsd">Revenue to company</option>
            <option value="referrals">Referrals</option>
            <option value="mrrUsd">MRR to company</option>
            <option value="earningsUsd">Commissions paid</option>
            <option value="retention90dPct">90-day retention</option>
            <option value="activeMembers">Active members</option>
          </select>
        </label>
        <label style={{ fontSize: 14 }}>
          <input type="checkbox" checked={hideZero} onChange={(e) => setHideZero(e.target.checked)} /> Hide zero-activity
        </label>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "2px solid #ddd" }}>
            <th style={{ padding: 8 }}>Affiliate</th>
            <th style={{ padding: 8, textAlign: "right" }}>Referrals</th>
            <th
              style={{ padding: 8, textAlign: "right" }}
              title="Membership-status count (includes non-billing members), not paying customers."
            >
              Active
            </th>
            <th style={{ padding: 8, textAlign: "right" }}>Revenue (to co.)</th>
            <th style={{ padding: 8, textAlign: "right" }}>MRR (to co.)</th>
            <th style={{ padding: 8, textAlign: "right" }}>Commissions</th>
            <th style={{ padding: 8, textAlign: "right" }}>Retention</th>
            <th style={{ padding: 8, textAlign: "right" }}>90d ret.</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((a) => (
            <tr key={a.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: 8, fontWeight: 600 }}>{a.username}</td>
              <td style={{ padding: 8, textAlign: "right" }}>{a.referrals.toLocaleString()}</td>
              <td style={{ padding: 8, textAlign: "right" }}>{a.activeMembers.toLocaleString()}</td>
              <td style={{ padding: 8, textAlign: "right" }}>{usd(a.revenueUsd)}</td>
              <td style={{ padding: 8, textAlign: "right" }}>{usd(a.mrrUsd)}</td>
              <td style={{ padding: 8, textAlign: "right" }}>{usd(a.earningsUsd)}</td>
              <td style={{ padding: 8, textAlign: "right" }}>{a.retentionPct.toFixed(1)}%</td>
              <td style={{ padding: 8, textAlign: "right" }}>{a.retention90dPct.toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
