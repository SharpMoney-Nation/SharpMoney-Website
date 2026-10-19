import { describe, expect, it } from 'vitest';
import { joinAttribution, joinMetadata } from './joinMetadata';
import type { FirstTouch } from './firstTouch';

const ALLOWED = new Set([
  'sm_source', 'sm_surface', 'sm_tier', 'sm_period',
  'sm_ft_source', 'sm_ft_medium', 'sm_ft_campaign', 'sm_ft_content', 'sm_ft_ref', 'sm_ft_click', 'sm_ft_landing',
]);

describe('joinMetadata', () => {
  it('always carries the surface tags', () => {
    expect(joinMetadata(null)).toEqual({ sm_source: 'website', sm_surface: 'home_join', sm_tier: 'CORE' });
  });
  it('maps the first-touch cookie onto the allowlisted sm_ft_* keys only', () => {
    const ft: FirstTouch = { src: 'x', med: 'cpc', cmp: 'oct', cnt: 'ad1', trm: 'odds', clk: 'twclid', ref: 'x.com', lp: '/guides/ev', ts: 1 };
    const m = joinMetadata(ft);
    expect(m).toEqual({
      sm_source: 'website', sm_surface: 'home_join', sm_tier: 'CORE',
      sm_ft_source: 'x', sm_ft_medium: 'cpc', sm_ft_campaign: 'oct', sm_ft_content: 'ad1',
      sm_ft_ref: 'x.com', sm_ft_click: 'twclid', sm_ft_landing: '/guides/ev',
    });
    for (const k of Object.keys(m)) expect(ALLOWED.has(k), k).toBe(true);
    expect(m).not.toHaveProperty('sm_ft_term'); // utm_term is not on the app's allowlist
    expect(m).not.toHaveProperty('sm_ft_ts');
  });
  it('omits empty fields and caps values at 200 chars', () => {
    const m = joinMetadata({ src: '', lp: 'a'.repeat(300), ts: 1 } as FirstTouch);
    expect(m).not.toHaveProperty('sm_ft_source');
    expect(m.sm_ft_landing).toHaveLength(200);
  });
  it('never carries a click id VALUE, only its type', () => {
    const m = joinMetadata({ clk: 'fbclid', lp: '/', ts: 1 } as FirstTouch);
    expect(m.sm_ft_click).toBe('fbclid');
    expect(JSON.stringify(m)).not.toMatch(/IwAR|fbclid=/);
  });
});

describe('joinAttribution', () => {
  it('maps utm_* onto the element fields with this surface source', () => {
    expect(joinAttribution({ utm_source: 'x', utm_medium: 'cpc', utm_campaign: 'oct', utm_term: 'odds', utm_content: 'ad1', utm_id: 'drop' })).toEqual({
      source: 'betsharpmoney-home', utmSource: 'x', utmMedium: 'cpc', utmCampaign: 'oct', utmTerm: 'odds', utmContent: 'ad1',
    });
  });
  it('drops empty values and unknown keys; undefined input is the bare source', () => {
    expect(joinAttribution({ utm_source: '', foo: 'bar' })).toEqual({ source: 'betsharpmoney-home' });
    expect(joinAttribution(undefined)).toEqual({ source: 'betsharpmoney-home' });
  });
});
