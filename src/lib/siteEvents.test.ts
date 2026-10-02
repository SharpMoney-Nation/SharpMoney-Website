import { describe, expect, it, vi } from 'vitest';
import { classifyLink, sendSiteEvent, toolSlugFromPath, whopEventName } from './siteEvents';

const APP = 'https://app.betsharpmoney.com';
const PAGE = 'https://www.betsharpmoney.com/guides/what-is-ev-betting';
const c = (href: string, page = PAGE, override?: string) => classifyLink(href, page, APP, override);

describe('classifyLink', () => {
  it.each([
    ['/#join', 'join'],
    ['#join', 'join'],
    ['/#pricing', 'pricing'],
    ['/#pricing?utm_source=website&utm_medium=guide', 'pricing'],
    ['https://www.betsharpmoney.com/#pricing?utm_source=youtube', 'pricing'],
    [`${APP}/signup?plan=pro&a=websitepro`, 'plan_pro'],
    [`${APP}/signup?plan=alpha&a=websitealpha&utm_source=x`, 'plan_alpha'],
    [`${APP}/api/oauth/init?next=%2Fev`, 'login'],
    ['https://whop.com/c/pro-7e/websitepro', 'whop_pro'],
    ['https://whop.com/c/alpha-4e/websitealpha', 'whop_alpha'],
  ])('%s -> cta_click %s', (href, id) => {
    const ev = c(href)!;
    expect(ev.name).toBe('cta_click');
    expect(ev.params.cta_id).toBe(id);
    expect(ev.params.page).toBe('/guides/what-is-ev-betting');
  });

  it('carries the plan for signup and Whop checkout links', () => {
    expect(c(`${APP}/signup?plan=pro`)!.params.plan).toBe('pro');
    expect(c('https://whop.com/c/alpha-4e/x')!.params.plan).toBe('alpha');
  });

  it.each([
    ['https://novig.onelink.me/JHQQ/cw47x45a', 'novig'],
    ['https://www.edgeboost.bet/guide/?oid=313&affid=246', 'edgeboost'],
    ['https://app.pikkit.com/subscribe?ref=SHARPMONEY', 'pikkit'],
    ['https://www.youtube.com/@BetSharpMoneyYT', 'youtube'],
    ['https://x.com/BetSharpMoney', 'x'],
    ['https://discord.gg/b4QmzcPhTt', 'discord'],
  ])('%s -> outbound_click partner %s', (href, partner) => {
    const ev = c(href)!;
    expect(ev.name).toBe('outbound_click');
    expect(ev.params.partner).toBe(partner);
  });

  it('labels unknown outside sites by domain', () => {
    expect(c('https://example.org/a?b=1')).toEqual({
      name: 'outbound_click',
      params: { dest: 'example.org', page: '/guides/what-is-ev-betting', link_url: 'https://example.org/a' },
    });
  });

  it('never puts query strings in link_url', () => {
    expect(c(`${APP}/signup?plan=pro&email=a@b.com`)!.params.link_url).toBe(`${APP}/signup`);
  });

  it.each(['/guides', '/tools/ev-calculator', 'https://www.betsharpmoney.com/results', 'mailto:team@betsharpmoney.com', 'javascript:void(0)'])(
    'ignores in-site navigation and non-web links: %s',
    (href) => {
      expect(c(href)).toBeNull();
    }
  );

  it('honours a data-cta-id override', () => {
    expect(c('/guides', PAGE, 'Hero Start Free')!.params.cta_id).toBe('hero_start_free');
  });
});

describe('whopEventName', () => {
  it('folds the detail into the name', () => {
    expect(whopEventName({ name: 'cta_click', params: { cta_id: 'plan_pro' } })).toBe('cta_click_plan_pro');
    expect(whopEventName({ name: 'outbound_click', params: { dest: 'novig.onelink.me', partner: 'novig' } })).toBe('outbound_click_novig');
    expect(whopEventName({ name: 'tool_use', params: { tool: 'no-vig-calculator' } })).toBe('tool_use_no_vig_calculator');
    expect(whopEventName({ name: 'pricing_view', params: { page: '/' } })).toBe('pricing_view');
  });
});

describe('sendSiteEvent', () => {
  it('sends to GA with params and to Whop as a named custom event', () => {
    const gtag = vi.fn();
    const track = vi.fn();
    const sent = sendSiteEvent({ name: 'cta_click', params: { cta_id: 'plan_pro', page: '/' } }, { __smTrack: true, gtag, whop: { track } });
    expect(sent).toBe(true);
    expect(gtag).toHaveBeenCalledWith('event', 'cta_click', { cta_id: 'plan_pro', page: '/' });
    expect(track).toHaveBeenCalledWith('custom', { name: 'cta_click_plan_pro' });
  });

  it('does nothing when the tracking gate is off', () => {
    const gtag = vi.fn();
    expect(sendSiteEvent({ name: 'pricing_view', params: {} }, { __smTrack: false, gtag })).toBe(false);
    expect(gtag).not.toHaveBeenCalled();
  });

  it('survives missing or throwing pixels', () => {
    expect(sendSiteEvent({ name: 'pricing_view', params: {} }, { __smTrack: true })).toBe(true);
    expect(sendSiteEvent({ name: 'pricing_view', params: {} }, { __smTrack: true, gtag: () => { throw new Error('blocked'); } })).toBe(true);
  });
});

describe('toolSlugFromPath', () => {
  it.each([
    ['/tools/no-vig-calculator', 'no-vig-calculator'],
    ['/tools/EV-Calculator/', 'ev-calculator'],
    ['/tools', null],
    ['/guides/x', null],
  ])('%s -> %s', (p, want) => {
    expect(toolSlugFromPath(p)).toBe(want);
  });
});
