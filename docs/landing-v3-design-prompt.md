# Landing v3 design prompt (Claude Design)

Core-first landing page: free Core, email-only join box in the hero, no Survivor above the footer.
Paste the block below into Claude Design as-is. Plan of record: sharpmoney-whop-app `tasks/plans/core-first-landing-plan.md`.

```
You are designing the new landing page for SharpMoney (betsharpmoney.com), a +EV sports-betting analytics tool. Produce a multi-artboard canvas: Desktop 1440×~5200 and Mobile 390×~6400, full page each, plus one 1200×630 OG card.

GOAL
One job: get a visitor to join SharpMoney Core, which is 100% free and needs only an email (no credit card). The join box is a Whop checkout embed (email field + "Join Free" button + a small terms checkbox) that we control the colors of but not the layout inside. Design the page around that box. Do NOT show or mention the NFL Survivor Pool, Pikkit, or any prize money anywhere above the footer. (The footer keeps one small "Contest Rules" link and a one-sentence legal line that names the pool; that is required and fine.)

BRAND SYSTEM (use exactly)
- Background #0d1420, panels #111827, bands #0b111b, borders #1f2937.
- Accent cyan #22d3ee (hover/dim #06b6d4), success green #4ade80, text #ffffff, muted #9ca3af / #6b7280. Blue #60a5fa sparingly. Do not use gold/amber as a page accent (it was the prize color); Alpha's plan card may keep a subtle gold border only.
- Fonts: Russo One for headlines and CTAs (uppercase, letter-spacing 0.01–0.05em), Roboto Condensed for body, IBM Plex Mono for numbers like "$0" and "+2.0% EV".
- Buttons: cyan fill #06b6d4, text #052330, radius 10px, bold, uppercase, subtle pulse glow on the primary. Secondary: 1px #374151 border, text #d1d5db.
- Cards: 1px border #1f2937 on #111827, radius 12–14px, soft cyan glow on the hero card only.
- Motion is CSS-only and must respect reduced motion.

PAGE STRUCTURE (top to bottom)
1. Thin announcement bar (cyan gradient #06b6d4→#22d3ee, dark text #052330): "SharpMoney Core is 100% free. No credit card. Join with your email →"
2. Sticky nav: logo + "SharpMoney" (Russo One), links Plans / Tools / Guides / Promos / Results, gold-text "Log In" (#f59e0b), cyan pill "JOIN FREE" that scrolls to the join box.
3. HERO, two columns on desktop (copy left, join card right), stacked on mobile (copy, then join card immediately below).
   - Eyebrow pill: blinking cyan dot + "100% FREE • NO CREDIT CARD"
   - H1 (Russo One, ~42px desktop / 28px mobile): "A FREE BETTING TOOL FOR SMARTER BETS." (two lines: "A FREE BETTING TOOL" white, "FOR SMARTER BETS." cyan)
   - Sub (Roboto Condensed 18px, #9ca3af): "SharpMoney Core finds the bets where the odds are on your side, at the book with the best price. Type your email. Click Join. You're in."
   - Three check bullets (green check): "Live feed of smart bets, updated all day" · "Compare prices across every major sportsbook" · "One tap to bet at the best price"
   - JOIN CARD (the hero visual): a #111827 card, ~430px wide, 1px cyan border at 35% alpha, cyan glow. Header row: "SHARPMONEY CORE" (Russo One 22px) + green pill "FREE FOREVER". Then a placeholder frame labelled "WHOP EMBED — email input + Join Free button (~360×260, reserve this height)" with a mock email field (placeholder "you@example.com"), a small checkbox line "I agree to the terms", and a full-width cyan "JOIN FREE" button. Under it, mono text "$0 today · no card on file". Small caption: "You'll be inside the tool in a few seconds." Then a full-width SECONDARY button "LOG IN" (for the many people who already have Core). Muted text link below: "Prefer the full signup page? Open secure signup". Last line, very small: "21+. Gambling problem? Call 1-800-GAMBLER."
4. Trust strip (band #0b111b): 4.9 ★★★★★ · 5K+ Community Members · 20+ Sportsbooks Covered · $0 To Join.
5. "SEE HOW CORE WORKS": section headline "THIS IS THE FEED." Sub: "Every row is a bet where the sportsbook's price beats the true odds." A framed dark screenshot of the +EV feed (rows: green EV % like +2.0%, gold risk amount like $108, league chip, matchup, book logo + market like "Over 167 Points", odds +115, cyan "Bet" button). Three numbered callouts pointing at: (1) "EV % = your edge", (2) "Suggested risk for a small bankroll", (3) "Best book + one-click bet link". Use a mock of the feed matching those columns if no image is provided.
6. "THREE STEPS": 1 JOIN WITH YOUR EMAIL — "No card. No trial clock. Your account is ready in seconds." 2 OPEN THE LIVE FEED — "Bets are ranked by edge and refresh automatically." 3 BET THE EDGE — "Tap Bet to open the best price at your book."
7. "WHY IS CORE FREE?": headline "WHY IS CORE FREE?" Three cards: (a) "We're building the best +EV community." — "More sharp bettors in one place makes everyone's data better. Core is how you get in the door." (b) "Small bankroll? Start here." — "Core covers the main markets and shows a suggested risk per bet, so you can start small and stay disciplined." (c) "Scale when you're ready." — "Pro adds player props, line movement and Pinnacle limits. Alpha adds SharpMoney Signal. Upgrade only when your bankroll asks for it." Small line under: "Betting involves risk. +EV means a better price, not a guaranteed win."
8. PRICING "CHOOSE YOUR EDGE": Core card first and largest — "FREE", strike-through "$29.99", badge "NOW FREE", features: Core +EV tool access · Core odds screen · Core Promo Optimizer · Free betting calculators · Core Discord access · One-click deep links; CTA "JOIN FREE" (scrolls to hero box). Pro $79.99/mo "MOST POPULAR" (Everything in Core · Full Plus EV tool · Line movement and Pinnacle limits · DFS tool plus exchange liquidity · Advanced filters · All sportsbooks) CTA "GET PRO ACCESS". Alpha $199.99/mo "MAXIMUM EDGE" (Everything in Pro · SharpMoney Signal · Professional plays · Alpha Discord · All future add-ons · Priority support) CTA "GO ALPHA". Subhead: "Start free. Upgrade when your bankroll is ready. Pro and Alpha include a 3-day free trial."
9. FAQ (accordion, 7 items): Is Core really free? · Do I need a credit card? · What's included in Core? · What does +EV mean? · Can I use Core with a small bankroll? · How do I upgrade later? · Do I need a Whop account? (answer: your email creates one automatically).
10. FINAL CTA band: "READY? IT TAKES ONE EMAIL." + cyan button "JOIN FREE" (scrolls to hero box) + muted line "No credit card. Just your email."
11. Footer: logo, links (Plans / Tools / Guides / Promos / Results / Contest Rules / Privacy Policy / Terms / Discord / X / YouTube), legal block: "SharpMoney provides tools for informational purposes. Sports betting involves risk. Please gamble responsibly. The $5,000 NFL Survivor Pool is presented in partnership with Pikkit and is free to enter; see the official rules for eligibility and full terms. If you or someone you know has a gambling problem, call 1-800-GAMBLER." (This sentence is the one allowed mention of the pool.)

RULES
- The join box must be visible above the fold on both desktop and mobile without scrolling past the H1.
- No horizontal scroll at 390px; 16px side gutters minimum.
- Keep copy exactly as written unless it breaks a layout; shorten, never add claims.
- Provide a layer/section naming that maps to: announcement, nav, hero, trust, feed, steps, why-free, pricing, faq, final-cta, footer.
```
