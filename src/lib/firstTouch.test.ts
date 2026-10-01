import { describe, expect, it } from 'vitest';
import {
  appendFirstTouchUtm,
  buildFirstTouch,
  isCheckoutLink,
  normalizeTag,
  parseFirstTouch,
  readFirstTouchCookie,
  serializeFirstTouch,
  utmFromFirstTouch,
} from './firstTouch';

const NOW = Date.UTC(2026, 9, 1, 12, 0, 0);
const APP = 'https://app.betsharpmoney.com';

describe('normalizeTag', () => {
  it.each([
    ['YouTube', 'youtube'],
    ['Core join free — homepage', 'core_join_free__homepage'],
    ['spring+promo 2026', 'spring_promo_2026'],
    ['a:b/c?d', 'abcd'],
    ['日本語', undefined],
    ['', undefined],
    [null, undefined],
  ])('%s -> %s', (raw, want) => {
    expect(normalizeTag(raw as string | null)).toBe(want);
  });

  it('caps at 100 characters', () => {
    expect(normalizeTag('x'.repeat(500))).toHaveLength(100);
  });
});

describe('buildFirstTouch', () => {
  it('keeps utm tags, click-id type, referrer domain and landing path only', () => {
    const url = new URL('https://www.betsharpmoney.com/tools/ev-calculator?utm_source=fb&utm_medium=paid_social&utm_campaign=123&fbclid=SECRETVALUE&email=a@b.com#join');
    const ft = buildFirstTouch(url, 'https://m.facebook.com/some/path?x=1', NOW);
    expect(ft).toEqual({ src: 'fb', med: 'paid_social', cmp: '123', clk: 'fbclid', ref: 'm.facebook.com', lp: '/tools/ev-calculator', ts: NOW / 1000 });
    expect(JSON.stringify(ft)).not.toContain('SECRETVALUE');
    expect(JSON.stringify(ft)).not.toContain('a@b.com');
  });

  it('drops a self-referrer', () => {
    const ft = buildFirstTouch(new URL('https://www.betsharpmoney.com/'), 'https://betsharpmoney.com/guides', NOW);
    expect(ft.ref).toBeUndefined();
  });

  it('handles a bare direct visit', () => {
    expect(buildFirstTouch(new URL('https://www.betsharpmoney.com/'), null, NOW)).toEqual({ lp: '/', ts: NOW / 1000 });
  });
});

describe('serialize / parse', () => {
  it('round-trips', () => {
    const ft = buildFirstTouch(new URL('https://www.betsharpmoney.com/?utm_source=youtube&utm_medium=video&gclid=1'), 'https://www.youtube.com/', NOW);
    expect(parseFirstTouch(serializeFirstTouch(ft))).toEqual(ft);
  });

  it.each([
    ['missing version', 'eyJscCI6Ii8iLCJ0cyI6MX0'],
    ['wrong version', 'v2.eyJscCI6Ii8iLCJ0cyI6MX0'],
    ['bad base64/json', 'v1.%%%not-json'],
    ['oversized', 'v1.' + 'A'.repeat(2000)],
    ['empty', ''],
  ])('drops %s', (_label, value) => {
    expect(parseFirstTouch(value)).toBeNull();
  });

  it('drops a cookie with a bad click-id type or wrong field types', () => {
    const enc = (o: unknown) => 'v1.' + Buffer.from(JSON.stringify(o)).toString('base64url');
    expect(parseFirstTouch(enc({ lp: '/', ts: 1, clk: 'evil' }))).toBeNull();
    expect(parseFirstTouch(enc({ lp: '/', ts: 1, src: 42 }))).toBeNull();
    expect(parseFirstTouch(enc({ lp: 5, ts: 1 }))).toBeNull();
    expect(parseFirstTouch(enc({ lp: '/' }))).toBeNull();
  });

  it('re-normalizes a tampered cookie instead of trusting it', () => {
    const enc = 'v1.' + Buffer.from(JSON.stringify({ lp: '/x?token=1', ts: 1, src: 'EVIL<script>', ref: 'Bad Host!.com' })).toString('base64url');
    expect(parseFirstTouch(enc)).toEqual({ lp: '/x', ts: 1, src: 'evilscript', ref: 'badhost.com' });
  });

  it('reads sm_ft out of a cookie header', () => {
    const ft = { lp: '/', ts: 5, src: 'x' };
    expect(readFirstTouchCookie(`a=1; sm_ft=${encodeURIComponent(serializeFirstTouch(ft))}; b=2`)).toEqual(ft);
    expect(readFirstTouchCookie('a=1')).toBeNull();
  });
});

describe('utm passthrough', () => {
  it('maps fields to utm_* params', () => {
    expect(utmFromFirstTouch({ lp: '/', ts: 1, src: 'youtube', med: 'video', cmp: 'nfl' })).toEqual({ utm_source: 'youtube', utm_medium: 'video', utm_campaign: 'nfl' });
  });

  it('falls back to the referrer domain when there are no utm tags', () => {
    expect(utmFromFirstTouch({ lp: '/', ts: 1, ref: 'google.com' })).toEqual({ utm_source: 'google.com', utm_medium: 'referral' });
  });

  it('adds nothing for a direct visit or no cookie', () => {
    expect(utmFromFirstTouch({ lp: '/', ts: 1 })).toEqual({});
    expect(utmFromFirstTouch(null)).toEqual({});
  });

  it('appends to a checkout link and keeps the hash and existing params', () => {
    const out = appendFirstTouchUtm('https://whop.com/c/pro-7e/websitepro#top', { lp: '/', ts: 1, src: 'youtube' });
    expect(out).toBe('https://whop.com/c/pro-7e/websitepro?utm_source=youtube#top');
    const out2 = appendFirstTouchUtm(`${APP}/signup?plan=pro&a=websitepro`, { lp: '/', ts: 1, src: 'x', med: 'y' });
    expect(new URL(out2).searchParams.get('plan')).toBe('pro');
    expect(new URL(out2).searchParams.get('utm_source')).toBe('x');
  });

  it('never overrides utm tags already on the link, and never double-appends', () => {
    const href = 'https://whop.com/c/pro-7e/websitepro?utm_source=guide';
    expect(appendFirstTouchUtm(href, { lp: '/', ts: 1, src: 'youtube' })).toBe(href);
    const once = appendFirstTouchUtm('https://whop.com/c/x', { lp: '/', ts: 1, src: 'a' });
    expect(appendFirstTouchUtm(once, { lp: '/', ts: 1, src: 'a' })).toBe(once);
  });

  it.each([
    ['https://whop.com/c/pro-7e/websitepro', true],
    [`${APP}/signup?plan=pro&a=websitepro`, true],
    [`${APP}/api/oauth/init?next=%2Fev`, false],
    ['https://whop.com/sharpmoney', false],
    ['https://evil.com/c/x', false],
    ['/#pricing', false],
  ])('isCheckoutLink(%s) = %s', (href, want) => {
    expect(isCheckoutLink(href, APP)).toBe(want);
  });
});
