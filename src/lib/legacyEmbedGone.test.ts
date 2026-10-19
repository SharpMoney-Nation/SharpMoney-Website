import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Source-grep guards for the Elements port (plan: sharpmoney-whop-app
// tasks/plans/website-join-elements-plan.md): the legacy @whop/checkout embed
// is gone for good, the Elements packages live in exactly one client chunk,
// and the completion page never prerenders its browser-only parse.

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const SRC = join(ROOT, 'src');

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx|mjs|js)$/.test(name)) out.push(p);
  }
  return out;
}
const read = (rel: string) => readFileSync(join(ROOT, rel), 'utf8');

describe('legacy embed is gone', () => {
  it('no source file imports @whop/checkout and package.json no longer lists it', () => {
    for (const f of walk(SRC)) {
      if (f.endsWith('legacyEmbedGone.test.ts')) continue; // this file names the package on purpose
      expect(readFileSync(f, 'utf8'), f).not.toMatch(/['"]@whop\/checkout/);
    }
    const pkg = JSON.parse(read('package.json')) as { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };
    expect(pkg.dependencies?.['@whop/checkout']).toBeUndefined();
    expect(pkg.devDependencies?.['@whop/checkout']).toBeUndefined();
    expect(pkg.dependencies?.['@whop/elements']).toBe('1.0.0');
    expect(pkg.dependencies?.['@whop/elements-react']).toBe('1.0.0');
  });
});

describe('Elements box wiring', () => {
  it('only JoinElementsBox imports the Elements packages', () => {
    for (const f of walk(SRC)) {
      const src = readFileSync(f, 'utf8');
      if (f.endsWith('JoinElementsBox.tsx')) {
        expect(src).toMatch(/from '@whop\/elements'/);
        expect(src).toMatch(/from '@whop\/elements-react'/);
      } else {
        // an import or a dynamic import of either package (a comment may name it)
        expect(src, f).not.toMatch(/(from|import\()\s*['"]@whop\/elements/);
      }
    }
  });
  it('the box is keyed on a checkout configuration, never a bare plan', () => {
    const box = read('src/components/JoinElementsBox.tsx');
    expect(box).toMatch(/checkoutConfiguration=\{/);
    expect(box).not.toMatch(/<Checkout[^>]*\bplan=/);
  });
  it('JoinCoreEmbed loads the box with ssr:false and never imports it statically', () => {
    const embed = read('src/components/JoinCoreEmbed.tsx');
    expect(embed).toMatch(/import\('\.\/JoinElementsBox'\)/);
    expect(embed).toMatch(/ssr:\s*false/);
    expect(embed).not.toMatch(/^import .*JoinElementsBox/m);
  });
  it('the completion page client is loaded with ssr:false (no build-time parse, no hydration mismatch)', () => {
    const loader = read('src/app/join/complete/JoinCompleteLoader.tsx');
    expect(loader).toMatch(/import\('\.\/JoinCompleteClient'\)/);
    expect(loader).toMatch(/ssr:\s*false/);
    const client = read('src/app/join/complete/JoinCompleteClient.tsx');
    expect(client).not.toMatch(/useSearchParams\(/);
    expect(client).not.toMatch(/from 'next\/navigation'/);
    expect(client).toMatch(/location\.replace\(/);
    expect(client).toMatch(/history\.replaceState\(/);
  });
  it('layout and the completion page share the pixel ids', () => {
    expect(read('src/app/layout.tsx')).toMatch(/from "@\/lib\/pixelIds"/);
    expect(read('src/app/join/complete/JoinCompleteClient.tsx')).toMatch(/from '@\/lib\/pixelIds'/);
  });
});
