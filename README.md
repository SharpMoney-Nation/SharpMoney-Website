This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## The home-page join box (Whop Elements)

The free Core "Join" box on the home page runs on Whop Elements (`src/components/JoinCoreEmbed.tsx` ->
`JoinElementsBox.tsx`). A finished join is redirected by Whop to `/join/complete`, which fires the
sign-up events (GA, Meta, X, Whop pixel; `src/lib/joinEvents.ts` waits for each tracker, 3 s cap) and
hands the visitor to the app's login door. Plan of record: sharpmoney-whop-app
`tasks/plans/website-join-elements-plan.md`.

The checkout configuration id is a public value and lives in the code: `JOIN_CHECKOUT_CONFIG_DEFAULT` in
`src/lib/whop.ts` (`ch_OIp7WFXpcc0ilrj`, mode payment, the $0 Core plan, `redirect_url`
`https://www.betsharpmoney.com/join/complete`). The deploy carries it; no hosting setting is needed. It
was created by the ops kit `dev/sm-ops/website-join-elements/create-config.mjs` (operator paste, account
key). To replace it: create a new configuration with the kit (`--force-new`), change the constant, deploy.

Build-time switches (Railway service for www.betsharpmoney.com; `NEXT_PUBLIC_*` is inlined, so a change
needs a rebuild). None is required for the live box:

| Variable | Meaning |
|---|---|
| `NEXT_PUBLIC_JOIN_EMBED` | `off` replaces the box with the plain JOIN FREE link. Any other value (or unset) = on. If it was set to `off` as a stopgap, UNSET it in the same change that ships the Elements box, or the box stays hidden. |
| `NEXT_PUBLIC_JOIN_CHECKOUT_CONFIG` | optional override of the configuration id (`ch_...`), e.g. a test build pointed at a configuration whose `redirect_url` is that build's host. An invalid value hides the box (plain JOIN FREE link). |
| `NEXT_PUBLIC_WHOP_CORE_PLAN_ID` | override of the $0 Core plan id (source of truth: the app repo `src/config/tiers.ts`). |

Order of a switch (never a link-out window on the live site): create the configuration -> put its id in
the code -> deploy -> QA one real free join on www (the trackers only fire there) -> operator's look.
Undo: set `NEXT_PUBLIC_JOIN_EMBED=off` and rebuild, or revert the deploy.

Checks: `npm run lint && npm run build && npm test`; after the build, `grep -rl sandbox.whop.com
.next/static/chunks` is empty and `grep -rl cdn.whop.com .next/static/chunks` lists only the
JoinElementsBox chunk; `npm ls @whop/checkout` is empty.

## Deploy

The site is served by Railway (www.betsharpmoney.com), built from `main`.

