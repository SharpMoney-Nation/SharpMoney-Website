export type WhopRow = {
  name: string;
  clicks: number;
  revenue: number;
  convertedUsers: number;
  /** Stored as decimal, e.g. 0.08 = 8% */
  conversionRate: number;
};

export type GAChannelRow = {
  channel: string;
  newUsers: number;
  sessions: number;
  views: number;
};

export type MarketingWeekEntry = {
  id: string;
  /** ISO date for week start (e.g. Monday you choose) */
  weekStart: string;
  twitter: {
    spend: number;
    impressions: number;
    linkClicks: number;
    /** Optional override; if blank, derived from spend / linkClicks */
    costPerLinkClick: number | null;
  };
  whop: WhopRow[];
  ga: {
    newUsers: number;
    sessions: number;
    views: number;
    channels: GAChannelRow[];
  };
  notes: string;
};

export type MarketingDashboardStore = {
  version: 1;
  weeks: MarketingWeekEntry[];
};

export const STORAGE_KEY = "sharpmoney_marketing_dashboard_v1";

export function newWeekEntry(weekStart: string): MarketingWeekEntry {
  return {
    id: crypto.randomUUID(),
    weekStart,
    twitter: {
      spend: 0,
      impressions: 0,
      linkClicks: 0,
      costPerLinkClick: null,
    },
    whop: [
      {
        name: "",
        clicks: 0,
        revenue: 0,
        convertedUsers: 0,
        conversionRate: 0,
      },
    ],
    ga: {
      newUsers: 0,
      sessions: 0,
      views: 0,
      channels: [
        { channel: "", newUsers: 0, sessions: 0, views: 0 },
      ],
    },
    notes: "",
  };
}

export function effectiveTwitterCpc(week: MarketingWeekEntry): number {
  const { spend, linkClicks } = week.twitter;
  if (week.twitter.costPerLinkClick != null && week.twitter.costPerLinkClick > 0) {
    return week.twitter.costPerLinkClick;
  }
  if (linkClicks > 0) return spend / linkClicks;
  return 0;
}

export function totalWhopRevenue(week: MarketingWeekEntry): number {
  return week.whop.reduce((s, r) => s + (Number(r.revenue) || 0), 0);
}
