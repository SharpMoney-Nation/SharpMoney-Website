# SharpMoney Looker Studio Dashboard — Current Layout

> Last updated: April 2, 2026
> Dashboard name: SharpMoney Marketing Dashboard
> URL: (paste your Looker Studio URL here after saving)

---

## Data Sources Connected

| Source | Type | Account | Auto-updates? |
|--------|------|---------|---------------|
| SharpMoney (GA4) | Google Analytics | closingdime@betsharpmoney.com | Yes |
| YouTube Analytics | YouTube | closingdime@gmail.com | Yes |
| SharpMoney Ad Spend + Whop Data | Google Sheets | (your Google Drive) | Manual weekly |

### Google Sheets Tabs

| Tab name | Purpose |
|----------|---------|
| `X Ad Spend` | Columns: Date, Campaign, Spend, Impressions, Clicks, Link Clicks |
| `Whop Tracking Links` | Columns: Date, Link Label, Clicks, Conversions, Revenue, Conversion Rate |
| `YouTube` | Columns: Date, Video Title, Views, Watch Hours, Likes, External Traffic |

---

## Custom Fields

| Field name | Data source | Formula |
|------------|-------------|---------|
| `Channel (Clean)` | Google Analytics | Groups raw session sources into clean names: t.co/twitter/x → "X / Twitter", sendx/app.sendx.io → "Email (SendX)", youtube.com/m.youtube.com → "YouTube", google → "Google", (direct) → "Direct", pikkit → "Pikkit" |

---

## Page 1: Overview

**Purpose:** At-a-glance view of overall website traffic and sources.

| Element | Type | Data source | Configuration |
|---------|------|-------------|---------------|
| Date range control | Control | — | Top right, default: Last 28 days |
| Total Users | Scorecard | GA4 | Metric: Total Users |
| Sessions | Scorecard | GA4 | Metric: Sessions |
| New Users | Scorecard | GA4 | Metric: New Users |
| Traffic over time | Time series chart | GA4 | Dimension: Date, Metric: Sessions |
| Traffic by source | Pie chart | GA4 | Dimension: Channel (Clean), Metric: Sessions |

---

## Page 2: Channel Breakdown

**Purpose:** Detailed view of traffic and performance by source and medium.

| Element | Type | Data source | Configuration |
|---------|------|-------------|---------------|
| Date range control | Control | — | Top right |
| Source/Medium table | Table | GA4 | Dimensions: Channel (Clean) + Session medium, Metrics: Sessions + Total Users, Sort: Sessions desc |
| Sessions by channel | Bar chart | GA4 | Dimension: Channel (Clean), Metric: Sessions, Sort: desc |

---

## Page 3: Campaign Performance

**Purpose:** Shows which specific video, guide, or ad campaign drives the most traffic. Powered by UTM `utm_campaign` values.

| Element | Type | Data source | Configuration |
|---------|------|-------------|---------------|
| Date range control | Control | — | Top right |
| Campaign table | Table | GA4 | Dimension: Session campaign, Metrics: Sessions + Total Users, Sort: Sessions desc |
| Top campaigns | Bar chart | GA4 | Dimension: Session campaign, Metric: Sessions, Sort: desc |

---

## Page 4: X Ads ROI

**Purpose:** Track X/Twitter ad spend vs performance. Data comes from Google Sheet (manual or automated entry).

| Element | Type | Data source | Configuration |
|---------|------|-------------|---------------|
| Date range control | Control | — | Top right |
| Total Spend | Scorecard | Sheets: X Ad Spend | Metric: Spend (SUM) |
| Total Link Clicks | Scorecard | Sheets: X Ad Spend | Metric: Link Clicks (SUM) |
| Campaign breakdown | Table | Sheets: X Ad Spend | Dimensions: Date + Campaign, Metrics: Spend + Impressions + Clicks + Link Clicks |

---

## Page 5: Whop Sales

**Purpose:** Track sales attribution by channel using Whop tracking link data. Data comes from Google Sheet (manual entry from Whop Dashboard > Marketing > Tracking Links).

| Element | Type | Data source | Configuration |
|---------|------|-------------|---------------|
| Date range control | Control | — | Top right |
| Total Revenue | Scorecard | Sheets: Whop Tracking Links | Metric: Revenue (SUM) |
| Total Conversions | Scorecard | Sheets: Whop Tracking Links | Metric: Conversions (SUM) |
| Per-link table | Table | Sheets: Whop Tracking Links | Dimension: Link Label, Metrics: Clicks + Conversions + Revenue + Conversion Rate |
| Revenue by channel | Pie chart | Sheets: Whop Tracking Links | Dimension: Link Label, Metric: Revenue |

---

## Page 6: YouTube

**Purpose:** YouTube video performance — views, watch time, and engagement.

| Element | Type | Data source | Configuration |
|---------|------|-------------|---------------|
| Date range control | Control | — | Top right |
| Video table | Table | YouTube Analytics | Dimension: Video Title (or Video Link), Metric: Views |

---

## Weekly Maintenance Checklist

| Task | Where to get the data | Where to paste it |
|------|----------------------|-------------------|
| Update X Ad Spend | X Ads Manager → Campaigns | Google Sheet → `X Ad Spend` tab |
| Update Whop Tracking Links | Whop Dashboard → Marketing → Tracking Links | Google Sheet → `Whop Tracking Links` tab |
| Everything else | — | Automatic (GA4 + YouTube refresh on their own) |

---

## Automated Email Reports

| Setting | Value |
|---------|-------|
| Frequency | Weekly (Mondays) |
| Recipients | (your email) |
| Format | PDF |

Set up via: Share (top right) → Schedule email delivery

---

## Future Improvements

- Add `Conversions` scorecard to Overview page once Whop → GA4 purchase events start flowing (24-48 hrs after integration)
- Add CPC calculated field to X Ads ROI page: `Spend / Clicks`
- Automate X Ads data entry with Google Apps Script (see `docs/x-ads-apps-script.md`)
- Add blended chart on X Ads ROI page combining spend data with Whop conversion data
- Style the dashboard with SharpMoney brand colors (dark background, cyan accents)
