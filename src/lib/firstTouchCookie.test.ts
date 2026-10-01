import { describe, expect, it } from 'vitest';
import { firstTouchSetCookie, publicRequestUrl, type FirstTouchRequest } from './firstTouchCookie';
import { parseFirstTouch } from './firstTouch';

const NOW = Date.UTC(2026, 9, 1, 12);
const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';

function req(url: string, opts: { method?: string; headers?: Record<string, string>; hasCookie?: boolean } = {}): FirstTouchRequest {
  const h = new Map(Object.entries({ 'user-agent': IPHONE, ...(opts.headers || {}) }).map(([k, v]) => [k.toLowerCase(), v]));
  return { url: new URL(url), method: opts.method || 'GET', hasCookie: !!opts.hasCookie, headers: { get: (n: string) => h.get(n.toLowerCase()) ?? null } };
}

function valueOf(setCookie: string): string {
  return decodeURIComponent(setCookie.split(';')[0].split('=').slice(1).join('='));
}

describe('firstTouchSetCookie', () => {
  it('sets a 90-day, site-wide cookie on the first real page view', () => {
    const c = firstTouchSetCookie(req('https://www.betsharpmoney.com/?utm_source=youtube&utm_medium=video', { headers: { referer: 'https://www.youtube.com/' } }), NOW)!;
    expect(c).toMatch(/^sm_ft=/);
    expect(c).toContain('Max-Age=7776000');
    expect(c).toContain('Path=/');
    expect(c).toContain('SameSite=Lax');
    expect(c).toContain('Secure');
    expect(c).toContain('Domain=.betsharpmoney.com');
    expect(c).not.toMatch(/HttpOnly/i);
    expect(parseFirstTouch(valueOf(c))).toEqual({ src: 'youtube', med: 'video', ref: 'youtube.com', lp: '/', ts: NOW / 1000 });
  });

  it('uses the apex domain attribute on betsharpmoney.com too', () => {
    expect(firstTouchSetCookie(req('https://betsharpmoney.com/guides'), NOW)).toContain('Domain=.betsharpmoney.com');
  });

  it('uses a host-only cookie on preview and local hosts', () => {
    const c = firstTouchSetCookie(req('https://sharp-money-website.vercel.app/'), NOW)!;
    expect(c).not.toContain('Domain=');
    expect(firstTouchSetCookie(req('http://localhost:3000/'), NOW)).not.toContain('Secure');
  });

  it('never overwrites an existing first touch', () => {
    expect(firstTouchSetCookie(req('https://www.betsharpmoney.com/?utm_source=x', { hasCookie: true }), NOW)).toBeNull();
  });

  it.each([
    ['/api/internal/marketing-dashboard/session'],
    ['/internal/marketing-dashboard'],
    ['/_next/static/chunks/main.js'],
    ['/odds-table.html'],
    ['/sitemap.xml'],
    ['/logo.jpg'],
  ])('skips non-page path %s', (path) => {
    expect(firstTouchSetCookie(req('https://www.betsharpmoney.com' + path), NOW)).toBeNull();
  });

  it.each([
    [{ rsc: '1' }],
    [{ 'next-router-prefetch': '1' }],
    [{ 'sec-purpose': 'prefetch;prerender' }],
    [{ purpose: 'prefetch' }],
  ])('skips prefetch / RSC requests %j', (headers) => {
    expect(firstTouchSetCookie(req('https://www.betsharpmoney.com/tools', { headers }), NOW)).toBeNull();
  });

  it('skips bots and non-GET requests', () => {
    expect(firstTouchSetCookie(req('https://www.betsharpmoney.com/', { headers: { 'user-agent': 'Googlebot/2.1' } }), NOW)).toBeNull();
    expect(firstTouchSetCookie(req('https://www.betsharpmoney.com/', { method: 'POST' }), NOW)).toBeNull();
  });
});

describe('publicRequestUrl', () => {
  const hdr = (o: Record<string, string>) => ({ get: (n: string) => o[n] ?? null });
  it('uses the forwarded host and proto behind a proxy', () => {
    const u = publicRequestUrl(new URL('http://localhost:8080/tools?utm_source=x'), hdr({ 'x-forwarded-host': 'www.betsharpmoney.com', 'x-forwarded-proto': 'https' }));
    expect(u.toString()).toBe('https://www.betsharpmoney.com/tools?utm_source=x');
  });
  it('falls back to the host header, then the request url', () => {
    expect(publicRequestUrl(new URL('http://localhost:3000/'), hdr({ host: 'betsharpmoney.com' })).hostname).toBe('betsharpmoney.com');
    expect(publicRequestUrl(new URL('http://localhost:3000/'), hdr({})).hostname).toBe('localhost');
  });
});
