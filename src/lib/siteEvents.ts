// ============================================================================
// Click and engagement events for GA and the Whop pixel.
//
// Links are classified by where they go, so no component needs per-button
// markup. An element can still override with data-cta-id="...".
//
//   cta_click       Join box, pricing, Pro/Alpha/Core signup, Whop checkout, log in
//   outbound_click  partners (NoVig, EdgeBoost, ProphetX, Pikkit), YouTube, X, Discord, other sites
//   pricing_view    #pricing at least half on screen, once per page view
//   join_box_view   #join at least half on screen, once per page view
//   tool_use        first input on a /tools/* page, once per page view
//   video_play      first play of each video
//
// Every event fires to GA with full params and to the Whop pixel as
// whop.track('custom', { name }) with the detail folded into the name
// (Whop drops custom params; see tasks/plans/phase-t-tracking-fixes-plan.md T-0 #2).
// Nothing fires unless the tracking gate allowed this page (window.__smTrack).
// ============================================================================

export type SiteEvent = {
  name: 'cta_click' | 'outbound_click' | 'pricing_view' | 'join_box_view' | 'tool_use' | 'video_play';
  params: Record<string, string>;
};

const PARTNERS: [RegExp, string][] = [
  [/(^|\.)novig\.(us|com|onelink\.me)$|novig\.onelink\.me$/, 'novig'],
  [/(^|\.)edgeboost\.bet$/, 'edgeboost'],
  [/(^|\.)prophetx\.(co|com)$/, 'prophetx'],
  [/(^|\.)pikkit\.com$/, 'pikkit'],
  [/(^|\.)(youtube\.com|youtu\.be)$/, 'youtube'],
  [/(^|\.)(x\.com|twitter\.com)$/, 'x'],
  [/(^|\.)(discord\.gg|discord\.com)$/, 'discord'],
];

const OWN_HOSTS = ['www.betsharpmoney.com', 'betsharpmoney.com'];

function slug(v: string): string {
  return v.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 60);
}

function planFromWhopSlug(path: string): string {
  const s = path.split('/')[2] || '';
  if (s.startsWith('pro')) return 'pro';
  if (s.startsWith('alpha')) return 'alpha';
  if (s.startsWith('core')) return 'core';
  return slug(s) || 'unknown';
}

/** Classify a clicked link. Returns null for plain in-site navigation. */
export function classifyLink(href: string, pageUrl: string, appUrl: string, ctaOverride?: string | null): SiteEvent | null {
  let u: URL;
  let page: URL;
  try {
    page = new URL(pageUrl);
    u = new URL(href, pageUrl);
  } catch {
    return null;
  }
  const from = page.pathname;
  const app = new URL(appUrl).hostname;
  const host = u.hostname.toLowerCase();
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;

  const cta = (cta_id: string, extra: Record<string, string> = {}): SiteEvent => ({
    name: 'cta_click',
    params: { cta_id: ctaOverride ? slug(ctaOverride) : cta_id, page: from, link_url: u.origin + u.pathname, ...extra },
  });

  if (ctaOverride) return cta(slug(ctaOverride));

  const sameSite = OWN_HOSTS.includes(host) || host === page.hostname;
  if (sameSite) {
    const hash = u.hash.toLowerCase();
    if (hash.startsWith('#join')) return cta('join');
    if (hash.startsWith('#pricing')) return cta('pricing');
    return null;
  }
  if (host === app) {
    if (u.pathname === '/signup') {
      const plan = slug(u.searchParams.get('plan') || 'unknown');
      return cta(`plan_${plan}`, { plan });
    }
    if (u.pathname.startsWith('/api/oauth/init')) return cta('login');
    return cta('app');
  }
  if (host === 'whop.com' && u.pathname.startsWith('/c/')) {
    const plan = planFromWhopSlug(u.pathname);
    return cta(`whop_${plan}`, { plan });
  }
  const partner = PARTNERS.find(([re]) => re.test(host))?.[1];
  return {
    name: 'outbound_click',
    params: { dest: host, page: from, link_url: u.origin + u.pathname, ...(partner ? { partner } : {}) },
  };
}

/** The Whop custom-event name for an event (Whop keeps only the name). */
export function whopEventName(ev: SiteEvent): string {
  const p = ev.params;
  const detail = p.cta_id || p.partner || p.dest || p.tool || p.video || '';
  return slug(detail ? `${ev.name}_${detail}` : ev.name);
}

type TrackWindow = {
  __smTrack?: boolean;
  gtag?: (...args: unknown[]) => void;
  whop?: { track: (...args: unknown[]) => void };
};

/** Send an event to GA and the Whop pixel. No-op when the gate is off. */
export function sendSiteEvent(ev: SiteEvent, w: TrackWindow = (typeof window !== 'undefined' ? window : {}) as TrackWindow): boolean {
  if (!w.__smTrack) return false;
  try {
    w.gtag?.('event', ev.name, ev.params);
    w.whop?.track('custom', { name: whopEventName(ev) });
  } catch {
    // analytics is best-effort
  }
  return true;
}

/** Tool slug for a /tools/<slug> page, else null. */
export function toolSlugFromPath(pathname: string): string | null {
  const m = /^\/tools\/([a-z0-9-]+)\/?$/i.exec(pathname);
  return m ? m[1].toLowerCase() : null;
}
