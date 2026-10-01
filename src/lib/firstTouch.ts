// ============================================================================
// First-touch source: where a visitor came from on their FIRST page view.
//
// Stored in the `sm_ft` cookie, set server-side by middleware.ts (so Safari's
// 7-day cap on script-written cookies does not apply), read in the browser to
// pass source tags into the join box and onto Pro/Alpha/whop.com links.
//
// Value: "v1." + base64url(JSON). Every field is normalized and capped; no
// click-id VALUES, no query strings, no personal data. Anything malformed is
// dropped (parse returns null).
// ============================================================================

export const FIRST_TOUCH_COOKIE = 'sm_ft';
export const FIRST_TOUCH_MAX_AGE_S = 90 * 24 * 60 * 60;
const VERSION = 'v1.';
const MAX_FIELD = 100;
const MAX_PATH = 200;

export type ClickIdType = 'fbclid' | 'gclid' | 'twclid' | 'ttclid' | 'msclkid';
const CLICK_IDS: ClickIdType[] = ['fbclid', 'gclid', 'twclid', 'ttclid', 'msclkid'];

export type FirstTouch = {
  src?: string; // utm_source
  med?: string; // utm_medium
  cmp?: string; // utm_campaign
  cnt?: string; // utm_content
  trm?: string; // utm_term
  clk?: ClickIdType; // which ad click id was present (never its value)
  ref?: string; // referrer domain only
  lp: string; // landing path only
  ts: number; // epoch seconds
};

const UTM_FIELDS: [keyof FirstTouch, string][] = [
  ['src', 'utm_source'],
  ['med', 'utm_medium'],
  ['cmp', 'utm_campaign'],
  ['cnt', 'utm_content'],
  ['trm', 'utm_term'],
];

/** Lowercase, spaces/+ to "_", strip anything outside [a-z0-9._-], cap at 100. Empty -> undefined. */
export function normalizeTag(raw: string | null | undefined): string | undefined {
  if (!raw) return undefined;
  const v = raw
    .toLowerCase()
    .replace(/[\s+]+/g, '_')
    .replace(/[^a-z0-9._-]/g, '')
    .slice(0, MAX_FIELD);
  return v || undefined;
}

function normalizePath(raw: string | null | undefined): string {
  if (!raw || raw[0] !== '/') return '/';
  const path = raw.split(/[?#]/)[0].replace(/[^A-Za-z0-9/._~-]/g, '').slice(0, MAX_PATH);
  return path || '/';
}

function referrerDomain(referrer: string | null | undefined, ownHost: string): string | undefined {
  if (!referrer) return undefined;
  try {
    const host = new URL(referrer).hostname.toLowerCase().replace(/^www\./, '');
    const own = ownHost.toLowerCase().replace(/^www\./, '');
    if (!host || host === own) return undefined;
    return host.replace(/[^a-z0-9.-]/g, '').slice(0, MAX_FIELD) || undefined;
  } catch {
    return undefined;
  }
}

/** Build a first touch from the landing URL and the request's referrer. */
export function buildFirstTouch(landingUrl: URL, referrer: string | null, nowMs: number): FirstTouch {
  const ft: FirstTouch = { lp: normalizePath(landingUrl.pathname), ts: Math.floor(nowMs / 1000) };
  for (const [key, param] of UTM_FIELDS) {
    const v = normalizeTag(landingUrl.searchParams.get(param));
    if (v) (ft as Record<string, unknown>)[key] = v;
  }
  const clk = CLICK_IDS.find((id) => landingUrl.searchParams.has(id));
  if (clk) ft.clk = clk;
  const ref = referrerDomain(referrer, landingUrl.hostname);
  if (ref) ft.ref = ref;
  return ft;
}

function toBase64Url(s: string): string {
  const b64 = typeof btoa === 'function' ? btoa(s) : Buffer.from(s, 'binary').toString('base64');
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(s: string): string {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  return typeof atob === 'function' ? atob(b64) : Buffer.from(b64, 'base64').toString('binary');
}

export function serializeFirstTouch(ft: FirstTouch): string {
  return VERSION + toBase64Url(JSON.stringify(ft));
}

/** Strict parse: wrong version, bad base64/JSON, or bad field types -> null. Fields re-normalized. */
export function parseFirstTouch(value: string | null | undefined): FirstTouch | null {
  if (!value || value.length > 1500 || !value.startsWith(VERSION)) return null;
  try {
    const raw = JSON.parse(fromBase64Url(value.slice(VERSION.length))) as Record<string, unknown>;
    if (!raw || typeof raw !== 'object') return null;
    if (typeof raw.lp !== 'string' || typeof raw.ts !== 'number' || !Number.isFinite(raw.ts)) return null;
    const ft: FirstTouch = { lp: normalizePath(raw.lp), ts: Math.floor(raw.ts) };
    for (const [key] of UTM_FIELDS) {
      const v = raw[key];
      if (v !== undefined) {
        if (typeof v !== 'string') return null;
        const n = normalizeTag(v);
        if (n) (ft as Record<string, unknown>)[key] = n;
      }
    }
    if (raw.clk !== undefined) {
      if (!CLICK_IDS.includes(raw.clk as ClickIdType)) return null;
      ft.clk = raw.clk as ClickIdType;
    }
    if (raw.ref !== undefined) {
      if (typeof raw.ref !== 'string') return null;
      const r = raw.ref.toLowerCase().replace(/[^a-z0-9.-]/g, '').slice(0, MAX_FIELD);
      if (r) ft.ref = r;
    }
    return ft;
  } catch {
    return null;
  }
}

/** utm_* params a first touch should contribute to an outgoing link or the join box. */
export function utmFromFirstTouch(ft: FirstTouch | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!ft) return out;
  for (const [key, param] of UTM_FIELDS) {
    const v = ft[key];
    if (typeof v === 'string' && v) out[param] = v;
  }
  // No utm tags but a known referrer: tag it so whop.com sees where they came from.
  if (!out.utm_source && ft.ref) {
    out.utm_source = ft.ref;
    out.utm_medium = 'referral';
  }
  return out;
}

/** Add first-touch utm_* to a URL string unless it already carries any utm_* param. Hash kept. */
export function appendFirstTouchUtm(href: string, ft: FirstTouch | null): string {
  const utm = utmFromFirstTouch(ft);
  if (!Object.keys(utm).length) return href;
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return href;
  }
  for (const k of url.searchParams.keys()) if (k.startsWith('utm_')) return href;
  for (const [k, v] of Object.entries(utm)) url.searchParams.set(k, v);
  return url.toString();
}

/** Links that leave for checkout: whop.com/c/... and the app's /signup page. */
export function isCheckoutLink(href: string, appUrl: string): boolean {
  try {
    const u = new URL(href);
    const app = new URL(appUrl);
    if (u.hostname === 'whop.com' && u.pathname.startsWith('/c/')) return true;
    return u.hostname === app.hostname && u.pathname === '/signup';
  } catch {
    return false;
  }
}

/** Read sm_ft from a document.cookie string. */
export function readFirstTouchCookie(cookieHeader: string): FirstTouch | null {
  for (const part of cookieHeader.split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    if (part.slice(0, i).trim() === FIRST_TOUCH_COOKIE) {
      return parseFirstTouch(decodeURIComponent(part.slice(i + 1).trim()));
    }
  }
  return null;
}
