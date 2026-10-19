import { APP_URL } from '@/lib/app-url';

// ============================================================================
// Whop constants for the landing-page join box (plan: core-first landing;
// Elements port: sharpmoney-whop-app tasks/plans/website-join-elements-plan.md).
//
// CORE_PLAN_ID: the $0 "free forever" Core plan. The SOURCE OF TRUTH is the
// app repo, sharpmoney-whop-app/src/config/tiers.ts (WHOP_PLANS.CORE, which is
// itself overridable there by WHOP_PLAN_CORE). If the plan id ever changes,
// change it in BOTH repos, or set NEXT_PUBLIC_WHOP_CORE_PLAN_ID on the site.
//
// JOIN_EMBED_ENABLED: build-time lever (NEXT_PUBLIC_* is inlined by Next).
// Setting NEXT_PUBLIC_JOIN_EMBED=off on Railway and rebuilding swaps the
// Whop box for a plain button to the app's /signup page.
//
// JOIN_CHECKOUT_CONFIG: the Whop checkout configuration (`ch_...`) that gives
// the Elements box its SUCCESS redirect (/join/complete on this site). The id
// is PUBLIC (it is inlined into the page either way), so it lives here as a
// constant and the deploy carries it; no hosting setting is needed. Created
// 2026-10-16 by the ops kit dev/sm-ops/website-join-elements/create-config.mjs
// (operator paste, account key): mode payment, plan CORE_PLAN_ID, redirect_url
// https://www.betsharpmoney.com/join/complete, dark band + cyan button.
// NEXT_PUBLIC_JOIN_CHECKOUT_CONFIG (build-time) overrides it, e.g. to point a
// test build at a configuration whose redirect_url is that build's host.
// Without a valid `ch_` value the box is NOT rendered (a plan-only Elements
// session would land the buyer on whop.com); the plain button renders instead.
// ============================================================================

export const CORE_PLAN_ID =
  process.env.NEXT_PUBLIC_WHOP_CORE_PLAN_ID || 'plan_q2zQ6EHBluewl';

/** Affiliate slug carried into Whop for attribution (do not change). */
export const CORE_AFFILIATE = 'websitecore';

export const JOIN_EMBED_ENABLED = process.env.NEXT_PUBLIC_JOIN_EMBED !== 'off';

/** The live Core checkout configuration for www.betsharpmoney.com (see the header note). */
export const JOIN_CHECKOUT_CONFIG_DEFAULT = 'ch_OIp7WFXpcc0ilrj';

export const JOIN_CHECKOUT_CONFIG =
  process.env.NEXT_PUBLIC_JOIN_CHECKOUT_CONFIG || JOIN_CHECKOUT_CONFIG_DEFAULT;

const CHECKOUT_CONFIG_ID_PATTERN = /^ch_[A-Za-z0-9]{6,40}$/;

/** True when the Elements box may render: the lever is on AND a real `ch_` id is configured. */
export function joinBoxEnabled(
  enabled: boolean = JOIN_EMBED_ENABLED,
  configId: string = JOIN_CHECKOUT_CONFIG,
): boolean {
  return enabled && CHECKOUT_CONFIG_ID_PATTERN.test(configId);
}

/** Where a finished Elements join lands (the configuration's redirect_url and the element's returnUrl). */
export const JOIN_COMPLETE_PATH = '/join/complete';

/** The app's own signup page — the escape hatch when the box cannot load. */
export const CORE_SIGNUP_FALLBACK = `${APP_URL}/signup?plan=core&a=${CORE_AFFILIATE}`;

/** Existing members: the app's "Sign in with Whop" door, landing on the tool. */
export const LOGIN_URL = `${APP_URL}/api/oauth/init?next=%2Fev`;

/**
 * After the join completes: the same login door, plus just_bought=1 so the
 * app can guard against a slow Whop grant (auto-retry + "setting up" banner).
 */
export const JOIN_DONE_URL = `${APP_URL}/api/oauth/init?next=%2Fev&just_bought=1`;
