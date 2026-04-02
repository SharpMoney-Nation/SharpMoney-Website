# SharpMoney — Tracking Link Reference

> Two kinds of links, two jobs:
> - **Whop links** → track actual sales (clicks, revenue, conversions) inside your Whop dashboard
> - **UTM links** → track website traffic sources inside Google Analytics

---

## Whop Tracking Links (Sales Attribution)

Use these whenever someone can click straight to checkout. Whop tracks every click and purchase automatically — no UTMs needed.

### YouTube Video Descriptions

Paste these in every video description so viewers can buy directly from YouTube.

| Plan | Link |
|------|------|
| **Core** | `https://whop.com/c/core-ae/core` |
| **Pro** | `https://whop.com/c/pro-7e/pro` |
| **Alpha** | `https://whop.com/c/alpha-4e/alpha` |

### X / Twitter — Paid and Organic Posts

Use these when an X post (paid or organic) links straight to Whop, skipping the website.

| Plan | Link |
|------|------|
| **Core** | `https://whop.com/c/core-ae/xdirectcore` |
| **Pro** | `https://whop.com/c/pro-7e/xdirectpro` |
| **Alpha** | `https://whop.com/c/alpha-4e/xdirectalpha` |

### Pikkit — Direct to Checkout

Use these when a Pikkit post links straight to Whop.

| Plan | Link |
|------|------|
| **Core** | `https://whop.com/c/core-ae/pikkitcore` |
| **Pro** | `https://whop.com/c/pro-7e/pikkitpro` |
| **Alpha** | `https://whop.com/c/alpha-4e/pikkitalpha` |

### Email — Direct to Checkout

Use these in email campaigns when linking directly to Whop.

| Plan | Link |
|------|------|
| **Core** | `https://whop.com/c/core-ae/emailcore` |
| **Pro** | `https://whop.com/c/pro-7e/emailpro` |
| **Alpha** | `https://whop.com/c/alpha-4e/emailalpha` |

### Website (Already Built In)

All Whop links on betsharpmoney.com already use these — no action needed. Listed here for reference.

| Plan | Link |
|------|------|
| **Core** | `https://whop.com/c/core-ae/websitecore` |
| **Pro** | `https://whop.com/c/pro-7e/websitepro` |
| **Alpha** | `https://whop.com/c/alpha-4e/websitealpha` |

---

## UTM Links (Website Traffic in GA4)

Use these when linking to **betsharpmoney.com** (not Whop). They tell Google Analytics where the visitor came from.

### YouTube Video Descriptions

Put these alongside the Whop links above so viewers can visit the website too.

| Video | Link to paste in description |
|-------|------------------------------|
| **MLB +EV Guide** | `https://www.betsharpmoney.com/guides/mlb-plus-ev-betting-guide-2026?utm_source=youtube&utm_medium=video&utm_campaign=mlb-plus-ev-2026` |
| **Promo Optimizer** | `https://www.betsharpmoney.com/guides/sharpmoney-promo-optimizer?utm_source=youtube&utm_medium=video&utm_campaign=promo-optimizer` |
| **Line Movement Charts** | `https://www.betsharpmoney.com/guides/line-movement-charts-ev-betting-strategy?utm_source=youtube&utm_medium=video&utm_campaign=line-movement-charts` |
| **I Quit My 9-to-5** | `https://www.betsharpmoney.com/guides/i-quit-my-9-to-5-for-sports-betting?utm_source=youtube&utm_medium=video&utm_campaign=quit-9-to-5` |
| **Filter Settings** | `https://www.betsharpmoney.com/guides/sharpmoney-filter-settings-guide?utm_source=youtube&utm_medium=video&utm_campaign=filter-settings` |
| **General pricing link** (any video) | `https://www.betsharpmoney.com/#pricing?utm_source=youtube&utm_medium=video&utm_campaign=channel-general` |

### X / Twitter — Free Posts

| What you're linking to | Link to paste in tweet |
|------------------------|------------------------|
| **MLB +EV guide** | `https://www.betsharpmoney.com/guides/mlb-plus-ev-betting-guide-2026?utm_source=twitter&utm_medium=organic&utm_campaign=mlb-plus-ev-2026` |
| **Promo Optimizer guide** | `https://www.betsharpmoney.com/guides/sharpmoney-promo-optimizer?utm_source=twitter&utm_medium=organic&utm_campaign=promo-optimizer` |
| **Pricing page** | `https://www.betsharpmoney.com/#pricing?utm_source=twitter&utm_medium=organic&utm_campaign=general` |
| **Homepage** | `https://www.betsharpmoney.com/?utm_source=twitter&utm_medium=organic&utm_campaign=general` |

### X / Twitter — Paid Ads (to Website)

When a paid ad sends people to the website first (not directly to Whop), use these.

| What you're promoting | Link to use in ad |
|-----------------------|-------------------|
| **MLB +EV guide** | `https://www.betsharpmoney.com/guides/mlb-plus-ev-betting-guide-2026?utm_source=twitter&utm_medium=paid&utm_campaign=mlb-plus-ev-2026` |
| **Promo Optimizer guide** | `https://www.betsharpmoney.com/guides/sharpmoney-promo-optimizer?utm_source=twitter&utm_medium=paid&utm_campaign=promo-optimizer` |
| **Pricing page** | `https://www.betsharpmoney.com/#pricing?utm_source=twitter&utm_medium=paid&utm_campaign=general` |
| **Homepage** | `https://www.betsharpmoney.com/?utm_source=twitter&utm_medium=paid&utm_campaign=general` |

### Pikkit

| Where | Link |
|-------|------|
| **Pikkit profile / referral** | `https://www.betsharpmoney.com/?utm_source=pikkit&utm_medium=referral&utm_campaign=pikkit-profile` |

---

## When You Make a New Video or Guide

1. **Whop links stay the same** — always use the YouTube set from above (core/pro/alpha)
2. **UTM links** — copy one from above and swap the guide slug and campaign name:

```
https://www.betsharpmoney.com/guides/YOUR-GUIDE-SLUG?utm_source=WHERE&utm_medium=HOW&utm_campaign=SHORT-NAME
```

**WHERE** = `youtube`, `twitter`, `email`, `pikkit`, `tiktok`
**HOW** = `video`, `organic`, `paid`, `newsletter`, `referral`
**SHORT-NAME** = a short name for the content (lowercase, hyphens, no spaces)

---

## Where to See the Data

| What you want | Where to look |
|---------------|---------------|
| **Sales by source** (YouTube vs Website vs X vs Pikkit vs Email) | **Whop Dashboard → Tracking Links** |
| **Website traffic by source** | **GA4 → Acquisition → Traffic acquisition** |
| **First-time visitors by source** | **GA4 → Acquisition → User acquisition** |
| **Which video/guide drives the most traffic** | GA4 → filter by **campaign** |
