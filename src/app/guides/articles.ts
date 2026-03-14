// ============================================================================
// Guide articles data — add new articles here
// ============================================================================

export interface GuideArticle {
  slug: string;
  title: string;
  headline: string; // H1 on the page (can differ from SEO title)
  description: string;
  metaTitle: string; // SEO title
  metaDescription: string;
  keywords: string[];
  publishedAt: string; // ISO date
  updatedAt: string;
  readTime: string;
  category: "beginner" | "strategy" | "tools";
  categoryLabel: string;
  relatedTools: { name: string; slug: string }[];
  content: string; // HTML content
}

// ============================================================================
// All articles
// ============================================================================
export const ARTICLES: GuideArticle[] = [
  {
    slug: "what-is-ev-betting",
    title: "What is +EV Betting?",
    headline:
      "What is +EV Betting? A Complete Beginner's Guide to Expected Value in Sports Betting",
    description:
      "Learn what +EV (positive expected value) betting is, how it works, and why it's the only proven strategy to profit from sports betting long-term.",
    metaTitle:
      "What is +EV Betting? Expected Value Sports Betting Explained (2026)",
    metaDescription:
      "Learn what +EV (positive expected value) betting is, how it works, and why it's the only mathematically proven strategy to profit from sports betting. Free guide with examples.",
    keywords: [
      "what is ev betting",
      "what is plus ev betting",
      "what is expected value sports betting",
      "+ev betting explained",
      "positive expected value betting",
      "ev betting meaning",
      "what does ev mean in sports betting",
      "how does expected value work in betting",
      "is ev betting profitable",
      "how to bet on sports profitably",
      "sports betting expected value",
      "ev sports betting explained",
      "sharp betting strategy",
      "how to win at sports betting",
      "mathematical sports betting",
      "plus ev meaning",
      "+ev meaning sports betting",
      "expected value formula sports betting",
      "ev betting for beginners",
    ],
    publishedAt: "2026-03-14",
    updatedAt: "2026-03-14",
    readTime: "8 min read",
    category: "beginner",
    categoryLabel: "Beginner Guide",
    relatedTools: [
      { name: "EV Calculator", slug: "ev-calculator" },
      { name: "No-Vig Calculator", slug: "no-vig-calculator" },
      { name: "Odds Converter", slug: "odds-converter" },
    ],
    content: `
<p>Here's the uncomfortable truth about sports betting: <strong>95% of bettors lose money</strong>. Not because they're dumb. Not because they don't watch enough games. But because they're thinking about betting the wrong way.</p>

<p>The 5% who win? They don't care who wins the game. They care about one thing: <strong>is this bet priced below its true value?</strong></p>

<p>That's +EV betting. And it's the foundation of every profitable sports bettor's strategy.</p>

<h2>What Does +EV Mean?</h2>

<p>EV stands for <strong>Expected Value</strong>. It's the average amount you expect to win (or lose) per bet over the long run. When a bet has <em>positive</em> expected value (+EV), it means the payout is higher than the actual risk — the odds are in your favor.</p>

<p>Think of it like this: a casino has a positive expected value on every game they offer. That's why they always win over time. +EV betting flips the script — it puts you on the casino's side of the equation.</p>

<h2>How Expected Value Works — A Simple Example</h2>

<p>Let's say you flip a fair coin. Heads or tails, 50/50. Someone offers you a bet:</p>

<ul>
<li>You bet $100</li>
<li>If heads, you win $120</li>
<li>If tails, you lose $100</li>
</ul>

<p>Should you take it? Let's do the math:</p>

<p><strong>EV = (Win Probability × Profit) − (Loss Probability × Loss)</strong></p>
<p>EV = (0.50 × $120) − (0.50 × $100)</p>
<p>EV = $60 − $50 = <strong>+$10 per bet</strong></p>

<p>That's a +EV bet. You won't win every flip, but over 100, 500, or 1,000 flips, you'll average +$10 per bet. The math takes over.</p>

<p>Now apply that same logic to sports betting. Instead of a coin flip, you're looking at sportsbook odds — and asking whether the price they're offering is better than the true probability of the outcome.</p>

<h2>Why Most Bettors Lose (And Why +EV Bettors Don't)</h2>

<p>Most bettors think like this: "I think the Lakers will win tonight, so I'll bet on them." They're making decisions based on gut feelings, fandom, or what some handicapper said on Twitter.</p>

<p>+EV bettors think differently: "The sportsbook has this line at +150, but the true odds are closer to +130. That gap is my edge."</p>

<p>Here's the key difference:</p>

<ul>
<li><strong>Traditional bettors</strong> try to predict who wins</li>
<li><strong>+EV bettors</strong> find bets where the price is wrong</li>
</ul>

<p>You don't need to be right every time. You don't need to know anything about the teams. You just need to consistently bet when the price is in your favor. The law of large numbers handles the rest.</p>

<h2>How Sportsbooks Set Odds (And Where the Edge Comes From)</h2>

<p>To understand +EV betting, you need to understand how sportsbooks make money. It comes down to one word: <strong>vig</strong> (also called "juice").</p>

<p>The house doesn't need to be smarter than you. They just need to charge you more than the bet is worth.</p>

<p>Here's a simple example. A true 50/50 coin flip should be priced at +100 on both sides (even money). But a sportsbook will price it at <strong>-110 on both sides</strong>. That extra 10% is the vig — it's how they guarantee profit regardless of the outcome.</p>

<p>Now here's where it gets interesting: <strong>sportsbooks don't all agree on the price</strong>. There are 20+ legal sportsbooks in the US, and they each set their own odds. When one book's price is significantly different from the "true" market price, that's where +EV opportunities appear.</p>

<p>The "true" price is typically set by the <strong>sharpest books</strong> — Pinnacle, Circa, and Bookmaker — these are the sportsbooks that accept the biggest bets from professional bettors. Their lines represent the consensus of where the smart money is. When a retail sportsbook like DraftKings or FanDuel has a line that differs from the sharp books, that's often a +EV bet.</p>

<h2>A Real-World +EV Betting Example</h2>

<p>Let's say you're looking at an NFL game:</p>

<ul>
<li><strong>Pinnacle</strong> (sharp book) has the Bears moneyline at +130</li>
<li><strong>DraftKings</strong> has the Bears at +155</li>
</ul>

<p>Pinnacle's line implies a true probability of about 43.5%. At +155, DraftKings is paying you as if the Bears only have a 39.2% chance. That gap — 43.5% vs. 39.2% — is your edge.</p>

<p>If the Bears truly have a 43.5% chance of winning and you're getting paid +155, the expected value of that bet is positive. You're getting paid more than the bet is worth. Over time, finding and placing hundreds of these bets is what turns sports betting from gambling into investing.</p>

<h2>The EV Formula for Sports Betting</h2>

<p>Here's the exact formula for calculating expected value on any bet:</p>

<p><strong>EV = (True Win Probability × Profit if Win) − (True Loss Probability × Amount Risked)</strong></p>

<p>Using our example above ($100 bet on Bears +155 with a 43.5% true probability):</p>

<ul>
<li>Profit if win: $155</li>
<li>Amount risked: $100</li>
<li>Win probability: 43.5% (0.435)</li>
<li>Loss probability: 56.5% (0.565)</li>
</ul>

<p>EV = (0.435 × $155) − (0.565 × $100)</p>
<p>EV = $67.43 − $56.50 = <strong>+$10.93 per bet</strong></p>

<p>That's a +10.93% EV bet. For every $100 you wager on bets like this, you expect to profit $10.93 on average. Doesn't seem like much on a single bet — but across 10, 50, or 100 bets per day, it compounds fast.</p>

<p>Don't want to do this math by hand? <a href="/tools/ev-calculator">Try our free EV Calculator</a> — plug in your odds and true probability and it does the work for you.</p>

<h2>Why Volume Matters in +EV Betting</h2>

<p>Here's something that trips up beginners: you can place a +EV bet and still lose. In fact, you'll lose plenty of individual bets. That's normal.</p>

<p>The power of +EV betting is in <strong>volume</strong>. It's the law of large numbers — the more bets you place, the closer your actual results get to the expected value.</p>

<p>Think about it this way:</p>

<ul>
<li>Flip a coin 10 times — you might get 7 heads or 3 heads. High variance.</li>
<li>Flip it 10,000 times — you'll be very close to 50/50.</li>
</ul>

<p>The same applies to +EV betting. A single day or week might be negative. But across hundreds or thousands of bets, the math converges. This is why serious +EV bettors often place 20, 50, or even 100+ bets per day — they're maximizing the speed at which variance smooths out and the edge compounds.</p>

<h2>Is +EV Betting Actually Profitable?</h2>

<p>Yes — and there's real data to prove it. +EV bettors who stick with the strategy and maintain proper volume consistently profit over time. It's not a get-rich-quick scheme, but it is a proven, mathematical approach.</p>

<p>The typical +EV bettor sees somewhere between a <strong>2% and 8% ROI</strong> on their total wagered amount. That might sound small, but when you're wagering thousands per day across dozens of bets, it adds up quickly:</p>

<ul>
<li>$500/day wagered × 5% ROI = $25/day profit = ~$750/month</li>
<li>$2,000/day wagered × 5% ROI = $100/day profit = ~$3,000/month</li>
<li>$5,000/day wagered × 5% ROI = $250/day profit = ~$7,500/month</li>
</ul>

<p>The key is consistency and volume. The edge is real, but you have to trust the math and keep placing bets even when short-term results are negative.</p>

<h2>How to Find +EV Bets</h2>

<p>Finding +EV bets on your own is possible but extremely time-consuming. You'd need to:</p>

<ol>
<li>Monitor odds across 20+ sportsbooks in real time</li>
<li>Determine the "true" odds using sharp book data or no-vig calculations</li>
<li>Compare every available bet to the true odds</li>
<li>Calculate the EV% for each opportunity</li>
<li>Act fast — because lines move quickly once the market catches up</li>
</ol>

<p>This is why most +EV bettors use tools. A no-vig calculator can help you <a href="/tools/no-vig-calculator">strip the vig from any line</a> to reveal the true fair odds. An <a href="/tools/ev-calculator">EV calculator</a> tells you exactly how much edge you have on a given bet. And an <a href="/tools/odds-converter">odds converter</a> helps you compare odds across different formats.</p>

<p>For those who want the full picture — real-time +EV feeds, sharp book data, line movement charts, and Kelly Criterion bet sizing — that's what tools like <a href="https://whop.com/sharpmoney/pro-7e/">SharpMoney Pro</a> are built for.</p>

<h2>+EV Betting vs. Traditional Handicapping</h2>

<p>Traditional handicapping means studying teams, matchups, injuries, and trends to predict outcomes. It can work, but it requires deep expertise and even the best handicappers rarely sustain win rates above 55%.</p>

<p>+EV betting is fundamentally different:</p>

<table>
<thead>
<tr><th></th><th>Traditional Handicapping</th><th>+EV Betting</th></tr>
</thead>
<tbody>
<tr><td><strong>Based on</strong></td><td>Predictions & knowledge</td><td>Math & pricing</td></tr>
<tr><td><strong>Need to know the sport?</strong></td><td>Yes, deeply</td><td>No</td></tr>
<tr><td><strong>Volume</strong></td><td>5-10 bets/day</td><td>20-100+ bets/day</td></tr>
<tr><td><strong>Edge source</strong></td><td>Being smarter than the market</td><td>Finding mispriced lines</td></tr>
<tr><td><strong>Scalability</strong></td><td>Limited</td><td>Highly scalable</td></tr>
<tr><td><strong>Consistency</strong></td><td>Varies widely</td><td>Mathematically reliable</td></tr>
</tbody>
</table>

<p>Some of the most profitable +EV bettors bet on leagues they've never watched — Korean Baseball, Finnish Hockey, you name it. The math doesn't care about your sports knowledge. It just needs a mispriced line.</p>

<h2>Key Terms Every +EV Bettor Should Know</h2>

<dl>
<dt><strong>Expected Value (EV)</strong></dt>
<dd>The average profit or loss per bet over the long run.</dd>

<dt><strong>Vig (Juice)</strong></dt>
<dd>The sportsbook's built-in commission. It's how they guarantee profit.</dd>

<dt><strong>Sharp Books</strong></dt>
<dd>Sportsbooks like Pinnacle, Circa, and Bookmaker that accept large bets and set the most accurate lines.</dd>

<dt><strong>No-Vig Line (Fair Odds)</strong></dt>
<dd>The true odds of an outcome after stripping out the sportsbook's vig. <a href="/tools/no-vig-calculator">Calculate no-vig odds here.</a></dd>

<dt><strong>CLV (Closing Line Value)</strong></dt>
<dd>Whether you got better odds than the closing line. Consistently beating the close is a strong indicator of long-term profitability.</dd>

<dt><strong>Kelly Criterion</strong></dt>
<dd>A mathematical formula for calculating optimal bet size based on your edge and bankroll. <a href="/tools/kelly-calculator">Try our Kelly Calculator.</a></dd>

<dt><strong>Line Movement</strong></dt>
<dd>When odds change between opening and closing. Understanding why lines move helps you time your bets.</dd>
</dl>

<h2>Getting Started with +EV Betting</h2>

<p>If you're new to +EV betting, here's a simple roadmap:</p>

<ol>
<li><strong>Understand the concept</strong> — You're already doing this by reading this guide.</li>
<li><strong>Learn to read odds</strong> — Use our <a href="/tools/odds-converter">free odds converter</a> to get comfortable with American, Decimal, and Fractional formats.</li>
<li><strong>Practice calculating EV</strong> — Use our <a href="/tools/ev-calculator">EV Calculator</a> to see how different odds and probabilities affect expected value.</li>
<li><strong>Learn about the vig</strong> — Use our <a href="/tools/no-vig-calculator">No-Vig Calculator</a> to see the true fair odds behind any sportsbook line.</li>
<li><strong>Start placing small bets</strong> — Open accounts at multiple sportsbooks so you can always grab the best line.</li>
<li><strong>Scale with volume</strong> — As you get comfortable, increase the number of bets you place per day.</li>
</ol>

<h2>The Bottom Line</h2>

<p>+EV betting isn't a gambling strategy — it's a math strategy. You're not trying to predict the future. You're finding bets where the sportsbook's price is wrong, and letting the law of large numbers do the rest.</p>

<p>Most bettors will never learn this. They'll keep chasing parlays, following handicappers, and wondering why they always end up negative. But now you know the difference.</p>

<p>The question isn't whether +EV betting works. The math proves that it does. The question is whether you'll put in the volume to let it work for you.</p>
`,
  },
];

// Helper to get an article by slug
export function getArticleBySlug(slug: string): GuideArticle | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
