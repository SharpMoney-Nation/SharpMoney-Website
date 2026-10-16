import type { FirstTouch } from '@/lib/firstTouch';

// ============================================================================
// What the Elements join box hands Whop about the visitor.
//
// joinMetadata: the checkout `metadata`. Keys are the app's growth allowlist
// (sharpmoney-whop-app src/lib/growth/mappers.ts SM_META_KEYS): sm_source,
// sm_surface, sm_tier, sm_period and the sm_ft_* first-touch fields the site
// stores in its sm_ft cookie. Any other key is dropped by the app, so none is
// sent. Values are capped at 200 chars. The click id is its TYPE (fbclid,
// gclid, ...), never a value.
//
// joinAttribution: the element's `attribution` (utm_* -> Whop's fields), a
// copy of the app's mapUtm with this surface's source tag.
// ============================================================================

export const JOIN_SOURCE = 'website';
export const JOIN_SURFACE = 'home_join';
export const JOIN_TIER = 'CORE';
export const ATTRIBUTION_SOURCE = 'betsharpmoney-home';

const META_MAX_LEN = 200;

export interface JoinAttribution {
  source: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

const UTM_TO_ATTRIBUTION: Record<string, keyof Omit<JoinAttribution, 'source'>> = {
  utm_source: 'utmSource',
  utm_medium: 'utmMedium',
  utm_campaign: 'utmCampaign',
  utm_term: 'utmTerm',
  utm_content: 'utmContent',
};

function clip(value: string | undefined): string | undefined {
  if (typeof value !== 'string') return undefined;
  const v = value.trim();
  if (!v) return undefined;
  return v.length > META_MAX_LEN ? v.slice(0, META_MAX_LEN) : v;
}

export function joinMetadata(ft: FirstTouch | null | undefined): Record<string, string> {
  const out: Record<string, string> = { sm_source: JOIN_SOURCE, sm_surface: JOIN_SURFACE, sm_tier: JOIN_TIER };
  if (!ft) return out;
  const pairs: [string, string | undefined][] = [
    ['sm_ft_source', ft.src],
    ['sm_ft_medium', ft.med],
    ['sm_ft_campaign', ft.cmp],
    ['sm_ft_content', ft.cnt],
    ['sm_ft_ref', ft.ref],
    ['sm_ft_click', ft.clk],
    ['sm_ft_landing', ft.lp],
  ];
  for (const [key, raw] of pairs) {
    const v = clip(raw);
    if (v) out[key] = v;
  }
  return out;
}

/** utm_* keys -> Whop Elements attribution fields; unknown keys dropped; empty values dropped. */
export function joinAttribution(utm: Record<string, string> | undefined): JoinAttribution {
  const out: JoinAttribution = { source: ATTRIBUTION_SOURCE };
  if (utm) {
    for (const [key, value] of Object.entries(utm)) {
      const field = UTM_TO_ATTRIBUTION[key];
      const v = clip(value);
      if (field && v) out[field] = v;
    }
  }
  return out;
}
