import {
  type MarketingDashboardStore,
  STORAGE_KEY,
} from "./types";

const DEFAULT_STORE: MarketingDashboardStore = { version: 1, weeks: [] };

export function loadStore(): MarketingDashboardStore {
  if (typeof window === "undefined") return DEFAULT_STORE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STORE;
    const parsed = JSON.parse(raw) as MarketingDashboardStore;
    if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.weeks)) {
      return DEFAULT_STORE;
    }
    return parsed;
  } catch {
    return DEFAULT_STORE;
  }
}

export function saveStore(store: MarketingDashboardStore): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function exportStoreJson(store: MarketingDashboardStore): string {
  return JSON.stringify(store, null, 2);
}

/** Merge by weekStart: incoming overwrites same weekStart */
export function mergeImport(
  current: MarketingDashboardStore,
  incoming: MarketingDashboardStore,
): MarketingDashboardStore {
  const byWeek = new Map<string, (typeof current.weeks)[0]>();
  for (const w of current.weeks) {
    byWeek.set(w.weekStart, w);
  }
  for (const w of incoming.weeks) {
    byWeek.set(w.weekStart, w);
  }
  const weeks = Array.from(byWeek.values()).sort((a, b) =>
    a.weekStart < b.weekStart ? 1 : -1,
  );
  return { version: 1, weeks };
}
