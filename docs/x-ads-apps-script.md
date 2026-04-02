# X Ads → Google Sheets Automation (Google Apps Script)

> Automatically pulls your X Ads campaign spend data into a Google Sheet daily.

---

## Prerequisites

1. **X Developer Account**: Apply at [developer.x.com](https://developer.x.com) (free)
2. **X Ads API access**: Once your developer account is approved, request Ads API access
3. **API credentials**: You'll need:
   - API Key (Consumer Key)
   - API Secret (Consumer Secret)
   - Access Token
   - Access Token Secret
4. **Your X Ads Account ID**: Found in X Ads Manager URL (the string after `/accounts/`)

---

## Setup Steps

### 1. Create the Google Sheet

Create a new Google Sheet (or use the one from the Looker Studio setup) with a tab called `X Ad Spend` with these headers in row 1:

```
Date | Campaign | Campaign ID | Spend | Impressions | Clicks | Link Clicks | Engagements
```

### 2. Open Apps Script

1. In Google Sheets, go to **Extensions** → **Apps Script**
2. Delete any existing code
3. Paste the script below
4. Replace the placeholder values with your actual credentials

### 3. The Script

```javascript
const CONFIG = {
  API_KEY: 'YOUR_API_KEY',
  API_SECRET: 'YOUR_API_SECRET',
  ACCESS_TOKEN: 'YOUR_ACCESS_TOKEN',
  ACCESS_TOKEN_SECRET: 'YOUR_ACCESS_TOKEN_SECRET',
  ACCOUNT_ID: 'YOUR_ADS_ACCOUNT_ID',
  SHEET_NAME: 'X Ad Spend'
};

function fetchXAdsData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    SpreadsheetApp.getActiveSpreadsheet().insertSheet(CONFIG.SHEET_NAME);
    sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
    sheet.appendRow(['Date', 'Campaign', 'Campaign ID', 'Spend', 'Impressions', 'Clicks', 'Link Clicks', 'Engagements']);
  }

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const startTime = Utilities.formatDate(yesterday, 'UTC', "yyyy-MM-dd'T'00:00:00'Z'");
  const endTime = Utilities.formatDate(today, 'UTC', "yyyy-MM-dd'T'00:00:00'Z'");

  // Step 1: Get campaigns
  const campaignsUrl = `https://ads-api.x.com/12/accounts/${CONFIG.ACCOUNT_ID}/campaigns?with_deleted=false`;
  const campaignsResponse = makeAuthenticatedRequest(campaignsUrl);
  const campaigns = JSON.parse(campaignsResponse.getContentText()).data;

  if (!campaigns || campaigns.length === 0) {
    Logger.log('No active campaigns found');
    return;
  }

  // Step 2: Get analytics for each campaign
  const campaignIds = campaigns.map(c => c.id).join(',');
  const statsUrl = `https://ads-api.x.com/12/stats/accounts/${CONFIG.ACCOUNT_ID}`
    + `?entity=CAMPAIGN`
    + `&entity_ids=${campaignIds}`
    + `&start_time=${startTime}`
    + `&end_time=${endTime}`
    + `&granularity=DAY`
    + `&metric_groups=BILLING,ENGAGEMENT`;

  const statsResponse = makeAuthenticatedRequest(statsUrl);
  const statsData = JSON.parse(statsResponse.getContentText()).data;

  // Step 3: Write to sheet
  const dateStr = Utilities.formatDate(yesterday, 'UTC', 'yyyy-MM-dd');

  for (let i = 0; i < campaigns.length; i++) {
    const campaign = campaigns[i];
    const stats = statsData[i]?.id_data?.[0]?.metrics || {};

    const spend = (stats.billed_charge_local_micro?.[0] || 0) / 1000000;
    const impressions = stats.impressions?.[0] || 0;
    const clicks = stats.clicks?.[0] || 0;
    const urlClicks = stats.url_clicks?.[0] || 0;
    const engagements = stats.engagements?.[0] || 0;

    sheet.appendRow([
      dateStr,
      campaign.name,
      campaign.id,
      spend.toFixed(2),
      impressions,
      clicks,
      urlClicks,
      engagements
    ]);
  }

  Logger.log(`Updated ${campaigns.length} campaigns for ${dateStr}`);
}

function makeAuthenticatedRequest(url) {
  const service = getOAuthService();
  const response = service.fetch(url);
  return response;
}

function getOAuthService() {
  return OAuth1.createService('twitter')
    .setAccessToken(CONFIG.ACCESS_TOKEN, CONFIG.ACCESS_TOKEN_SECRET)
    .setConsumerKey(CONFIG.API_KEY)
    .setConsumerSecret(CONFIG.API_SECRET);
}
```

### 4. Add the OAuth1 Library

The script uses OAuth1 for X API authentication:

1. In Apps Script, click **+** next to **Libraries**
2. Enter this Script ID: `1CXDCY5sqT9ph64fFwSzVtXnbjpSfWdRymafDrtIZ7Z_hwysTY7IIhi7s`
3. Click **Look up** → select the latest version → click **Add**

### 5. Set Up Daily Trigger

1. In Apps Script, click the **clock icon** (Triggers) in the left sidebar
2. Click **+ Add Trigger**
3. Settings:
   - Function: `fetchXAdsData`
   - Event source: **Time-driven**
   - Type: **Day timer**
   - Time: **6:00 AM - 7:00 AM** (before you check your dashboard)
4. Click **Save**

### 6. Test It

1. Click **Run** on the `fetchXAdsData` function
2. Authorize when prompted
3. Check your Google Sheet — yesterday's campaign data should appear

---

## What You Get

Every morning, your Google Sheet automatically updates with yesterday's X Ads data. Since Looker Studio is connected to this Sheet, your dashboard updates too.

| Column | What it means |
|--------|---------------|
| Spend | Actual dollars spent on that campaign yesterday |
| Impressions | How many times the ad was shown |
| Clicks | Total clicks (includes profile clicks, likes, etc.) |
| Link Clicks | Clicks that went to your URL (this is the one you care about most) |
| Engagements | Likes, retweets, replies, follows from the ad |

---

## Troubleshooting

- **"OAuth1 is not defined"** → You need to add the OAuth1 library (step 4)
- **"401 Unauthorized"** → Double-check your API credentials in the CONFIG object
- **"No active campaigns"** → Make sure you have running campaigns in X Ads Manager
- **Data looks wrong** → X Ads data locks after 24 hours; yesterday's data is final, today's is still updating
