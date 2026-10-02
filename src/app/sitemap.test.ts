import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sitemap, { TOOL_SLUGS } from './sitemap';
import { ARTICLES } from './guides/articles';

const urls = sitemap().map((e) => e.url);

describe('sitemap', () => {
  it('lists every guide article', () => {
    for (const a of ARTICLES) expect(urls).toContain(`https://www.betsharpmoney.com/guides/${a.slug}`);
  });

  it('lists every tool page', () => {
    for (const slug of TOOL_SLUGS) expect(urls).toContain(`https://www.betsharpmoney.com/tools/${slug}`);
  });

  it('has no duplicates and no internal pages', () => {
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.some((u) => u.includes('/internal'))).toBe(false);
  });
});

describe('guide article links', () => {
  const source = readFileSync(fileURLToPath(new URL('./guides/articles.ts', import.meta.url)), 'utf8');
  const hrefs = [...source.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);

  it('never tags internal links with utm_ (that overwrites the real source in GA)', () => {
    const internal = hrefs.filter((h) => h.startsWith('/') || /^https?:\/\/(www\.)?betsharpmoney\.com/.test(h));
    const tagged = internal.filter((h) => /utm_/i.test(h));
    expect(tagged).toEqual([]);
  });

  it('has at least one guide linking to pricing', () => {
    expect(hrefs.filter((h) => h === '/#pricing').length).toBeGreaterThan(0);
  });
});
