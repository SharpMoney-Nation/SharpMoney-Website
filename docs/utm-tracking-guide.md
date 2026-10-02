# SharpMoney link tagging (UTM rulebook)

Last updated: 2026-10-01. The full rulebook with the dashboard rules lives in the app repo at `docs/runbooks/utm-rulebook.md`. This copy is the short version for anyone posting links.

## Why tags matter

Every link we post should say where it came from. The website remembers a visitor's first source for 90 days, passes it to the free Core join box and to Pro/Alpha checkout, and the owners' dashboard groups signups and revenue by that source. Untagged links show up as "direct", which tells us nothing.

## The four tags

| Tag | What it means | Allowed values |
|---|---|---|
| `utm_source` | Where the link lives | `youtube`, `x`, `instagram`, `tiktok`, `discord`, `email`, `newsletter`, `whop`, a partner name (`novig`, `pikkit`, `edgeboost`, `prophetx`) |
| `utm_medium` | What kind of placement | `organic`, `paid`, `email`, `referral`, `bio`, `description`, `community` |
| `utm_campaign` | The specific push | A short slug: `nfl-week5`, `dfs-guide`, `oct-promo`, the video id |
| `utm_content` | The exact link or creative | Optional. `pinned-comment`, `video-end-card`, `ad-a` |

Rules:
- Lowercase, words joined with `-`. No spaces, no capitals.
- The same word always means the same thing.
- Never tag links **inside** betsharpmoney.com. Internal tags overwrite the real source in Google Analytics.
- Ads run through Whop already add their own tags. Do not add more.

## Copy-paste templates

Replace `CAMPAIGN` with your slug.

**YouTube description / pinned comment**
`https://www.betsharpmoney.com/?utm_source=youtube&utm_medium=description&utm_campaign=CAMPAIGN`

**X post (organic)**
`https://www.betsharpmoney.com/?utm_source=x&utm_medium=organic&utm_campaign=CAMPAIGN`

**X / Instagram / TikTok bio**
`https://www.betsharpmoney.com/?utm_source=x&utm_medium=bio&utm_campaign=profile`

**Email / newsletter**
`https://www.betsharpmoney.com/?utm_source=email&utm_medium=email&utm_campaign=CAMPAIGN`

**Discord**
`https://www.betsharpmoney.com/?utm_source=discord&utm_medium=community&utm_campaign=CAMPAIGN`

**Partner (their site linking to us)**
`https://www.betsharpmoney.com/?utm_source=PARTNER&utm_medium=referral&utm_campaign=CAMPAIGN`

**Linking straight to a plan on Whop** (skips the website, so tag it)
`https://whop.com/c/pro-7e/websitepro?utm_source=youtube&utm_medium=description&utm_campaign=CAMPAIGN`
`https://whop.com/c/alpha-4e/websitealpha?utm_source=youtube&utm_medium=description&utm_campaign=CAMPAIGN`

Prefer sending people to **betsharpmoney.com** over whop.com. The website remembers the source and tracks the whole path; a direct Whop link only records the join.

## Whop affiliate codes still in use

The website's own buttons carry affiliate codes so Whop can tell website signups apart: `websitecore` (join box), `websitepro`, `websitealpha`. Leave them as they are.

## Checking a link

Open the tagged link in a private window, then look at Google Analytics → Reports → Realtime. The visit should show under your `utm_source` within a minute.
