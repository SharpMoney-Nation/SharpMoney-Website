import type { MetadataRoute } from "next";
import { ARTICLES } from "@/app/guides/articles";

// Guide entries come from ARTICLES, so a new article is listed automatically
// (src/app/sitemap.test.ts checks every slug is here).
export const TOOL_SLUGS = [
  "ev-calculator",
  "no-vig-calculator",
  "odds-converter",
  "kelly-calculator",
  "hedge-calculator",
  "arbitrage-calculator",
  "parlay-calculator",
  "odds-probability-chart",
  "hold-calculator",
  "unit-size-calculator",
  "bankroll-simulator",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.betsharpmoney.com";
  const now = new Date();

  const pages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/tools`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/results`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/guides`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/promotions`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];

  const guides: MetadataRoute.Sitemap = ARTICLES.map((a) => ({
    url: `${baseUrl}/guides/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const tools: MetadataRoute.Sitemap = TOOL_SLUGS.map((slug) => ({
    url: `${baseUrl}/tools/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...pages, ...guides, ...tools];
}
