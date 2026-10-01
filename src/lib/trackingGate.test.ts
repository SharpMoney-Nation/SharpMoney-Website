import { describe, expect, it } from 'vitest';
import { runInNewContext } from 'node:vm';
import { GA_ID_FOR_GATE, GATE_SCRIPT } from './trackingGate';

type FakeWindow = Record<string, unknown> & {
  location: { hostname: string; pathname: string };
  navigator: { userAgent: string; webdriver?: boolean };
};

const CHROME_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';

function runGate(hostname: string, pathname = '/', userAgent = CHROME_UA, webdriver = false): FakeWindow {
  const w: FakeWindow = { location: { hostname, pathname }, navigator: { userAgent, webdriver } };
  runInNewContext(GATE_SCRIPT, { window: w });
  return w;
}

describe('GATE_SCRIPT', () => {
  it.each(['www.betsharpmoney.com', 'betsharpmoney.com', 'WWW.BetSharpMoney.com'])('tracks the real site: %s', (host) => {
    const w = runGate(host);
    expect(w.__smTrack).toBe(true);
    expect(w[`ga-disable-${GA_ID_FOR_GATE}`]).toBeUndefined();
  });

  it.each([
    'sharp-money-website.vercel.app',
    'sharp-money-website-git-feat-core-first-landing-sharp-money.vercel.app',
    'sharpmoney-site-production.up.railway.app',
    'localhost',
    '127.0.0.1',
    'app.betsharpmoney.com',
    'evil-betsharpmoney.com',
    'betsharpmoney.com.evil.io',
    '',
  ])('does not track other hosts: %s', (host) => {
    const w = runGate(host);
    expect(w.__smTrack).toBe(false);
    expect(w[`ga-disable-${GA_ID_FOR_GATE}`]).toBe(true);
  });

  it.each(['/internal', '/internal/marketing-dashboard', '/internal/marketing-dashboard/login'])(
    'does not track internal pages: %s',
    (path) => {
      expect(runGate('www.betsharpmoney.com', path).__smTrack).toBe(false);
    }
  );

  it.each(['/', '/tools/no-vig-calculator', '/internalize-this-guide', '/guides/x'])('tracks public pages: %s', (path) => {
    expect(runGate('www.betsharpmoney.com', path).__smTrack).toBe(true);
  });

  it.each([
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/120.0 Safari/537.36',
    'Mozilla/5.0 (Linux; Android 11; moto g power) Chrome-Lighthouse',
    'UptimeRobot/2.0',
  ])('does not track automated browsers: %s', (ua) => {
    expect(runGate('www.betsharpmoney.com', '/', ua).__smTrack).toBe(false);
  });

  it('does not track when navigator.webdriver is set', () => {
    expect(runGate('www.betsharpmoney.com', '/', CHROME_UA, true).__smTrack).toBe(false);
  });

  it('fails closed when location is unreadable', () => {
    const w: Record<string, unknown> = {};
    runInNewContext(GATE_SCRIPT, { window: w });
    expect(w.__smTrack).toBe(false);
  });
});
