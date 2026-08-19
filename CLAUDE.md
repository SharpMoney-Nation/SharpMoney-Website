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

### `active_members_count` is membership status, not paying customers

Confirmed by the 2026-08-02 analysis (affiliate `gamedaytrader`): Whop's
`active_members_count` counts membership **status** and includes non-billing
members (trials, comped, lapsed). It is only loosely coupled to MRR — some
affiliates lost active members with zero MRR change, while a real churn shows
active AND MRR dropping together. Never label or treat this field as "paying
customers." The `/memberships` endpoint models per-member status
(`active`/`past_due`/`canceled`/`expired`, `cancel_at_period_end`, etc.) but has
no affiliate attribution, so per-affiliate status breakdowns aren't available.

### Promo codes do NOT resolve to affiliates via the API

Payments carry a `promo_code` object (`{"id":"promo_..."}`) when a code was used,
but neither the payment nor the `/promo_codes` endpoint exposes any affiliate or
user linkage — a promo code only has `code`, `amount_off`, `promo_type`, `uses`,
`stock`, `company`. So there is **no** payment → promo_code → affiliate join in
the API. This reconfirms the no-member-level-attribution constraint above.

Promo codes are a mix of retention discounts (`cancel50`), channel codes
(`youtube10`), and per-affiliate codes (`sniper10` belongs to affiliate
`thesniper3`). The only way to map a code to an affiliate is a **manual lookup
table** (the `attribution_keys` table) — built from an owner-maintained sheet of
affiliate whop names, real names, and handles. The `sniper10` → `thesniper3`
mapping is seeded there as the first confirmed entry.

### Payment → affiliate attribution is NOT reachable via the API (verified 2026-08)

Confirmed by exhaustive probing: **there is no way to attribute a payment to the
receiving affiliate through the API** with our company key.
- **Payment objects** carry `application_fee` (null in practice) and
  `amount_after_fees` (present but inconsistent — sometimes exceeds the total),
  but **no affiliate reference of any kind** (no affiliate/user/reward/destination
  field). The admin-UI fee breakdown that names the affiliate is not exposed.
- **`/payouts`** and **`/transfers`** exist but require `payout:withdrawal:read` /
  `payout:transfer:read` scopes our key lacks (403). The only readable transfers
  (company-origin) are manual marketing payments, not affiliate commissions.
- **`/ledgers`, `/ledger`, `/balances`, `/commissions`, `/earnings`,
  `/transactions`** → 404 (don't exist).

**Retested with a payout-scoped key** (`payout:withdrawal:read` + `transfer:read`)
to be sure: it unlocked only `/payouts?account_id=<company>` — the **company's own
bank withdrawals** (aggregate `wdrl_...`, ~weekly, thousands of $), which carry **no
affiliate id and no source-payment reference**. Individual-affiliate queries
(`/payouts?user_id=`, `/transfers?destination_id=`) still 403; `/payout_requests`,
`/commissions`, `/balances`, `/ledger` still 404. Conclusion: commissions **accrue
invisibly to each affiliate's Whop ledger balance** (which they withdraw
themselves); a company key can't read affiliate balances/accruals/payouts.

So affiliate→member attribution stays **manual** (the `members` +
`attribution_keys` tables). This is not superseded by any API path.

### Member status IS reachable — `GET /api/v1/members/{mber_id}`

Given a member id (`mber_...`, from a manual referral-table paste), this returns
real membership state and is how we keep `members.status` fresh:
- `most_recent_action` → `renewing` / `canceling` / `churned` / `left`
  (mapped to our status: renewing→active, canceling→canceled_pending,
  churned→lapsed, left→expired; `$0` spend → free).
- also `joined_at` (use as `referred_at`), `usd_total_spent`, `access_level`.
- Note: `mber_` = **member** id, `mem_` = **membership** id — they differ.
  `/memberships/{mber_}` 404s; use `/members/{mber_}`.

### `data/` is gitignored — personal data

The affiliate application sheet (`data/affiliates.csv`) and any derived files
(e.g. `data/affiliate-sheet-status.csv`) contain **real names, emails, and
Discord handles**. The whole `/data/` folder is gitignored and must never be
committed. Reconcile/backfill scripts read from it locally only.

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
   affiliate's individual numbers. See the Auth section below.

## Auth (per-affiliate portal)

Supabase email/password auth. Key rules:

- **Admin-created accounts only — there is NO signup page, ever.** Public signups
  are disabled in Supabase; accounts are provisioned by an admin. Do not add a
  self-serve registration flow.
- **`affiliates.auth_user_id`** (uuid, unique, FK → `auth.users`) links a login
  to its affiliate row. This is the join between an authenticated user and their
  stats.
- **Portal access is only for `source='sheet'` affiliates.** Only affiliates who
  filled out the application sheet get a login; `whop_only` and `system` accounts
  do not get portal access.
- A test auth user is linked to `thesniper3`.

### Portal data access model

- Routes: `/portal/login` (client component, `signInWithPassword`) and `/portal`
  (server component, auth-guarded — redirects to `/portal/login` if no session).
  Supabase clients live in `src/lib/supabase/client.ts` (browser) and
  `src/lib/supabase/server.ts` (server, cookie-bound), both using `@supabase/ssr`.
- **The portal reads Supabase with the signed-in user's session only** — anon
  key + the user's JWT. It **never** uses the service-role key. RLS does all the
  filtering (own rows only).
- **RLS policies AND a base `GRANT SELECT ... TO authenticated` are both
  required.** The grant check runs *before* RLS, so with policies but no grant a
  query returns `403 permission denied for table ...` even for the correct user.
  Tables created via the SQL editor are NOT auto-granted, so this must be run
  explicitly: `grant select on public.affiliates, public.stat_snapshots to authenticated;`
  (portal is read-only, so SELECT is all `authenticated` gets).
- **Writes remain service-role only** (the snapshot writer via
  `src/lib/supabase-admin.ts`). `authenticated` has no insert/update/delete —
  verified: an authenticated INSERT returns 403.

### Admin auth (owner dashboard)

The owner dashboard shows **every** affiliate's revenue, so it is admin-only.
- **An admin = an authenticated Supabase user whose `app_metadata.role === "admin"`.**
  `app_metadata` is service-role-controlled (NOT user-editable, unlike
  `user_metadata`) and is validated by `getUser()`, so it's a trustworthy
  server-side check. No `is_admin` column / no admins table.
- Helper: `getAuthContext()` in `src/lib/admin.ts` → `{ user, isAdmin }`.
- **Gated (defense in depth):**
  - `/api/whop/affiliates` → 401 if logged out, 403 if non-admin (before any data access).
  - `/affiliates-dashboard` → server component redirects: logged-out → `/portal/login`,
    non-admin → `/portal`. UI lives in `DashboardClient.tsx`.
- **Grant admin:** set the claim via the Admin API, e.g. create/update the user with
  `app_metadata: { role: "admin" }` (`POST/PUT /auth/v1/admin/users`). To revoke,
  set role to null. Admins are provisioned by an owner; there is no self-serve path.
- Verified live (logged-out 401/redirect · affiliate 403/redirect · admin 200/200).

## Supabase schema (live)

Project URL in `NEXT_PUBLIC_SUPABASE_URL`; the anon/publishable key is public,
the **service-role** key (`SUPABASE_SERVICE_ROLE_KEY`, server-only, no
`NEXT_PUBLIC_` prefix) is used by the snapshot writer to bypass RLS. Column
names below are the exact live columns — do not guess (e.g. the snapshot
timestamp is `taken_at`, NOT `captured_at`).

### `affiliates` — one row per Whop affiliate (roster)
| column | type | notes |
|---|---|---|
| `id` | uuid | PK, default `gen_random_uuid()` |
| `created_at` | timestamptz | not null, default `now()` |
| `whop_affiliate_id` | text | not null, **unique** — upsert conflict key |
| `whop_username` | text | |
| `display_name` | text | |
| `status` | text | not null |
| `active` | boolean | not null (has a default) |
| `source` | text | not null, default `'whop_only'`, one of `sheet` / `whop_only` / `system` |
| `auth_user_id` | uuid | nullable, **unique**, FK → `auth.users` — links a login to this affiliate |

**`source` classification** (added after backfilling from the application sheet):
- `sheet` — affiliate filled out the application sheet (39 as of the backfill).
- `whop_only` — real affiliate with no sheet row (pre-program or the global lower-rate tier); **the default**, so new affiliates the snapshot writer upserts land here until reclassified.
- `system` — the store page + SharpMoney owners (`whopinc`, `home-page`, `homepagee`, `sharpmoneydiscord`, `mathwins`, `sigmasquirrel`, `robertjpeterson13`), not real external affiliates.

The affiliates dashboard/API (`/api/whop/affiliates`) filters out `source='system'` so owner numbers are honest; it reads the system `whop_affiliate_id`s from Supabase, so classifying more accounts needs no code change. The snapshot writer is intentionally NOT filtered — it captures every affiliate so the raw time series stays complete.

### `stat_snapshots` — one row per affiliate per capture (time series)
| column | type | notes |
|---|---|---|
| `id` | uuid | PK |
| `taken_at` | timestamptz | not null, default `now()` — the capture timestamp |
| `affiliate_id` | uuid | not null, FK → `affiliates.id` |
| `total_referrals` | integer | not null |
| `active_members` | integer | not null |
| `total_revenue_usd` | numeric | not null |
| `mrr_usd` | numeric | not null |
| `total_earnings_usd` | numeric | not null |
| `retention_pct` | numeric | nullable |
| `retention_90d_pct` | numeric | nullable |

### `attribution_keys` — manual code/handle → affiliate map
| column | type | notes |
|---|---|---|
| `id` | uuid | PK |
| `created_at` | timestamptz | not null, default `now()` |
| `affiliate_id` | uuid | not null, FK → `affiliates.id` |
| `key_type` | text | not null (e.g. promo_code) |
| `whop_key_id` | text | not null (e.g. the `promo_...` id) |
| `label` | text | nullable |

This is where the manual promo-code → affiliate mapping lives (Whop's API can't
provide it — see the promo-code note above).

### `members` — per-member roster, manually attributed to an affiliate
| column | type | notes |
|---|---|---|
| `id` | uuid | PK |
| `whop_member_id` | text | not null, **unique** (`mber_...`) |
| `username` | text | |
| `affiliate_id` | uuid | not null, FK → `affiliates.id` (on delete cascade) |
| `product` | text | e.g. "SharpMoney Alpha" |
| `plan_price_usd` | numeric(10,2) | |
| `monthly_reward_usd` | numeric(10,2) | the affiliate's monthly commission (≈35% of plan) |
| `referred_at` | timestamptz | member's Whop `joined_at` |
| `status` | text | default `active`; one of `active`/`canceled_pending`/`expired`/`free`/`lapsed` |
| `notes` | text | |
| `created_at` | timestamptz | default `now()` |

Populated from a manual referral-table paste (`data/<affiliate>-referrals.txt`,
gitignored) enriched with live status via `GET /api/v1/members/{mber_id}` (see
above). RLS: authenticated affiliates SELECT only their own members (own-rows via
`affiliate_id`, same as `stat_snapshots`); writes are service-role only.
Backfilled first for `gamedaytrader` (30 members).

### Snapshot writer — `POST/GET /api/snapshots/run`

`src/app/api/snapshots/run/route.ts` fetches affiliates from Whop (shared
`src/lib/whop.ts`), upserts the `affiliates` roster on `whop_affiliate_id`, then
inserts one `stat_snapshots` row per affiliate. Returns
`{ snapshotted, newAffiliates }`. Guarded by `SNAPSHOT_SECRET` — pass
`?secret=...` or the `x-snapshot-secret` header; it fails closed (401) if the
secret is missing or wrong. Uses the service-role client
(`src/lib/supabase-admin.ts`), which requires table grants to `service_role`.

## Dev

- `npm run dev` — start the dev server (Next.js) on http://localhost:3000
- Dashboard: http://localhost:3000/affiliates-dashboard
- `npm run build`, `npm run start`, `npm run lint`
