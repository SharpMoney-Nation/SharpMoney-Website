/**
 * Canonical base URL of the SharpMoney app (login, signup, checkout).
 *
 * Every Login / Buy link on the website builds from this constant — never
 * hardcode an app host in a page again. The old host
 * (sharpmoney-whop-app.vercel.app) is legacy: it keeps working via a
 * redirect, but must not appear in customer-facing links.
 * Cutover record: sharpmoney-whop-app repo,
 * tasks/plans/canonical-domain-cutover-plan.md.
 */
export const APP_URL = 'https://app.betsharpmoney.com';
