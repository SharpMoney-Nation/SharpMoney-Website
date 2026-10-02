import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { BOT_UA_PATTERN, TRACKED_HOSTS } from '@/lib/trackingGate';

// Guards the wiring in layout.tsx: the gate runs first, and every pixel snippet
// is wrapped in the window.__smTrack check (see src/lib/trackingGate.ts).
const layout = readFileSync(fileURLToPath(new URL('./layout.tsx', import.meta.url)), 'utf8');

function scriptBody(id: string): string {
  const start = layout.indexOf(`id="${id}"`);
  expect(start, `Script ${id} exists`).toBeGreaterThan(-1);
  return layout.slice(start, layout.indexOf('</Script>', start));
}

describe('layout tracking wiring', () => {
  it('declares the gate before any pixel script', () => {
    const gate = layout.indexOf('id="tracking-gate"');
    expect(gate).toBeGreaterThan(-1);
    for (const id of ['sendx-tracking', 'whop-pixel', 'meta-pixel', 'x-pixel', 'google-analytics']) {
      expect(layout.indexOf(`id="${id}"`)).toBeGreaterThan(gate);
    }
    expect(scriptBody('tracking-gate')).toContain('strategy="beforeInteractive"');
  });

  it.each(['sendx-tracking', 'whop-pixel', 'meta-pixel', 'x-pixel', 'google-analytics'])(
    '%s only runs when window.__smTrack is true',
    (id) => {
      expect(scriptBody(id)).toContain('window.__smTrack');
    }
  );

  it('never loads gtag.js through an unconditional src script', () => {
    expect(layout).not.toMatch(/<Script\s+src=\{`https:\/\/www\.googletagmanager\.com/);
  });
});

describe('static odds-table page', () => {
  const html = readFileSync(fileURLToPath(new URL('../../public/odds-table.html', import.meta.url)), 'utf8');
  it('carries the same tracking gate and loads GA and Whop only behind it', () => {
    expect(html).toContain('w.__smTrack = ok');
    const gateAt = html.indexOf('w.__smTrack = ok');
    expect(html.indexOf('whop.setScope')).toBeGreaterThan(gateAt);
    expect(html.indexOf("gtag('config', 'G-N8L0PFJG7E'")).toBeGreaterThan(gateAt);
    expect(html).toContain('if (window.__smTrack) {');
    expect(html).not.toMatch(/<script[^>]+src="https:\/\/www\.googletagmanager\.com/);
  });

  it('counts only top-level loads (the page is iframed on /tools)', () => {
    expect(html).toContain('framed = w.top !== w.self');
    expect(html).toMatch(/ok = !framed &&/);
  });

  it('keeps the same hosts and bot pattern as trackingGate.ts', () => {
    const hostLine = html.match(/host === '([^']+)' \|\| host === '([^']+)'/);
    expect(hostLine && [hostLine[1], hostLine[2]].sort()).toEqual([...TRACKED_HOSTS].sort());
    const uaRe = html.match(/!\/([^/]+)\/i\.test\(ua\)/);
    expect(uaRe && uaRe[1]).toBe(BOT_UA_PATTERN);
    expect(html).toContain("gtag('consent', 'default', { analytics_storage: 'granted' })");
  });
});
