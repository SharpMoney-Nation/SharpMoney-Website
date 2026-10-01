import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

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
