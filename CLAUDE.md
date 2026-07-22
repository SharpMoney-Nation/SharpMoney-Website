# SharpMoney Website

Next.js 16 (App Router) + React 19 + TypeScript site for SharpMoney. An
**affiliate portal** is being built on the `affiliate-tracking` branch.

## Affiliate data: Whop API

- Base URL: `https://api.whop.com/api/v1`
- Endpoints in use: `/affiliates` and `/payments`
- Auth: `Authorization: Bearer <WHOP_API_KEY>` — key lives in `.env.local` (never commit it)
- Company: `company_id=biz_lbUgwQ0bQ8BxtD`
- Server routes live under `src/app/api/whop/`; the dashboard UI is `src/app/affiliates-dashboard/page.tsx`.

### Key constraint (confirmed by testing)

Whop's API exposes **per-affiliate lifetime aggregates only**. It does **NOT**
expose member-level affiliate attribution — you cannot ask which individual
member was referred by which affiliate. This shapes the whole architecture below.

### Promo codes do NOT resolve to affiliates via the API

Payments carry a `promo_code` object (`{"id":"promo_..."}`) when a code was used,
but neither the payment nor the `/promo_codes` endpoint exposes any affiliate or
user linkage — a promo code only has `code`, `amount_off`, `promo_type`, `uses`,
`stock`, `company`. So there is **no** payment → promo_code → affiliate join in
the API. This reconfirms the no-member-level-attribution constraint above.

Promo codes are a mix of retention discounts (`cancel50`), channel codes
(`youtube10`), and per-affiliate codes (`sniper10` belongs to affiliate
`thesniper3`). The only way to map a code to an affiliate is a **manual lookup
table** — being built from an owner-maintained sheet of affiliate whop names,
real names, and handles.

### The `whop` affiliate is not a person

The affiliate with username `whop` represents **store-page attribution**, not a
human. It stays filtered out of all dashboards (see the `username !== "whop"`
filter in the affiliates route).

## Plan / architecture

1. **Snapshots → Supabase.** Because only lifetime aggregates are available,
   store periodic snapshots of each affiliate's totals in Supabase. Monthly (and
   other period) breakdowns are computed by diffing consecutive snapshots.
2. **Per-affiliate auth.** Add Supabase-auth logins so each affiliate signs in
   and sees **only their own stats plus company-wide totals** — never any other
   affiliate's individual numbers.

## Dev

- `npm run dev` — start the dev server (Next.js) on http://localhost:3000
- Dashboard: http://localhost:3000/affiliates-dashboard
- `npm run build`, `npm run start`, `npm run lint`
