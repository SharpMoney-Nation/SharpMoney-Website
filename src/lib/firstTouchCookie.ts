import { BOT_UA_PATTERN } from '@/lib/trackingGate';
import { buildFirstTouch, FIRST_TOUCH_COOKIE, FIRST_TOUCH_MAX_AGE_S, serializeFirstTouch } from '@/lib/firstTouch';

// Decides whether middleware.ts should set the first-touch cookie on this
// request, and builds the Set-Cookie value. Pure, so it is unit-tested.

export type FirstTouchRequest = {
  url: URL;
  method: string;
  headers: { get(name: string): string | null };
  hasCookie: boolean;
};

const BOT_RE = new RegExp(BOT_UA_PATTERN, 'i');

function isPrefetchOrRsc(h: FirstTouchRequest['headers']): boolean {
  return (
    h.get('rsc') !== null ||
    h.get('next-router-prefetch') !== null ||
    (h.get('sec-purpose') || '').includes('prefetch') ||
    (h.get('purpose') || '').includes('prefetch')
  );
}

/**
 * The URL the visitor actually typed. Behind Railway's proxy the server sees
 * an internal host, so use x-forwarded-host / x-forwarded-proto when present.
 */
export function publicRequestUrl(nextUrl: URL, headers: FirstTouchRequest['headers']): URL {
  const host = (headers.get('x-forwarded-host') || headers.get('host') || nextUrl.host).split(',')[0].trim();
  const proto = (headers.get('x-forwarded-proto') || nextUrl.protocol.replace(':', '')).split(',')[0].trim();
  try {
    return new URL(nextUrl.pathname + nextUrl.search, `${proto === 'http' ? 'http' : 'https'}://${host}`);
  } catch {
    return nextUrl;
  }
}

/** Returns the Set-Cookie header value, or null when nothing should be set. */
export function firstTouchSetCookie(req: FirstTouchRequest, nowMs: number): string | null {
  if (req.hasCookie || req.method !== 'GET') return null;
  const path = req.url.pathname;
  if (path.startsWith('/internal') || path.startsWith('/api') || path.startsWith('/_next')) return null;
  if (/\.[a-z0-9]+$/i.test(path)) return null; // files: .html, .png, .xml ...
  if (isPrefetchOrRsc(req.headers)) return null;
  if (BOT_RE.test(req.headers.get('user-agent') || '')) return null;

  const ft = buildFirstTouch(req.url, req.headers.get('referer'), nowMs);
  const host = req.url.hostname.toLowerCase();
  const domain = host === 'betsharpmoney.com' || host.endsWith('.betsharpmoney.com') ? '; Domain=.betsharpmoney.com' : '';
  const secure = req.url.protocol === 'https:' ? '; Secure' : '';
  return `${FIRST_TOUCH_COOKIE}=${encodeURIComponent(serializeFirstTouch(ft))}; Path=/; Max-Age=${FIRST_TOUCH_MAX_AGE_S}; SameSite=Lax${secure}${domain}`;
}
