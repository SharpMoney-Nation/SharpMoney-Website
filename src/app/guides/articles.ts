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

<p>Here's a simple example. A true 50/50 coin flip should be priced at +100 on both sides (even money). But a sportsbook will price it at <strong>-110 on both sides</strong>. At -110, you're risking $110 to win $100 — each side implies a 52.4% chance, which adds up to 104.8%. That extra 4.8% is the vig — it's how they guarantee profit regardless of the outcome.</p>

<p>Now here's where it gets interesting: <strong>sportsbooks don't all agree on the price</strong>. There are 20+ legal sportsbooks in the US, and they each set their own odds. When one book's price is significantly different from the "true" market price, that's where +EV opportunities appear.</p>

<p>The "true" price is typically set by the <strong>sharpest books</strong> — Pinnacle, Circa, and Bookmaker — these are the sportsbooks that accept the biggest bets from professional bettors. Their lines represent the consensus of where the smart money is. When a retail sportsbook like DraftKings or FanDuel has a line that differs from the sharp books, that's often a +EV bet.</p>

<h2>A Real-World +EV Betting Example</h2>

<p>Let's say you're looking at an NFL game. First, you check the <strong>sharp book</strong> to find the true probability:</p>

<ul>
<li><strong>Pinnacle</strong> has the Bears moneyline at <strong>+130 / -150</strong></li>
</ul>

<p>Important: you can't just use +130 as the true odds — that line still has vig in it. You need <em>both sides</em> of Pinnacle's line and then <a href="/tools/no-vig-calculator">strip the vig</a> to find the real probability.</p>

<ul>
<li>+130 implies 43.5%</li>
<li>-150 implies 60.0%</li>
<li>Total: 103.5% (the extra 3.5% is Pinnacle's vig)</li>
</ul>

<p>After removing the vig, the <strong>true probabilities</strong> are roughly: Bears <strong>42.0%</strong> / Opponent <strong>58.0%</strong>.</p>

<p>Now you check the retail books and find:</p>

<ul>
<li><strong>DraftKings</strong> has the Bears at <strong>+155</strong></li>
</ul>

<p>At +155, DraftKings is pricing the Bears as if they only have a 39.2% chance. But you know the true probability is 42.0%. That gap — 42.0% vs. 39.2% — is your edge. You're getting paid more than the bet is worth.</p>

<p>Over time, finding and placing hundreds of bets like this is what turns sports betting from gambling into investing.</p>

<h2>The EV Formula for Sports Betting</h2>

<p>Here's the exact formula for calculating expected value on any bet:</p>

<p><strong>EV = (True Win Probability × Profit if Win) − (True Loss Probability × Amount Risked)</strong></p>

<p>Using our example above ($100 bet on Bears +155 with a 42.0% true probability after removing the vig):</p>

<ul>
<li>Profit if win: $155</li>
<li>Amount risked: $100</li>
<li>Win probability: 42.0% (0.42)</li>
<li>Loss probability: 58.0% (0.58)</li>
</ul>

<p>EV = (0.42 × $155) − (0.58 × $100)</p>
<p>EV = $65.10 − $58.00 = <strong>+$7.10 per bet</strong></p>

<p>That's a +7.1% EV bet. For every $100 you wager on bets like this, you expect to profit $7.10 on average. Doesn't seem like much on a single bet — but across 10, 50, or 100 bets per day, it compounds fast.</p>

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
  {
    slug: "beginners-guide-to-sharpmoney",
    title: "A Beginner's Guide to SharpMoney",
    headline:
      "A Beginner's Guide to SharpMoney: How to Use Sharp Book Data, Line Movement & the +EV Engine",
    description:
      "Learn how SharpMoney works — from Pinnacle limits and line movement charts to the +EV engine, Kelly Criterion sizing, and one-click bet links. Everything you need to start placing profitable bets.",
    metaTitle:
      "Beginner's Guide to SharpMoney — Sharp Books, Line Movement & +EV Tools (2026)",
    metaDescription:
      "Complete beginner's guide to SharpMoney. Learn how the +EV engine finds mispriced bets using Pinnacle limits, line movement, no-vig odds, and Kelly Criterion — plus how to use every feature.",
    keywords: [
      "sharpmoney guide",
      "how to use sharpmoney",
      "sharpmoney review",
      "sharpmoney tutorial",
      "sharpmoney +ev tool",
      "pinnacle limits betting",
      "what are pinnacle limits",
      "line movement sports betting",
      "line movement explained betting",
      "how to read line movement",
      "sharp books sports betting",
      "what is a sharp sportsbook",
      "pinnacle sports betting",
      "closing line value explained",
      "CLV sports betting",
      "kelly criterion sports betting",
      "no vig calculator",
      "+ev engine how it works",
      "sharpmoney pro vs alpha",
      "best +ev betting tool",
      "ev betting software",
      "sports betting tools",
      "how to find +ev bets",
      "sharpmoney beginner",
    ],
    publishedAt: "2026-03-14",
    updatedAt: "2026-03-14",
    readTime: "12 min read",
    category: "beginner",
    categoryLabel: "Beginner Guide",
    relatedTools: [
      { name: "EV Calculator", slug: "ev-calculator" },
      { name: "No-Vig Calculator", slug: "no-vig-calculator" },
      { name: "Kelly Calculator", slug: "kelly-calculator" },
    ],
    content: `
<p>So you've heard about +EV betting. Maybe you've even read our <a href="/guides/what-is-ev-betting">guide on what +EV betting is</a>. Now you're wondering: <strong>how does SharpMoney actually help me do this?</strong></p>

<p>This guide walks you through every core concept behind the SharpMoney platform — from sharp books and Pinnacle limits to line movement charts, the +EV engine, and how it all comes together to help you find profitable bets every single day.</p>

<h2>What Is SharpMoney?</h2>

<p>SharpMoney is a +EV betting platform that scans <strong>20+ sportsbooks in real time</strong> — including sharp books, retail books, exchanges, and prediction markets — to find bets where the price is in your favor.</p>

<p>Instead of trying to predict who wins a game, SharpMoney tells you when a sportsbook's odds are mispriced compared to the true market value. You don't need to know anything about the teams, the players, or the sport. You just need to follow the math.</p>

<p>The platform does the heavy lifting — finding the bets, calculating your edge, sizing your wagers, and linking you directly to the sportsbook's bet slip. Your job is to show up, review the feed, and place the bets.</p>

<h2>Sharp Books: The Foundation of Everything</h2>

<p>To understand SharpMoney, you first need to understand what makes a sportsbook "sharp."</p>

<p>Not all sportsbooks are created equal. <strong>Retail books</strong> like DraftKings, FanDuel, and BetMGM are designed for recreational bettors. They run promotions, boost parlays, and generally have softer lines — meaning their odds are less precise.</p>

<p><strong>Sharp books</strong> — primarily <strong>Pinnacle</strong>, <strong>Circa</strong>, and <strong>Bookmaker</strong> — are fundamentally different. These sportsbooks:</p>

<ul>
<li>Accept massive bets from professional bettors (sometimes $50,000+ on a single wager)</li>
<li>Don't limit or ban winning players</li>
<li>Set their lines based on where the smartest money in the world is going</li>
<li>Have the tightest vig (lowest margins) in the industry</li>
</ul>

<p>Because sharp books take huge action from the sharpest bettors on the planet, their lines are considered the <strong>closest thing to the "true" price</strong> of any sporting event. When Pinnacle says a team has a 55% chance of winning, that's the consensus of billions of dollars in professional betting activity.</p>

<p>This is why SharpMoney uses sharp book data as the <strong>benchmark for fair value</strong>. When a retail book like DraftKings has a line that differs significantly from Pinnacle's, that gap is often a +EV opportunity.</p>

<h2>What Are Pinnacle Limits?</h2>

<p>You'll see the term "Pinnacle limits" referenced a lot in SharpMoney. Here's what it means and why it matters.</p>

<p>Pinnacle has dynamic bet limits — the maximum amount you can wager on a given market. These limits start low when a line first opens and <strong>increase as more money flows in</strong> and the line becomes more efficient.</p>

<ul>
<li><strong>Low limits</strong> = the line just opened, hasn't been tested by much money yet, and may still be soft (less reliable)</li>
<li><strong>High limits</strong> = heavy professional action has shaped the line, making it a strong indicator of true probability</li>
</ul>

<p>Why does this matter for you? Because <strong>not all +EV bets are created equal</strong>. A bet that shows +5% EV against a low-limit Pinnacle line is less trustworthy than one showing +3% EV against a high-limit line. High limits mean the sharp market has spoken with real money — you can trust that price.</p>

<p>SharpMoney displays Pinnacle limits right in the tool so you can filter and prioritize bets backed by the strongest market data. Many experienced +EV bettors set a minimum Pinnacle limit threshold in their filters to avoid betting against lines that haven't been fully shaped yet.</p>

<h2>Line Movement: Reading the Story Behind the Odds</h2>

<p>Odds aren't static. From the moment a line opens to when the game starts, the numbers move — and those movements tell a story.</p>

<p><strong>Line movement</strong> is simply the change in odds over time. Understanding <em>why</em> lines move is one of the most important skills in +EV betting.</p>

<h3>Why Do Lines Move?</h3>

<p>Lines move for two main reasons:</p>

<ol>
<li><strong>Sharp money</strong> — Professional bettors place large wagers, and sportsbooks adjust the line in response. If Pinnacle's line on the Bears moves from +130 to +120, it means sharp bettors are backing the Bears, and the market is pricing them as more likely to win.</li>
<li><strong>News and information</strong> — Injuries, weather, lineup changes, and other factors can cause lines to shift. A star player being ruled out will move the line significantly.</li>
</ol>

<h3>How to Read Line Movement in SharpMoney</h3>

<p>SharpMoney includes <strong>line movement charts</strong> that show how odds have changed over time across multiple sportsbooks. Here's what to look for:</p>

<ul>
<li><strong>Line moving in your direction</strong> — If you're considering a bet on the Bears +155 and you see that sharp books have moved the Bears from +140 to +130 (meaning the market is becoming <em>more</em> confident in the Bears), that's <strong>confirmation</strong>. The sharp money agrees with your side.</li>
<li><strong>Line moving against you</strong> — If the sharp line is moving <em>away</em> from your bet (say the Bears are drifting from +130 to +145), that's a warning sign. The market may be telling you the edge isn't real — or the line you're looking at on the retail book is stale and about to correct.</li>
<li><strong>Stable, high-limit lines</strong> — A line that hasn't moved much and has high Pinnacle limits is a strong, well-tested price. +EV bets against stable sharp lines tend to be the most reliable.</li>
</ul>

<p>Before placing any bet, checking the line movement chart takes seconds and can save you from betting into a stale or unreliable line. It's one of the simplest habits that separates profitable bettors from everyone else.</p>

<h2>The +EV Engine: How SharpMoney Finds Your Bets</h2>

<p>At the heart of SharpMoney is the <strong>+EV engine</strong> — the real-time system that does the work of comparing odds across every sportsbook to find mispriced bets.</p>

<p>Here's how it works, step by step:</p>

<ol>
<li><strong>Pulls live odds from 20+ sportsbooks</strong> — Retail books, sharp books, exchanges, and prediction markets. Every line, every market, every sport — updated constantly.</li>
<li><strong>Determines the "true" price</strong> — Using sharp book data (primarily Pinnacle), the engine strips the vig from the line to calculate the <a href="/tools/no-vig-calculator">no-vig fair odds</a> — the actual probability of each outcome.</li>
<li><strong>Compares every available bet to the true price</strong> — When a retail book like DraftKings or FanDuel is offering better odds than the true price, the engine flags it as +EV.</li>
<li><strong>Calculates your edge</strong> — Each bet shows its <strong>EV%</strong>, which tells you exactly how much mathematical edge you have. A 5% EV bet means that for every $100 wagered, you expect to profit $5 on average.</li>
<li><strong>Surfaces the opportunity in your feed</strong> — All +EV bets appear in a clean, filterable feed sorted by edge, sport, sportsbook, and market type.</li>
</ol>

<p>The engine runs continuously. As lines shift throughout the day, new +EV opportunities appear and old ones disappear. Speed matters — which is why SharpMoney is built to be one of the <strong>fastest +EV engines in the industry</strong>.</p>

<h2>No-Vig Fair Odds: The True Price</h2>

<p>We've mentioned "stripping the vig" a few times. Let's break down exactly what this means.</p>

<p>Every sportsbook line has <strong>vig</strong> (juice) built in — it's the sportsbook's commission. A standard -110 / -110 line implies each side has a 52.4% chance, which totals 104.8%. That extra 4.8% is the vig.</p>

<p>To find the <strong>true probability</strong>, you need to remove the vig from both sides of the line. This is called <strong>devigging</strong>. After devigging, the probabilities add up to exactly 100% — giving you the market's actual assessment of each outcome.</p>

<p>SharpMoney does this automatically using sharp book lines. But if you ever want to do it manually, you can use our <a href="/tools/no-vig-calculator">free No-Vig Calculator</a> — plug in both sides of a sportsbook's line and it strips the vig for you using industry-standard methods (multiplicative, additive, Shin, and power).</p>

<p>Understanding no-vig odds is essential because it's the foundation of how we determine whether a bet has positive expected value. If the no-vig fair odds say a team has a 42% chance of winning, and a sportsbook is paying you as if they only have a 38% chance — that 4% gap is your edge.</p>

<h2>EV% — Your Edge on Every Bet</h2>

<p>Every bet in the SharpMoney feed shows its <strong>EV%</strong> (Expected Value percentage). This is the single most important number in the tool.</p>

<p>EV% tells you how much mathematical edge you have on a bet. Here's how to think about it:</p>

<ul>
<li><strong>3% EV</strong> — For every $100 bet, you expect to profit $3 on average</li>
<li><strong>5% EV</strong> — You expect $5 per $100</li>
<li><strong>10% EV</strong> — You expect $10 per $100 (these are rarer but very profitable)</li>
</ul>

<p>Higher EV% doesn't always mean a better bet, though. Context matters:</p>

<ul>
<li>A 3% EV bet backed by a high-limit Pinnacle line and confirming line movement is often <strong>more reliable</strong> than a 10% EV bet on a low-limit market where the line hasn't been tested</li>
<li>Some bettors set a minimum EV% filter (say 2% or 3%) to focus only on the strongest opportunities</li>
<li>Others cast a wide net with 1%+ to maximize volume</li>
</ul>

<p>The right approach depends on your bankroll, available time, and risk tolerance. But the math is clear: even a 2% edge, placed consistently across hundreds of bets, compounds into significant profit over time.</p>

<p>Want to calculate EV on your own? Use our <a href="/tools/ev-calculator">free EV Calculator</a>.</p>

<h2>Kelly Criterion: How Much to Bet</h2>

<p>Finding +EV bets is only half the equation. The other half is <strong>how much to bet</strong> on each one — and getting this wrong can blow up your bankroll even when the edge is real.</p>

<p>The <strong>Kelly Criterion</strong> is a mathematical formula that calculates the optimal bet size based on two things:</p>

<ol>
<li>Your <strong>edge</strong> (the EV%)</li>
<li>The <strong>odds</strong> you're getting</li>
</ol>

<p>The formula outputs the percentage of your bankroll you should risk on a given bet. Bigger edge and better odds = larger bet. Smaller edge = smaller bet.</p>

<p>SharpMoney calculates Kelly sizing for every bet in the feed automatically. You just enter your bankroll size and the tool tells you exactly how much to wager.</p>

<p>A few tips from experienced bettors:</p>

<ul>
<li><strong>Use fractional Kelly</strong> — Full Kelly can be aggressive. Most pros use half-Kelly or quarter-Kelly to reduce variance while still capturing the edge. This means you bet half (or a quarter) of what Kelly recommends.</li>
<li><strong>Never over-bet</strong> — Consistently risking too much on a single bet increases your risk of ruin. Even with a genuine edge, variance is real. Protect your bankroll.</li>
<li><strong>Stay consistent</strong> — Use Kelly sizing on every bet, not just the ones you "feel good" about. The whole point of +EV betting is removing emotion from the equation.</li>
</ul>

<p>Try it yourself with our <a href="/tools/kelly-calculator">free Kelly Criterion Calculator</a>.</p>

<h2>One-Click Bet Links & Speed</h2>

<p>In +EV betting, <strong>speed matters</strong>. Lines move fast — sometimes within minutes of the engine finding an edge. The longer you wait, the more likely the line corrects and the edge disappears.</p>

<p>SharpMoney includes <strong>one-click deep links</strong> on every bet. Click the link and you're taken directly to the sportsbook's bet slip with the bet pre-populated. No searching for the game, no navigating menus — just click and place.</p>

<p>This isn't a gimmick. On a busy day, you might place 20, 50, or even 100+ bets. Saving 30 seconds per bet adds up to hours of time saved — and more importantly, it means you're getting to the bet before the line moves.</p>

<h2>Filters: Dialing In Your Feed</h2>

<p>Not every +EV bet is relevant to you. Maybe you only have accounts at certain sportsbooks. Maybe you prefer higher EV% bets. Maybe you only bet on specific sports or markets.</p>

<p>SharpMoney has the <strong>most advanced filter system in the industry</strong>, letting you customize exactly what shows up in your feed:</p>

<ul>
<li><strong>EV% threshold</strong> — Only show bets above a certain edge (e.g., 3%+)</li>
<li><strong>Pinnacle limits</strong> — Filter by minimum Pinnacle limit to focus on well-tested lines</li>
<li><strong>Sportsbooks</strong> — Only show bets on books where you have an account</li>
<li><strong>Market types</strong> — Moneylines, spreads, totals, player props, alternate lines, and more</li>
<li><strong>Sports and leagues</strong> — NFL, NBA, MLB, NHL, soccer, tennis, and dozens more</li>
<li><strong>Per-book thresholds</strong> — Set different EV% minimums for different sportsbooks</li>
</ul>

<p>The more dialed in your filters, the more relevant your feed. Members who profit the most aren't using different tools — they're using the same tools more thoroughly.</p>

<h2>Closing Line Value (CLV): The Metric That Matters Most</h2>

<p>Here's a concept that most bettors never learn, but it's arguably the <strong>single most important metric</strong> in +EV betting: <strong>Closing Line Value (CLV)</strong>.</p>

<p>CLV measures whether you got better odds than the <strong>closing line</strong> — the final odds right before the game starts. The closing line is considered the most efficient price because it's been shaped by all available information and professional betting action.</p>

<p>Here's why CLV matters:</p>

<ul>
<li>If you consistently <strong>beat the closing line</strong> (got better odds than the close), you are mathematically a winning bettor — even if your short-term results are negative due to variance</li>
<li>If you consistently <strong>get worse odds than the close</strong>, you're likely losing money long-term — even if you're on a hot streak right now</li>
</ul>

<p>Example: You bet the Bears at +155 in the morning. By game time, the closing line is Bears +140. You beat the close by 15 cents — that's positive CLV. Over time, this is the strongest indicator that your betting process is sound.</p>

<p>This is why experienced +EV bettors don't obsess over daily wins and losses. They track their CLV. If you're consistently beating the closing line, the profits <em>will</em> come — it's just math.</p>

<h2>A Day in the Life of a SharpMoney Member</h2>

<p>Wondering what the daily workflow actually looks like? Here's a typical day for a SharpMoney Pro member:</p>

<h3>Morning</h3>
<ul>
<li>Open SharpMoney. The +EV feed is already populated with mispriced bets across 20+ sportsbooks.</li>
<li>Filter by EV% (say 3%+), your preferred sportsbooks, and market types.</li>
<li>Check line movement charts — see which bets have lines moving in your direction (confirmation) or against (caution).</li>
<li>Kelly Criterion tells you exactly how much to bet on each play.</li>
</ul>

<h3>Throughout the Day</h3>
<ul>
<li>New +EV opportunities surface as lines shift. The engine catches them in real time.</li>
<li>One-click deep links take you straight into the bet slip. No searching, no delays.</li>
<li>Place 10, 20, 50+ bets depending on your bankroll and the day's volume.</li>
</ul>

<h3>End of Day</h3>
<ul>
<li>Review what you placed. Track your bets in a tracker like Pikkit to monitor P&L and CLV.</li>
<li>Over time, the math compounds. A 2–5% ROI across hundreds of bets per month adds up fast.</li>
</ul>

<p>That's it. No gut feelings. No watching games hoping for a cover. Just a system. Show up, follow the math, place the bets, and let volume do the work.</p>

<h2>Common Mistakes New Members Make</h2>

<p>Before you dive in, here are the three most common mistakes — and how to avoid them:</p>

<h3>Mistake #1: Only Betting on Sports You "Know"</h3>
<p>+EV betting isn't about knowing the sport. It's about knowing the price is wrong. Some of the most profitable members bet on leagues they've never watched — Korean baseball, Finnish hockey, you name it. The math doesn't care about your sports knowledge. It just needs a mispriced line.</p>

<h3>Mistake #2: Betting Too Big, Too Fast</h3>
<p>Kelly Criterion exists for a reason. When you're starting out, consider using half-Kelly or quarter-Kelly to reduce variance while you build confidence. The edge is real — but variance is real too. Protect your bankroll first.</p>

<h3>Mistake #3: Skipping Bets Because "It Doesn't Feel Right"</h3>
<p>If the EV% is positive and Kelly says to bet, the math says to bet. Your gut feeling is not a better calculator than the engine. The whole point of +EV betting is removing emotion from the equation. Trust the process.</p>

<h2>SharpMoney Plans: Core, Pro & Alpha</h2>

<p>SharpMoney offers three tiers, each designed for different levels of experience and commitment:</p>

<h3>Core — $29.99/month</h3>
<p>Best for beginners who want to learn +EV betting with basic tools. You get core +EV tool access, a basic odds screen, basic filters, and community access. You <em>don't</em> get sharp book data, line movement charts, or advanced filters.</p>

<h3>Pro — $79.99/month (Most Popular)</h3>
<p>Best for bettors ready to use professional-grade data to find real value. Full +EV feed, live odds from 20+ books, 3 sharp books (Pinnacle, Circa, Bookmaker), 4 exchanges, line movement charts, Kelly Criterion sizing, one-click bet links, and advanced filters. This is the sweet spot — most profitable members are on Pro.</p>

<h3>Alpha — $199.99/month (Maximum Edge)</h3>
<p>Everything in Pro <em>plus</em> SharpMoney Signal — a proprietary system with a tracked 55.9% win rate and significant verified profit. Alpha members also get professional handicapped plays, signal strength ratings, and per-book custom thresholds. If you want every possible advantage, this is it.</p>

<p>Not sure which to pick? Start with Pro. It's where most members see the fastest ROI. If you find yourself wanting Signal plays, you can upgrade to Alpha anytime.</p>

<p><a href="/#pricing">View all plans and pricing →</a></p>

<h2>Getting Started: Your First Week Checklist</h2>

<p>Here's exactly what to do in your first week as a SharpMoney member:</p>

<ol>
<li><strong>Set your filters</strong> — Choose the sportsbooks you have accounts with, set your minimum EV% threshold, and select the leagues and market types you want to bet on.</li>
<li><strong>Start with the +EV feed</strong> — Review the bets, check line movement, and note the EV% and Kelly sizing on each.</li>
<li><strong>Place your first +EV bet</strong> — Find a bet with solid EV%, confirmed line movement, and a high Pinnacle limit. Use Kelly sizing. Click the deep link. Place it.</li>
<li><strong>Track everything</strong> — Log every bet in a tracker. Focus on CLV over win/loss rate.</li>
<li><strong>Build the habit</strong> — Check the feed 2–3 times a day. Volume matters. The more +EV bets you place, the faster the math converges.</li>
</ol>

<p>Don't overthink it. The system is designed to do the heavy lifting. You just need to show up and click.</p>

<h2>The Bottom Line</h2>

<p>SharpMoney isn't a magic formula. It's a professional-grade tool that gives you the same data and capabilities that sharp bettors have used to profit for years — packaged in a way that anyone can use.</p>

<p>The concepts behind it are straightforward: use the sharpest books in the world to determine true fair value, compare that to what retail books are offering, and bet when the price is in your favor. Size your bets with Kelly Criterion, track your CLV, and let volume smooth out the variance.</p>

<p>The math works. The tools are built. All that's left is showing up and trusting the process.</p>

<p><strong>Ready to start?</strong> <a href="/#pricing">Choose your plan</a> and place your first +EV bet today.</p>
`,
  },
  {
    slug: "sharpmoney-filter-settings-guide",
    title: "SharpMoney Filter Settings Guide",
    headline:
      "SharpMoney Filter Settings Guide: How to Set Up Your +EV Filters by Sport",
    description:
      "Learn how to configure your SharpMoney +EV filter settings for maximum efficiency. Sport-by-sport breakdown of EV thresholds, Pinnacle limits, odds ranges, market types, and bankroll settings.",
    metaTitle:
      "SharpMoney Filter Settings Guide — +EV Filters by Sport (2026)",
    metaDescription:
      "Complete guide to setting up SharpMoney +EV filter settings. Learn the optimal EV%, Pinnacle limit, and odds range settings for NBA, NFL, college basketball, soccer, tennis, NHL, and more.",
    keywords: [
      "sharpmoney filter settings",
      "sharpmoney filters",
      "+ev filter settings",
      "plus ev filter settings",
      "how to set up sharpmoney",
      "sharpmoney settings guide",
      "pinnacle limits filter",
      "ev percentage filter",
      "sports betting filter settings",
      "+ev tool settings",
      "sharpmoney nba settings",
      "sharpmoney college basketball settings",
      "sharpmoney soccer settings",
      "sharpmoney tennis settings",
      "sharpmoney nhl settings",
      "plus ev betting filters",
      "kelly criterion bet sizing",
      "bankroll management sharpmoney",
      "quarter kelly betting",
      "sharpmoney per book settings",
      "advanced ev filters",
      "how to filter ev bets",
      "best ev filter settings",
      "sharpmoney tutorial",
      "sharpmoney walkthrough",
    ],
    publishedAt: "2026-03-14",
    updatedAt: "2026-03-14",
    readTime: "15 min read",
    category: "strategy",
    categoryLabel: "Strategy & Settings",
    relatedTools: [
      { name: "EV Calculator", slug: "ev-calculator" },
      { name: "Kelly Calculator", slug: "kelly-calculator" },
      { name: "No-Vig Calculator", slug: "no-vig-calculator" },
    ],
    content: `
<p>SharpMoney gives you the most customizable +EV filter settings in the industry. But here's the thing — <strong>if your filters aren't dialed in properly, you're either scanning bad plays or missing the ones that actually matter.</strong></p>

<p>This guide walks you through exactly how to set up your filters sport by sport, including EV thresholds, Pinnacle limit minimums, odds ranges, market types, and bankroll settings. These are the same settings that have helped generate over $75,000 in tracked +EV profit.</p>

<p>Use these as a <strong>baseline</strong> — then adjust based on your own experience, risk tolerance, and account limitations.</p>

<h2>Watch the Full Video Walkthrough</h2>

<p>Prefer to watch? Here's the full filter settings tutorial:</p>

<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%;margin-bottom:2rem;">
<iframe style="position:absolute;top:0;left:0;width:100%;height:100%;" src="https://www.youtube.com/embed/OXzKX-cFTFs" title="SharpMoney Filter Settings Tutorial" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

<h2>Why Filter Settings Matter</h2>

<p>When you first open SharpMoney, you might see 60, 70, or even 80+ plays on the board. That's overwhelming — and not all of them are worth your time or money.</p>

<p>The goal of your filter settings is to <strong>narrow the board down to only the plays worth looking at</strong>. By the time you're done configuring, you should have maybe 30–40 plays — and out of those, you'll actually place maybe 10–15 after reviewing line movement.</p>

<p>Good filter settings don't just save you time. They save you money by keeping you off low-confidence plays that look like value but aren't.</p>

<h2>The Three Core Filters</h2>

<p>Every sport uses the same three core filter settings. Understanding what each one does is essential before we get into sport-specific configurations:</p>

<h3>1. Odds Range</h3>

<p>This controls the range of odds you're willing to bet on. The recommendation is <strong>+150 to -200</strong> across most sports.</p>

<p>Why cap it at +150? Because anything above +150 implies roughly a 40% win probability or less. While there <em>is</em> value in those ranges, the variance is significantly higher — you'll experience longer losing streaks. If you're comfortable with that, you can extend to +200. But for a smoother ride, +150 is the sweet spot.</p>

<h3>2. Minimum EV%</h3>

<p>This is the minimum expected value percentage a bet needs to show up in your feed. The right threshold depends entirely on the <strong>market type</strong>:</p>

<ul>
<li><strong>Main markets</strong> (spreads, moneylines, totals) → Keep it low (0.5%). These are efficient markets — you won't find 5% or 10% EV plays sitting around on main lines. If you set your EV% filter too high, you'll miss the best main market plays.</li>
<li><strong>Player props</strong> → Higher thresholds (3–5%). Props are less liquid and less efficient, so you need a bigger buffer to trust the edge.</li>
<li><strong>Less liquid sports</strong> (soccer corners, NHL props) → Even higher (2–5%). Less liquidity means less certainty in the true price.</li>
</ul>

<p>The key insight: <strong>a low EV% in an efficient main market is often more trustworthy than a high EV% in a thin prop market.</strong></p>

<h3>3. Minimum Pinnacle Limit (Most Important)</h3>

<p>This is <strong>by far the most important filter setting</strong>. If you only take one thing from this guide, let it be this.</p>

<p><a href="/guides/beginners-guide-to-sharpmoney">Pinnacle</a> is one of the sharpest sportsbooks in the world — they accept large bets from professional bettors and don't limit winners. Their limits are <em>dynamic</em>: they start low when a line opens and increase as more money flows in and the line becomes more efficient.</p>

<p>Here's the logic:</p>

<ul>
<li><strong>$1,000 Pinnacle limit</strong> → The line is still new, hasn't been tested by much professional money, and can be easily manipulated</li>
<li><strong>$3,000+ Pinnacle limit</strong> → Significant professional action has shaped this line — you can trust it as a reliable benchmark for fair value</li>
<li><strong>$10,000–$50,000+ Pinnacle limit</strong> → Extremely efficient market (NFL spreads, for example) — beating the closing line here is a very strong indicator of long-term profit</li>
</ul>

<p>Setting a higher minimum Pinnacle limit means you'll see fewer plays, but the plays you <em>do</em> see are backed by stronger, more reliable market data. It's the difference between betting into a line that's been tested by $500 worth of action vs. $50,000.</p>

<h2>Sport-by-Sport Filter Settings</h2>

<p>Now let's break it down for each sport. These are the baseline settings — adjust based on your own experience.</p>

<h3>NBA — Main Lines</h3>

<table>
<thead><tr><th>Setting</th><th>Value</th></tr></thead>
<tbody>
<tr><td><strong>Markets</strong></td><td>Point spreads, moneylines, total points</td></tr>
<tr><td><strong>Periods</strong></td><td>Full game, 1st half, 1st quarter only</td></tr>
<tr><td><strong>Odds Range</strong></td><td>+150 to -200</td></tr>
<tr><td><strong>Minimum EV%</strong></td><td>0.5%</td></tr>
<tr><td><strong>Min Pinnacle Limit</strong></td><td>$3,000</td></tr>
<tr><td><strong>Show Without Limits</strong></td><td>Yes (allows Circa/Bookmaker devig)</td></tr>
<tr><td><strong>Date Range</strong></td><td>Today only</td></tr>
</tbody>
</table>

<p><strong>Why $3,000 Pinnacle limits?</strong> Markets can be easily manipulated overnight and in early morning when limits are low. The $3,000 threshold typically kicks in around 8–9 AM for totals. Any line movement after that threshold is much more trustworthy.</p>

<p><strong>Why show without limits?</strong> Circa and Bookmaker are also very sharp in the NBA. Toggling this on allows you to see plays devigged against Circa and Bookmaker lines even when Pinnacle limits aren't available yet.</p>

<h3>NBA — Player Props</h3>

<table>
<thead><tr><th>Setting</th><th>Value</th></tr></thead>
<tbody>
<tr><td><strong>Markets</strong></td><td>Points, rebounds, assists, combos (PRA, PR, PA, RA), three-pointers</td></tr>
<tr><td><strong>Odds Range</strong></td><td>+150 to -200</td></tr>
<tr><td><strong>Minimum EV%</strong></td><td>3%</td></tr>
<tr><td><strong>Min Pinnacle Limit</strong></td><td>$500</td></tr>
<tr><td><strong>Show Without Limits</strong></td><td>Yes</td></tr>
<tr><td><strong>Date Range</strong></td><td>Today only</td></tr>
</tbody>
</table>

<p><strong>Why 3% EV for props?</strong> The props market is less liquid than main markets. It's harder to determine and trust the true EV, so you need a bigger buffer. Only showing 3%+ ensures you're looking at plays with a real edge, not noise.</p>

<p><strong>Why $500 Pinnacle limits?</strong> Pinnacle opens most player props at $250 minimum limits, then bumps to $500 a couple hours before game time (usually around when injury reports come out). $500 ensures you're getting the sharper lines. If you want to be more aggressive, you can go $250 — but there's more market manipulation at that level.</p>

<p><strong>Note on limited accounts:</strong> If your sportsbook accounts are limited, consider narrowing props to just points (the most liquid prop market). Steals, blocks, turnovers, and double-doubles are left off because most books won't let you bet meaningful amounts on those.</p>

<h3>College Basketball — Main Lines</h3>

<table>
<thead><tr><th>Setting</th><th>Value</th></tr></thead>
<tbody>
<tr><td><strong>Markets</strong></td><td>Point spreads, moneylines, total points</td></tr>
<tr><td><strong>Periods</strong></td><td>Full game, 1st half</td></tr>
<tr><td><strong>Odds Range</strong></td><td>+150 to -200</td></tr>
<tr><td><strong>Minimum EV%</strong></td><td>0.5%</td></tr>
<tr><td><strong>Min Pinnacle Limit</strong></td><td>$2,000</td></tr>
<tr><td><strong>Show Without Limits</strong></td><td>Yes</td></tr>
<tr><td><strong>Date Range</strong></td><td>Today only</td></tr>
</tbody>
</table>

<p><strong>Why $2,000?</strong> This keeps you off smaller school action where lines are less trustworthy. Small schools might only close at $500–$1,000 Pinnacle limits, which means beating the closing line there is less meaningful. $2,000 focuses you on bigger schools with more liquid, efficient markets. You could even go $3,000 for a more conservative approach.</p>

<p><strong>Important note on college sports:</strong> For college basketball (and college sports in general), <strong>Circa is often sharper than Pinnacle</strong>. Circa is a US-based book and typically takes higher limits on American college sports, while Pinnacle is international (based in Canada) and doesn't get as much college action. That's why showing plays without Pinnacle limits (devigged to Circa/Bookmaker) is especially valuable for college markets.</p>

<h3>Soccer</h3>

<table>
<thead><tr><th>Setting</th><th>Value</th></tr></thead>
<tbody>
<tr><td><strong>Markets</strong></td><td>All main leagues</td></tr>
<tr><td><strong>Odds Range</strong></td><td>+150 to -200</td></tr>
<tr><td><strong>Minimum EV%</strong></td><td>2%</td></tr>
<tr><td><strong>Min Pinnacle Limit</strong></td><td>$100</td></tr>
<tr><td><strong>Show Without Limits</strong></td><td>No (Pinnacle only)</td></tr>
<tr><td><strong>Date Range</strong></td><td>Next 7 days</td></tr>
</tbody>
</table>

<p><strong>Why 2% EV?</strong> Soccer markets are less liquid than NBA or NFL, so you want a higher EV buffer to account for less certainty in the true price.</p>

<p><strong>Why only $100 Pinnacle limits?</strong> This is set low intentionally because soccer corners and other niche markets are actually very sharp even at low limits. You don't want to filter those out.</p>

<p><strong>Why Pinnacle only (no Circa/Bookmaker)?</strong> Pinnacle is the international sharp book — for soccer, they are significantly sharper than US-based books like Circa and Bookmaker. You want to anchor all your soccer plays to Pinnacle's pricing.</p>

<p><strong>Why 7 days?</strong> Soccer isn't played daily. Games often happen weekly, so extending the date range lets you catch lines early when there's often the most value.</p>

<h3>Tennis</h3>

<table>
<thead><tr><th>Setting</th><th>Value</th></tr></thead>
<tbody>
<tr><td><strong>Markets</strong></td><td>Full game spreads and totals (ATP, WTA)</td></tr>
<tr><td><strong>Odds Range</strong></td><td>+150 to -200</td></tr>
<tr><td><strong>Minimum EV%</strong></td><td>0.5%</td></tr>
<tr><td><strong>Min Pinnacle Limit</strong></td><td>$1,000</td></tr>
<tr><td><strong>Show Without Limits</strong></td><td>No (Pinnacle only)</td></tr>
<tr><td><strong>Date Range</strong></td><td>Today only</td></tr>
</tbody>
</table>

<p><strong>Why 0.5% EV?</strong> Tennis is all main markets — efficient lines where low EV% plays are often the most trustworthy.</p>

<p><strong>Why Pinnacle only?</strong> Same logic as soccer — Pinnacle is the sharpest international book for tennis. Their lines are the most reliable benchmark.</p>

<h3>NHL — Main Lines</h3>

<table>
<thead><tr><th>Setting</th><th>Value</th></tr></thead>
<tbody>
<tr><td><strong>Markets</strong></td><td>Full game puck lines, totals, moneylines</td></tr>
<tr><td><strong>Odds Range</strong></td><td>+150 to -200</td></tr>
<tr><td><strong>Minimum EV%</strong></td><td>0.5%</td></tr>
<tr><td><strong>Min Pinnacle Limit</strong></td><td>$1,000</td></tr>
<tr><td><strong>Show Without Limits</strong></td><td>Yes</td></tr>
<tr><td><strong>Date Range</strong></td><td>Today only</td></tr>
</tbody>
</table>

<p><strong>Why $1,000?</strong> NHL doesn't get as high in limits as NBA or NFL. Puck lines often close around $5,000–$10,000 max. $1,000 gets you a semi-efficient market without filtering out too many plays.</p>

<h3>NHL — Player Props</h3>

<table>
<thead><tr><th>Setting</th><th>Value</th></tr></thead>
<tbody>
<tr><td><strong>Markets</strong></td><td>Points, assists, goals, saves, shots on goal</td></tr>
<tr><td><strong>Odds Range</strong></td><td>+150 to -200</td></tr>
<tr><td><strong>Minimum EV%</strong></td><td>5%</td></tr>
<tr><td><strong>Min Pinnacle Limit</strong></td><td>$500</td></tr>
<tr><td><strong>Show Without Limits</strong></td><td>Yes</td></tr>
<tr><td><strong>Date Range</strong></td><td>Today only</td></tr>
</tbody>
</table>

<p><strong>Why 5% EV?</strong> Hockey is even more random than basketball on an individual player level. It's harder to predict one goal than 18+ points. The higher EV threshold gives you a bigger buffer on these thin, less liquid markets.</p>

<h3>UFC / MMA</h3>

<table>
<thead><tr><th>Setting</th><th>Value</th></tr></thead>
<tbody>
<tr><td><strong>Odds Range</strong></td><td>+150 to -200</td></tr>
<tr><td><strong>Minimum EV%</strong></td><td>0.5%</td></tr>
<tr><td><strong>Min Pinnacle Limit</strong></td><td>$1,000</td></tr>
<tr><td><strong>Show Without Limits</strong></td><td>Yes</td></tr>
<tr><td><strong>Date Range</strong></td><td>Next 7 days</td></tr>
</tbody>
</table>

<p>UFC events happen weekly, so extending to 7 days lets you catch early lines. Including Circa and Bookmaker expands your play options for fight cards.</p>

<h2>Quick Filters: Toggling Between Views</h2>

<p>Once all your sport-specific settings are dialed in, you can use the <strong>quick filter toggles</strong> at the top to quickly switch between views:</p>

<ul>
<li>Show only <strong>main lines</strong> (hide player props)</li>
<li>Show only <strong>player props</strong> (hide main lines)</li>
<li>Show/hide <strong>first half and first quarter</strong> markets</li>
</ul>

<p>This is useful throughout the day. In the morning, you might focus on main lines. Closer to game time when prop limits increase, switch to props. The quick toggles let you flip between these views instantly without changing your underlying sport-by-sport settings.</p>

<h2>Bankroll & Bet Sizing Settings</h2>

<p>Once your +EV filters are set, the next step is configuring your <strong>bankroll management settings</strong>. This tells SharpMoney exactly how much to bet on each play.</p>

<h3>Setting Your Bankroll</h3>

<p>Enter your total bankroll — the amount of money you have spread across your sportsbooks dedicated to +EV betting. For example, $25,000.</p>

<p><strong>Tip:</strong> Switch the display to <strong>dollars instead of units</strong>. It makes the math 100 times easier — the tool will tell you the exact dollar amount to bet on each play instead of making you convert units in your head.</p>

<h3>Bet Sizing Method</h3>

<p>You have two main options:</p>

<h4>Option 1: Flat Betting (1 Unit to Win)</h4>

<p>Set the display to "win" and flat bet one unit per play. With a $25,000 bankroll, one unit is $250 (1% of bankroll). The tool calculates how much you need to <em>risk</em> to win that $250 based on the odds.</p>

<p>For example, on a -105 play, you'd need to bet $263 to win your $250 unit.</p>

<h4>Option 2: Quarter Kelly (Recommended)</h4>

<p>The <a href="/tools/kelly-calculator">Kelly Criterion</a> sizes your bets based on your edge and win probability. Bigger edge = bigger bet. Higher win probability = bigger bet.</p>

<p>Key recommendations:</p>

<ul>
<li><strong>Quarter Kelly</strong> is the recommended staking method for most bettors — it maximizes upswings while minimizing downswings</li>
<li><strong>Half Kelly</strong> is slightly more aggressive but still reasonable</li>
<li><strong>Full Kelly</strong> is way too aggressive for sports betting — the markets are volatile and your true edge is hard to know precisely</li>
<li>Set it to <strong>"risk"</strong> the quarter Kelly amount (not "win") — the Kelly formula determines your risk amount</li>
</ul>

<p>Example of how Kelly adjusts: if you have two plays both at 3% EV, but one is -200 (66% win probability) and the other is +200 (33% win probability), Kelly will tell you to bet significantly more on the -200 play because the higher win probability means less variance.</p>

<h2>Advanced Per-Book Settings (Alpha)</h2>

<p>If you're on the Alpha plan, you get access to <strong>per-book filter settings</strong> — the ability to set completely different filters for each individual sportsbook.</p>

<p>Why would you want this? Because your strategy on FanDuel might be very different than your strategy on BetMGM:</p>

<ul>
<li>On <strong>FanDuel</strong>, you might still be able to bet first quarter moneylines and get a couple hundred dollars down</li>
<li>On <strong>BetMGM</strong>, trying to bet a first quarter moneyline might only let you get down $0.65 due to account limits</li>
</ul>

<p>With per-book settings, you can turn off first quarter markets for BetMGM while keeping them on for FanDuel. You can set different EV% thresholds, different Pinnacle limit minimums, and different market types for every single book.</p>

<p>It takes time to set up — potentially hours if you really want to dial it in — but the result is a feed that's perfectly optimized for <em>your</em> specific accounts and limitations.</p>

<h2>The Filtering Mindset</h2>

<p>Here's the big takeaway: <strong>your EV% alone should not determine whether you place a bet.</strong></p>

<p>The filter settings get the board down to plays worth <em>looking at</em>. From there, you make your final decision by <a href="/guides/beginners-guide-to-sharpmoney">reading the line movement chart</a>. A 2% EV play with strong confirming line movement and high Pinnacle limits is a better bet than a 7% EV play with no line movement support on a thin market.</p>

<p>Use these filter settings as your starting point. Over time, you'll learn what works best for your bankroll, your accounts, and your style. The key is to start with a solid baseline and iterate from there.</p>

<p><strong>Ready to get started?</strong> <a href="/#pricing">Choose your plan</a> and start dialing in your filter settings today.</p>
`,
  },
];

// Helper to get an article by slug
export function getArticleBySlug(slug: string): GuideArticle | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
