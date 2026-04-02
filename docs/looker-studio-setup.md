# SharpMoney — Looker Studio Dashboard Setup

> Free, auto-updating dashboard that pulls from GA4 and YouTube. Takes ~20 minutes to set up.

---

## Step 1: Create the Dashboard

1. Go to [lookerstudio.google.com](https://lookerstudio.google.com/)
2. Sign in with the same Google account that has your GA4 property
3. Click **+ Create** → **Report**
4. Name it: `SharpMoney Marketing Dashboard`

---

## Step 2: Connect GA4

1. When prompted to add data, select **Google Analytics**
2. Choose your GA4 property (the one with Measurement ID `G-N8L0PFJG7E`)
3. Click **Add**

This gives you access to all traffic, UTM, and conversion data.

---

## Step 3: Connect YouTube Analytics

1. Click **Add data** (top menu)
2. Select **YouTube Analytics**
3. Authorize with your YouTube channel's Google account
4. Select **Channel** level data
5. Click **Add**

This gives you views, watch time, subscribers, and traffic sources per video.

---

## Step 4: Create a Google Sheet for Manual Data

Some data (Whop tracking link stats, X Ads spend) isn't available via native connectors. Create a Google Sheet to hold this data.

1. Create a new Google Sheet named `SharpMoney Ad Spend & Whop Data`
2. Create two tabs:

**Tab 1: `X Ad Spend`**

| Date | Campaign | Spend | Impressions | Clicks | Link Clicks |
|------|----------|-------|-------------|--------|-------------|
| 2026-04-01 | mlb-plus-ev-2026 | 25.00 | 5200 | 180 | 45 |

**Tab 2: `Whop Tracking Links`**

| Date | Link Label | Clicks | Conversions | Revenue | Conversion Rate |
|------|------------|--------|-------------|---------|-----------------|
| 2026-04-01 | xdirectpro | 42 | 3 | 239.97 | 7.1% |
| 2026-04-01 | websitepro | 85 | 5 | 399.95 | 5.9% |
| 2026-04-01 | pro | 28 | 2 | 159.98 | 7.1% |

3. In Looker Studio, click **Add data** → **Google Sheets** → select this spreadsheet
4. Add both tabs as separate data sources

---

## Step 5: Build the Dashboard Pages

### Page 1: Overview

Add these charts using the GA4 data source:

| Chart type | What it shows | GA4 dimension/metric |
|------------|---------------|----------------------|
| Scorecard | Total Users | `totalUsers` |
| Scorecard | Sessions | `sessions` |
| Scorecard | Conversions | `conversions` (available after Whop → GA4 integration) |
| Time series | Traffic over time | Date × Sessions |
| Pie chart | Traffic by source | `sessionSource` × `sessions` |

### Page 2: Channel Breakdown

| Chart type | What it shows | Dimension → Metric |
|------------|---------------|-------------------|
| Table | Traffic by source/medium | `sessionSource` / `sessionMedium` → Sessions, Users |
| Bar chart | Sessions by source | `sessionSource` → `sessions` |
| Bar chart | Conversions by source | `sessionSource` → `conversions` |
| Scorecard with comparison | This week vs last week | Date filter applied |

**Key filter**: Add a date range control at the top of each page.

### Page 3: Campaign Performance

| Chart type | What it shows | Dimension → Metric |
|------------|---------------|-------------------|
| Table | Performance by campaign | `sessionCampaign` → Sessions, Conversions |
| Bar chart | Top campaigns by traffic | `sessionCampaign` → `sessions` (sorted desc) |
| Bar chart | Top campaigns by conversions | `sessionCampaign` → `conversions` (sorted desc) |

This shows which specific video or guide drives the most activity (powered by your UTM `utm_campaign` values).

### Page 4: X Ads ROI

Use the **Google Sheets** data source (`X Ad Spend` tab):

| Chart type | What it shows |
|------------|---------------|
| Scorecard | Total Spend (sum of Spend column) |
| Scorecard | Total Clicks |
| Table | Campaign-level spend, impressions, clicks |
| Calculated field | CPC = Spend / Clicks |
| Blended chart | Spend vs Conversions over time (blend with Whop data) |

### Page 5: Whop Sales by Channel

Use the **Google Sheets** data source (`Whop Tracking Links` tab):

| Chart type | What it shows |
|------------|---------------|
| Table | Per-tracking-link: clicks, conversions, revenue, conversion rate |
| Pie chart | Revenue by channel (group by link label prefix: xdirect, website, email, pikkit, youtube) |
| Bar chart | Conversions by channel |
| Scorecard | Total Revenue |
| Scorecard | Overall Conversion Rate |

### Page 6: YouTube Performance

Use the **YouTube Analytics** data source:

| Chart type | What it shows |
|------------|---------------|
| Table | Per-video: views, watch time, likes |
| Time series | Total views over time |
| Bar chart | Views by traffic source type |

---

## Step 6: Set Up Automated Email Reports

1. In Looker Studio, click **Share** → **Schedule email delivery**
2. Set frequency: **Weekly** (every Monday)
3. Add your email address
4. Choose pages to include (Overview + Whop Sales recommended)
5. Click **Schedule**

You'll get a PDF snapshot of your dashboard in your inbox every week.

---

## Maintenance

| Task | Frequency | How |
|------|-----------|-----|
| Update X Ad Spend sheet | Weekly (or after each campaign change) | Copy numbers from X Ads Manager into the Google Sheet |
| Update Whop Tracking Links sheet | Weekly | Copy numbers from Whop Dashboard → Marketing → Tracking Links into the Google Sheet |
| Everything else | Automatic | GA4 and YouTube data refresh automatically in Looker Studio |

---

## Optional: Automate the Manual Parts

If you want to stop manually copying X Ads and Whop data into Sheets, see `Phase 4` in the Marketing Analytics Dashboard plan — this involves setting up Google Apps Script to pull from APIs automatically.
