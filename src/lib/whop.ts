import { APP_URL } from '@/lib/app-url';

// ============================================================================
// Whop constants for the landing-page join box (plan: core-first landing).
//
// CORE_PLAN_ID: the $0 "free forever" Core plan. The SOURCE OF TRUTH is the
// app repo, sharpmoney-whop-app/src/config/tiers.ts (WHOP_PLANS.CORE, which is
// itself overridable there by WHOP_PLAN_CORE). If the plan id ever changes,
// change it in BOTH repos, or set NEXT_PUBLIC_WHOP_CORE_PLAN_ID on the site.
//
// JOIN_EMBED_ENABLED: build-time lever (NEXT_PUBLIC_* is inlined by Next).
// Setting NEXT_PUBLIC_JOIN_EMBED=off on Railway and rebuilding swaps the
// embedded Whop box for a plain button to the app's /signup page.
// ============================================================================

export const CORE_PLAN_ID =
  process.env.NEXT_PUBLIC_WHOP_CORE_PLAN_ID || 'plan_q2zQ6EHBluewl';

/** Affiliate slug carried into Whop for attribution (do not change). */
export const CORE_AFFILIATE = 'websitecore';

export const JOIN_EMBED_ENABLED = process.env.NEXT_PUBLIC_JOIN_EMBED !== 'off';

/** The app's own signup page — the escape hatch when the embed cannot load. */
export const CORE_SIGNUP_FALLBACK = `${APP_URL}/signup?plan=core&a=${CORE_AFFILIATE}`;

/** Existing members: the app's "Sign in with Whop" door, landing on the tool. */
export const LOGIN_URL = `${APP_URL}/api/oauth/init?next=%2Fev`;

/**
 * After the embed completes: the same login door, plus just_bought=1 so the
 * app can guard against a slow Whop grant (auto-retry + "setting up" banner).
 * The app ignores the param until its Phase 4 change is promoted.
 */
export const JOIN_DONE_URL = `${APP_URL}/api/oauth/init?next=%2Fev&just_bought=1`;
