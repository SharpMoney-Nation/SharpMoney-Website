# SharpMoney — UTM Link Reference

> Every time you post a link to betsharpmoney.com, grab the right one from here.
> The extra stuff after the `?` is invisible to the person clicking — it just tells Google Analytics where they came from.

---

## How It Works (30-second version)

A normal link:
`https://www.betsharpmoney.com/#pricing`

A tracked link:
`https://www.betsharpmoney.com/#pricing?utm_source=twitter&utm_medium=paid&utm_campaign=mlb-plus-ev-2026`

Same page loads. But now GA4 knows **this visitor came from a paid Twitter ad for the MLB +EV video.**

---

## Ready-to-Paste Links

### YouTube Video Descriptions

Put these in your video descriptions. They send viewers to the website (where GA4 can see them) instead of straight to Whop.

| Video | Link to paste in description |
|-------|------------------------------|
| **MLB +EV Guide** | `https://www.betsharpmoney.com/guides/mlb-plus-ev-betting-guide-2026?utm_source=youtube&utm_medium=video&utm_campaign=mlb-plus-ev-2026` |
| **Promo Optimizer** | `https://www.betsharpmoney.com/guides/sharpmoney-promo-optimizer?utm_source=youtube&utm_medium=video&utm_campaign=promo-optimizer` |
| **Line Movement Charts** | `https://www.betsharpmoney.com/guides/line-movement-charts-ev-betting-strategy?utm_source=youtube&utm_medium=video&utm_campaign=line-movement-charts` |
| **I Quit My 9-to-5** | `https://www.betsharpmoney.com/guides/i-quit-my-9-to-5-for-sports-betting?utm_source=youtube&utm_medium=video&utm_campaign=quit-9-to-5` |
| **Filter Settings** | `https://www.betsharpmoney.com/guides/sharpmoney-filter-settings-guide?utm_source=youtube&utm_medium=video&utm_campaign=filter-settings` |
| **General pricing link** (any video) | `https://www.betsharpmoney.com/#pricing?utm_source=youtube&utm_medium=video&utm_campaign=channel-general` |

---

### X / Twitter — Free Posts

When you tweet a link to a video or guide, use these instead of the plain URL.

| What you're linking to | Link to paste in tweet |
|------------------------|------------------------|
| **MLB +EV guide** | `https://www.betsharpmoney.com/guides/mlb-plus-ev-betting-guide-2026?utm_source=twitter&utm_medium=organic&utm_campaign=mlb-plus-ev-2026` |
| **Promo Optimizer guide** | `https://www.betsharpmoney.com/guides/sharpmoney-promo-optimizer?utm_source=twitter&utm_medium=organic&utm_campaign=promo-optimizer` |
| **Pricing page** | `https://www.betsharpmoney.com/#pricing?utm_source=twitter&utm_medium=organic&utm_campaign=general` |
| **Homepage** | `https://www.betsharpmoney.com/?utm_source=twitter&utm_medium=organic&utm_campaign=general` |

---

### X / Twitter — Paid Ads

Same idea, but `paid` instead of `organic` so you can see ad spend vs free posts separately in GA4.

| What you're promoting | Link to use in ad |
|-----------------------|-------------------|
| **MLB +EV guide** | `https://www.betsharpmoney.com/guides/mlb-plus-ev-betting-guide-2026?utm_source=twitter&utm_medium=paid&utm_campaign=mlb-plus-ev-2026` |
| **Promo Optimizer guide** | `https://www.betsharpmoney.com/guides/sharpmoney-promo-optimizer?utm_source=twitter&utm_medium=paid&utm_campaign=promo-optimizer` |
| **Pricing page** | `https://www.betsharpmoney.com/#pricing?utm_source=twitter&utm_medium=paid&utm_campaign=general` |
| **Homepage** | `https://www.betsharpmoney.com/?utm_source=twitter&utm_medium=paid&utm_campaign=general` |

---

### Pikkit

If Pikkit links to betsharpmoney.com from your profile or partner page, give them this URL:

| Where | Link |
|-------|------|
| **Pikkit profile / referral** | `https://www.betsharpmoney.com/?utm_source=pikkit&utm_medium=referral&utm_campaign=pikkit-profile` |

---

## When You Make a New Video or Guide

Just copy one of the links above and swap the guide slug and campaign name. The pattern is always:

```
https://www.betsharpmoney.com/guides/YOUR-GUIDE-SLUG?utm_source=WHERE&utm_medium=HOW&utm_campaign=SHORT-NAME
```

**WHERE** = `youtube`, `twitter`, `email`, `pikkit`, `tiktok`
**HOW** = `video`, `organic`, `paid`, `newsletter`, `referral`
**SHORT-NAME** = a short name for the content (lowercase, hyphens, no spaces)

Example: you publish a new video called "NFL Sharp Betting Tips" with a guide at `/guides/nfl-sharp-betting-tips`:

- **YouTube description:** `https://www.betsharpmoney.com/guides/nfl-sharp-betting-tips?utm_source=youtube&utm_medium=video&utm_campaign=nfl-sharp-tips`
- **Tweet (free):** `https://www.betsharpmoney.com/guides/nfl-sharp-betting-tips?utm_source=twitter&utm_medium=organic&utm_campaign=nfl-sharp-tips`
- **X ad (paid):** `https://www.betsharpmoney.com/guides/nfl-sharp-betting-tips?utm_source=twitter&utm_medium=paid&utm_campaign=nfl-sharp-tips`
- **Newsletter:** `https://www.betsharpmoney.com/guides/nfl-sharp-betting-tips?utm_source=email&utm_medium=newsletter&utm_campaign=nfl-sharp-tips`

---

## Where to See the Data in GA4

1. **GA4 → Acquisition → Traffic acquisition** — shows visits grouped by source (youtube, twitter, email, etc.)
2. **GA4 → Acquisition → User acquisition** — shows where first-time visitors came from
3. Filter by **campaign** to see which specific video or guide is driving the most traffic
