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

<p>For those who want the full picture — real-time +EV feeds, sharp book data, line movement charts, and Kelly Criterion bet sizing — that's what tools like <a href="https://whop.com/c/pro-7e/websitepro">SharpMoney Pro</a> are built for.</p>

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

<p><a href="/#pricing?utm_source=website&utm_medium=guide&utm_campaign=beginners-guide">View all plans and pricing →</a></p>

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

<p><strong>Ready to start?</strong> <a href="/#pricing?utm_source=website&utm_medium=guide&utm_campaign=beginners-guide">Choose your plan</a> and place your first +EV bet today.</p>
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

<p><strong>Ready to get started?</strong> <a href="/#pricing?utm_source=website&utm_medium=guide&utm_campaign=filter-settings">Choose your plan</a> and start dialing in your filter settings today.</p>
`,
  },
  {
    slug: "i-quit-my-9-to-5-for-sports-betting",
    title: "I Quit My 9-to-5 to Bet on Sports Full-Time",
    headline:
      "I Quit My 9-to-5 Job to Bet on Sports Full-Time — Here's How I Got Here",
    description:
      "How Robbie Peterson went from a $2,000 bankroll and a full-time job to making $80,000+ sports betting and building SharpMoney into a full-time career. The real story behind the leap.",
    metaTitle:
      "I Quit My 9-to-5 for Sports Betting — How I Built SharpMoney Full-Time (2026)",
    metaDescription:
      "The real story of how Robbie Peterson quit his 9-to-5 job to pursue +EV sports betting and build SharpMoney full-time. From a $2,000 bankroll to $80,000+ in profit and a growing sports betting company.",
    keywords: [
      "quit job for sports betting",
      "full time sports betting",
      "can you make a living sports betting",
      "professional sports bettor",
      "quit 9 to 5 sports betting",
      "sports betting full time income",
      "how to become a professional sports bettor",
      "sports betting as a career",
      "sharpmoney story",
      "sharpmoney founder",
      "+ev betting career",
      "make money sports betting",
      "sports betting income",
      "quit my job to gamble",
      "professional gambler story",
      "sports betting success story",
      "how much can you make sports betting",
      "is sports betting profitable",
      "sharpmoney review",
      "ev betting results",
    ],
    publishedAt: "2026-03-14",
    updatedAt: "2026-03-14",
    readTime: "10 min read",
    category: "beginner",
    categoryLabel: "Behind the Scenes",
    relatedTools: [
      { name: "EV Calculator", slug: "ev-calculator" },
      { name: "Kelly Calculator", slug: "kelly-calculator" },
      { name: "Bankroll Simulator", slug: "bankroll-simulator" },
    ],
    content: `
<p>This is kind of a surreal moment. I just left my 9-to-5 job to continue my path as a professional sports bettor and as the business owner of SharpMoney.</p>

<p>When I started SharpMoney with Jay, Jeff, and Adam, this was the goal I set — to become a full-time employee of my own company. And it's surreal to be here now after putting in my two weeks' notice.</p>

<p>This article is a reflection on the last couple years — how I got here, what this means for SharpMoney, and where we're going next.</p>

<h2>Watch the Full Video</h2>

<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%;margin-bottom:2rem;">
<iframe style="position:absolute;top:0;left:0;width:100%;height:100%;" src="https://www.youtube.com/embed/xNbs-1ZxV4o" title="I Quit My 9-to-5 for Sports Betting" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

<h2>From a \$2,000 Bankroll to \$80,000+ in Profit</h2>

<p>Over the last few years, I've made over <strong>\$80,000</strong> personally just betting on sports.</p>

<p>I started with a <strong>\$2,000 bankroll</strong> and absolutely grinded. I had a full-time job. When I first started betting, I had one kid — now I have two. So I went through the process of having a second child while juggling a full-time job and trying to make a reasonable income just from sports betting.</p>

<p>I never got into arbitrage betting. I was always pregame <a href="/guides/what-is-ev-betting">+EV betting</a> — small edges, lots of volume. My long-term ROI is about 2.5%. That might not sound like much, but across thousands of bets and a growing bankroll, it compounds fast.</p>

<p>After about a year of betting, I realized I was pretty good at it. I became obsessed with the process. I love math. I love sports. Love money. And it all clicked together.</p>

<h2>How SharpMoney Started</h2>

<p>The business idea came from using other +EV tools and noticing gaps — things I wanted to set up differently, information I wanted presented in a better way.</p>

<p>The beginning of SharpMoney was very simple. I teamed up with <strong>Jay (Jay's Plays)</strong> and <strong>Jeff (MathWins)</strong>. The three of us each had a decent following and free Discords, so we combined them and created SharpMoney.</p>

<p>We first hosted <strong>Discord bots</strong> — very simple, but very profitable and kind of the first of their kind. We were tracking historical Pinnacle limits along with Pinnacle odds and using that information together. Even our most simple bots in the beginning still represent our core values today.</p>

<p>We were together for close to a year — just the three of us — and then we met <strong>Adam (Sigma Squirrel)</strong>.</p>

<h2>The Team That Built It</h2>

<p>Each person on the team brings something completely different:</p>

<h3>Jay — Community & Growth</h3>
<p>Jay brought in a large community — many of the original SharpMoney members came from his following. He gave us that base. Now he works as our head of sales, managing affiliates and helping us grow, while also running all the Discord operations — bugs, new projects, and keeping things stable through our transition from Discord bots to full software.</p>

<h3>Jeff (MathWins) — The Math Genius</h3>
<p>Jeff brings something most +EV companies don't have: the ability to <strong>handicap plays profitably</strong>. He's a math teacher and a serious talent when it comes to NBA player props and mathematical modeling. He brought a whole new element to the business — bottom-up analysis alongside our top-down +EV approach.</p>

<p>Me and Jeff have been up grinding his models at 5 AM until 7 when our kids wake up, for months at a time, trying to win on the exchanges. We're similar in a lot of ways and opposites in others. I throw out about 10 ideas a week and he shoots down about nine of them — but when we find the one we both agree on, it's something good.</p>

<h3>Adam (Sigma Squirrel) — The Game Changer</h3>
<p>Bringing in Adam was the best decision SharpMoney has ever made. He already owned a software company and was a true businessman. He turned SharpMoney from a disorganized group of guys making a few bucks on the side into a <strong>full-grown business with serious structure and growth strategy</strong>.</p>

<p>On top of that — and we didn't know we were going to get this — he became our lead software developer. He runs all the projects, builds everything, and codes everything himself. The entire software is built in-house, by the people who actually use it.</p>

<p>He even taught me and Jeff about modeling and bottom-up betting. Jeff became an extremely successful NBA modeler by picking Adam's brain. I've done running back projections that absolutely crushed — with the help of Adam and Jeff.</p>

<h2>From Discord Bots to Full Software</h2>

<p>We've grown from a Discord with bots to a <strong>fully operational sports betting software company</strong>:</p>

<ul>
<li>Started with simple Discord bots tracking Pinnacle data</li>
<li>Grew to <strong>30+ sportsbooks</strong> including Circa, Pinnacle, and Bookmaker odds and limits</li>
<li>Built a full web app and mobile app — every feature available on both</li>
<li>Created <strong>SharpMoney Signal</strong> — a proprietary system beating the market at over 5% ROI across tens of thousands of bets</li>
<li>Developed the most advanced <a href="/guides/sharpmoney-filter-settings-guide">filter settings</a> in the industry</li>
</ul>

<p>And we did all of this while every single one of us had full-time jobs and families. The amount we accomplished as part-time workers is something I'm incredibly proud of.</p>

<h2>Why I Made the Leap</h2>

<p>We'd reached the point where the company was <strong>asking more from us than what we were giving it</strong>. We could all see the potential, and the team made the investment in getting me on full-time to really scale things.</p>

<p>The risk? Honestly, I don't think it's that high. The downside versus the upside made this kind of a no-brainer:</p>

<ul>
<li>I could fall back on my previous career any day of the week — I have licenses in water treatment that make me a good job prospect</li>
<li>Yes, I gave up a pension, great vacation benefits, and healthcare</li>
<li>But that field is always going to be there</li>
<li>The upside of going full-time with SharpMoney far outweighs what I'm leaving behind</li>
</ul>

<p>My previous job as a water treatment operator was great — hands-on, social, math-oriented. The biggest challenge switching to a desk job is the mental aspect of working alone. But breaking up the day with workouts and getting into a rhythm — I know I'll adjust.</p>

<h2>What Full-Time Means for SharpMoney</h2>

<p>Going full-time frees up <strong>40 hours a week</strong>. Think about that — everything we built happened <em>without</em> that time available. I can't even comprehend what we'll accomplish with it.</p>

<p>Here's what changes:</p>

<h3>More Educational Content</h3>
<p>YouTube videos, <a href="/guides">guides and articles</a>, live streams, tutorials — the content pipeline is going to scale significantly. Teaching members how to use the tools and make money is the foundation of everything we do.</p>

<h3>More Support</h3>
<p>I'll be in the Discord pretty much 24/7 answering questions. I'm also planning to open up one-on-one coaching calls via Zoom for members who want personalized help.</p>

<h3>More Product Development</h3>
<p>With the advancements in AI and our tech stack, I've been able to start developing products myself. I designed and built the entire Signal system — my first shot at it, and it's beating the market at over 5% ROI. That's just the beginning.</p>

<h3>Better Structure</h3>
<p>Me taking on the extra workload frees up the other three owners to focus on their own betting, their personal brands, and the areas where they're strongest. The whole operation becomes more efficient.</p>

<h2>The Mindset Behind the Grind</h2>

<p>Reaching this goal has been something I've been working toward since we started SharpMoney. And there's something I've been thinking about a lot:</p>

<p><strong>Reaching your goals can be scary — because then you have to set new ones.</strong></p>

<p>There's a quote that's stuck with me: <em>"Life isn't about the pursuit of happiness. It's the happiness in the pursuit."</em></p>

<p>The last couple years have been some of the happiest of my life — starting a family, starting the business, grinding toward this goal. The happiness was in the journey, not just the destination. Now that I've hit this milestone, the process resets: new goals, same grind, same enjoyment along the way.</p>

<p>If you're always chasing a goal and not happy until you get there, you'll live a miserable life. Be happy on the way there. The grind itself is the reward.</p>

<h2>What's Next</h2>

<p>This is just the beginning. We are going to build the most amazing products. We will be one of the most innovative companies in the space — always leading the next trend. We will find edges that no one else has.</p>

<p>SharpMoney will be <strong>the</strong> place to go for +EV betting.</p>

<p>Thank you to everyone who's been a part of this journey — the members, the community, and especially the families behind the scenes who made all of this possible.</p>

<p>Can't wait to see what happens next.</p>

<p><strong>Want to see what we've built?</strong> <a href="/#pricing?utm_source=website&utm_medium=guide&utm_campaign=quit-9-to-5">Check out SharpMoney</a> and start your +EV betting journey today.</p>
`,
  },
  {
    slug: "line-movement-charts-ev-betting-strategy",
    title: "How to Read Line Movement Charts for +EV Betting",
    headline:
      "How to Read Line Movement Charts: The Most Important Skill in +EV Sports Betting",
    description:
      "Learn how to read line movement charts, understand Pinnacle limits, and use market movement to find stronger +EV bets. The strategy that separates profitable bettors from everyone else.",
    metaTitle:
      "How to Read Line Movement Charts | +EV Betting Strategy Guide (2026)",
    metaDescription:
      "Master line movement charts for +EV sports betting. Learn Pinnacle limits, the X pattern (limits up + odds down), and when to bet vs. when to stay away. Advanced strategy guide.",
    keywords: [
      "line movement charts sports betting",
      "how to read line movement",
      "pinnacle limits explained",
      "line movement strategy",
      "+ev betting strategy",
      "sharp money line movement",
      "sports betting market movement",
      "closing line value strategy",
      "when to bet sports betting",
      "reading odds movement",
      "pinnacle odds movement",
      "sports betting line movement analysis",
      "advanced sports betting strategy",
      "line movement ev betting",
      "how to read sharp book odds",
      "clv sports betting",
      "sports betting chart analysis",
    ],
    publishedAt: "2026-03-18",
    updatedAt: "2026-03-18",
    readTime: "14 min read",
    category: "strategy",
    categoryLabel: "Advanced Strategy",
    relatedTools: [
      { name: "EV Calculator", slug: "ev-calculator" },
      { name: "No-Vig Calculator", slug: "no-vig-calculator" },
      { name: "Kelly Calculator", slug: "kelly-calculator" },
    ],
    content: `
<p>Here's something most +EV betting services won't tell you: <strong>EV% alone should not determine whether you place a bet.</strong></p>

<p>A 5% EV play with the market moving against you can be a terrible bet. A 0.5% EV play with strong line movement can be a slam dunk. The difference? Understanding how to read line movement charts.</p>

<p>This is the skill that separates professional bettors from everyone else. Once you learn it, you'll never look at a +EV feed the same way again.</p>

<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%;margin-bottom:2rem;">
<iframe style="position:absolute;top:0;left:0;width:100%;height:100%;" src="https://www.youtube.com/embed/INr5pMhezQc" title="How to Read Line Movement Charts for +EV Betting" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

<h2>Why Line Movement Matters More Than EV%</h2>

<p>When I first started +EV betting, I did what most people do — I looked at the EV percentage, checked the Kelly sizing, and placed the bet. Simple, right?</p>

<p>But I kept noticing something. Lines that opened at -110 would close at -200 over the course of a day. A massive 90-cent movement in one direction. Yet at no point during that move did a traditional +EV play show up, because the retail books were adjusting fast enough to stay close to fair value.</p>

<p>Here's what hit me: <strong>if I could have gotten in at -150 on that line and it closed at -200, I would have had incredible closing line value</strong> — even if the "EV%" at the time of my bet was only 0.5%.</p>

<p>That realization changed everything about how I bet. I stopped treating EV% as the gospel truth and started reading the market — the direction it's moving, the speed of the movement, and most importantly, <strong>the Pinnacle limits</strong>.</p>

<h2>What Are Pinnacle Limits and Why Do They Matter?</h2>

<p><a href="/guides/beginners-guide-to-sharpmoney">Pinnacle</a> is one of the sharpest sportsbooks in the world because they don't limit bettors. They'll take large wagers from anyone — professionals included. This makes their lines some of the most efficient in the market.</p>

<p>But Pinnacle doesn't just open up at full limits. They start low and gradually increase:</p>

<ul>
<li><strong>Early morning:</strong> A line might open with a $1,000 limit — Pinnacle isn't very confident yet</li>
<li><strong>Midday:</strong> Limits bump to $3,000–$5,000 as more information comes in</li>
<li><strong>Before game time:</strong> Limits can reach $10,000–$50,000+ depending on the sport — Pinnacle is very confident in the number</li>
</ul>

<p>The key insight: <strong>the higher the limit, the more confident the book is in their line.</strong> A $1,000 limit line is still being shaped. A $20,000 limit line has been tested by professional money and is extremely efficient.</p>

<p>This is why Pinnacle limits are tracked on SharpMoney's line movement charts — they tell you when to trust the market and when a line is still too early to act on.</p>

<h2>The Two Things to Watch on Every Chart</h2>

<p>Every SharpMoney line movement chart shows two critical pieces of information:</p>

<ol>
<li><strong>The odds line</strong> — showing how Pinnacle, Circa, and Bookmaker are pricing the bet over time</li>
<li><strong>The limits line</strong> — showing how much Pinnacle is willing to accept on that wager</li>
</ol>

<p>By watching how these two lines interact, you can determine whether a +EV play is worth taking — or whether you should run the other way.</p>

<h2>The X Pattern: Limits Up + Odds Down = Take the Bet</h2>

<p>This is the most important pattern in line movement analysis. When you see it, you bet aggressively.</p>

<p><strong>What it looks like:</strong></p>
<ul>
<li>Pinnacle limits increase (e.g., from $5,000 to $10,000)</li>
<li>At the same time, Pinnacle's odds drop sharply in the direction of your bet</li>
</ul>

<p><strong>What it means:</strong> Professional bettors were waiting for that higher limit before hammering the line. They wanted to get serious money down, and they pounced the moment Pinnacle raised the limit. Pinnacle saw the sharp action and adjusted their odds accordingly.</p>

<p><strong>Why it's valuable:</strong> If professional bettors are confident enough to bet $10,000+ at minus-110 and move the line to minus-120, then you know there's real value there. If you can grab that same side at minus-105 on a retail book like FanDuel, you're getting a better price than the pros got.</p>

<h3>Real Example: The Textbook Slam Dunk</h3>

<p>Pirates vs. Reds — Total Under 6.5 runs (alt line). Available on MGM at +185 odds. The EV calculation shows just 1.04% — most people would skip this bet.</p>

<p>But look at the chart:</p>

<ul>
<li>Pinnacle limits just increased from $7,500 to $10,000</li>
<li>During that increase, sharp bettors hammered the line from +184 down to +175 — a 9-cent move in favor of the under</li>
</ul>

<p>Professional bettors hit this at +184 — the worst price available — at a $10,000 limit. And we can get +185 on MGM? <strong>That's a play you take every single time.</strong></p>

<p>The EV calculator says 1%. The chart says slam dunk. Trust the chart.</p>

<h2>The Danger Pattern: Limits Up + Odds Up = Stay Away</h2>

<p>This is the pattern that saves you money. When you see it, don't bet — no matter what the EV% says.</p>

<p><strong>What it looks like:</strong></p>
<ul>
<li>Pinnacle limits increase</li>
<li>But the odds also go up (moving against the side you'd bet)</li>
</ul>

<p><strong>What it means:</strong> The sharp action is coming in on the other side. Pinnacle is giving you a better payout because nobody is betting your side — they're all betting the opposite.</p>

<h3>Real Example: The Play to Avoid</h3>

<p>Dodgers vs. Diamondbacks — First half total under 5.5 runs. Available at -103, flagged as a 1.74% EV play. Pinnacle is at -114. On paper, that looks great — we're getting -103 while the sharp book says -114.</p>

<p>But the chart tells a completely different story:</p>

<ul>
<li>Limits went from $1,600 to $2,500 (not very high to begin with)</li>
<li>During that increase, odds went UP — from -122 to -114</li>
</ul>

<p>Pinnacle is offering a <em>better</em> payout on the under with each limit increase. That means the sharp action is on the over. If this trend continues and the line moves toward -103, you'll have grabbed the worst possible number.</p>

<p><strong>Sometimes the best play is no play.</strong> By losing less, you will win more.</p>

<h2>Understanding Limit Decreases</h2>

<p>While limit increases are common and predictable, <strong>limit decreases</strong> are rare — and they're a red flag.</p>

<p>When Pinnacle lowers their limits, it means they've lost confidence in their line. This usually happens because of:</p>

<ul>
<li>An injury report — a key player goes from questionable to doubtful</li>
<li>Weather changes affecting the game</li>
<li>A surprise lineup change</li>
</ul>

<p>The book is essentially saying: "We don't know what's going on with this event, so we're not going to accept big wagers until we figure it out."</p>

<p><strong>My approach:</strong> I stay completely away from any market where limits are decreasing. It's going to be a volatile mess of people guessing about injuries and lineups. Let that chaos play out and focus your energy elsewhere.</p>

<h2>Why I Bet Low EV Plays (and You Should Too)</h2>

<p>Here's something that goes against conventional +EV wisdom: <strong>I often place larger wagers on 0.5% EV plays than on 5% EV plays.</strong></p>

<p>That sounds insane if you're only looking at the numbers. The Kelly Criterion formula would tell you the opposite. But Kelly assumes you know your exact edge — and in sports betting, you don't always.</p>

<p>What I <em>do</em> know is what the chart is telling me:</p>

<ul>
<li>If a 0.5% EV play has the X pattern (limits up, odds down, strong directional movement), I'm going a full unit</li>
<li>If a 5% EV play has odds moving against me, I'm either betting small or staying off entirely</li>
</ul>

<p>The reason this works: <strong>main markets are efficient.</strong> You're rarely going to find a 5% EV spread or money line just sitting on DraftKings. The value in main markets lives in the 0.5%–2% range. If you filter those out, you're missing the best plays available.</p>

<p>My long-term ROI? Over 3.5% — despite most of my individual bets being in the 1–2% EV range. The edge comes from reading the market, not from chasing big EV numbers.</p>

<h2>The Complete Decision Framework</h2>

<p>Here's exactly how to evaluate any +EV play using line movement:</p>

<h3>Step 1: Check the EV%</h3>
<p>Is it positive? Good — it's at least worth looking at. Don't bet based on this number alone.</p>

<h3>Step 2: Check Pinnacle Limits</h3>
<p>Are limits at a meaningful level for the sport? (At least $3,000 for NBA main markets, $2,000 for college basketball, $500 for player props). If limits are too low, the line hasn't been tested enough to trust.</p>

<h3>Step 3: Read the Chart</h3>
<p>This is where the real decision happens:</p>

<table>
<thead>
<tr><th>Pattern</th><th>Limits</th><th>Odds</th><th>Action</th></tr>
</thead>
<tbody>
<tr><td><strong>X Pattern</strong></td><td>Going up</td><td>Dropping (your direction)</td><td>Bet aggressively</td></tr>
<tr><td><strong>Danger Pattern</strong></td><td>Going up</td><td>Going up (against you)</td><td>Stay away</td></tr>
<tr><td><strong>Flat</strong></td><td>Stable</td><td>Not moving</td><td>Bet normally based on EV</td></tr>
<tr><td><strong>Limit Decrease</strong></td><td>Going down</td><td>Volatile</td><td>Stay away completely</td></tr>
</tbody>
</table>

<h3>Step 4: Size Your Bet</h3>
<p>Strong X pattern with high limits? Go full unit or more. Moderate movement? Stick with what <a href="/tools/kelly-calculator">Kelly</a> recommends. Flat chart with no movement? Bet smaller — you're less sure about the edge.</p>

<h2>Why Most Bettors Miss This</h2>

<p>Most +EV services show you a number and tell you to bet. They treat every 3% EV play the same, whether the market is confirming your bet or screaming at you to stay away.</p>

<p>The problem is clear: <strong>a lot of people lose money placing EV bets that aren't actually EV because the market is moving against them.</strong> By the time the game starts, their "3% edge" has evaporated because the line continued moving in the wrong direction.</p>

<p>SharpMoney is built differently. We show you Pinnacle limits, Circa odds, Bookmaker odds, and the market trend line — all in one chart. You have everything you need to make an informed decision, not just an EV percentage.</p>

<h2>Key Takeaways</h2>

<ul>
<li><strong>EV% is a starting point, not a verdict.</strong> Always check the line movement chart before placing a bet.</li>
<li><strong>Limits up + odds down = strong bet.</strong> This is the X pattern — it means sharp money is confirming your side.</li>
<li><strong>Limits up + odds up = stay away.</strong> The sharp action is on the other side.</li>
<li><strong>Limits going down = chaos.</strong> Don't bet into uncertainty — wait for the market to stabilize.</li>
<li><strong>Low EV + strong movement > High EV + no movement.</strong> A 0.5% EV play with confirming steam is often better than a 5% EV play with no chart support.</li>
<li><strong>Beating the closing line on liquid markets is how you build long-term profit.</strong> Get in early on the right side of the movement and ride it to CLV.</li>
</ul>

<p>Reading line movement is the single highest-leverage skill you can develop as a +EV bettor. It's the difference between blindly following numbers and actually understanding <em>why</em> a bet has value.</p>

<p><strong>Ready to see line movement charts in action?</strong> <a href="/#pricing?utm_source=website&utm_medium=guide&utm_campaign=line-movement-charts">Start with SharpMoney</a> and see Pinnacle limits, sharp book odds, and market trends on every play.</p>
`,
  },

  // =========================================================================
  // Article 6 — March Madness Betting Guide
  // =========================================================================
  {
    slug: "march-madness-betting-guide-sharpmoney",
    title: "How to Bet March Madness with SharpMoney",
    headline:
      "How to Bet March Madness Using SharpMoney: A +EV Approach to the NCAA Tournament",
    description:
      "Learn how to find +EV bets during March Madness using SharpMoney's tools — sharp book data, line movement charts, and advanced filters for NCAA Tournament basketball.",
    metaTitle:
      "How to Bet March Madness with SharpMoney | +EV NCAA Tournament Strategy (2026)",
    metaDescription:
      "Learn how to profit from March Madness betting using SharpMoney's +EV tools, sharp book data, and line movement charts. Complete NCAA Tournament betting guide for 2026.",
    keywords: [
      "march madness betting strategy",
      "how to bet march madness",
      "ncaa tournament betting",
      "march madness ev betting",
      "sharpmoney march madness",
      "ncaa basketball betting strategy",
      "march madness sharp money",
      "college basketball betting tips",
      "march madness plus ev",
      "+ev march madness",
      "march madness line movement",
      "ncaa tournament odds",
      "march madness 2026 betting",
      "how to bet college basketball",
      "march madness sharp bets",
      "ncaa tournament spread betting",
      "march madness totals betting",
      "profitable march madness betting",
      "college basketball ev betting",
      "march madness value bets",
    ],
    publishedAt: "2026-03-19",
    updatedAt: "2026-03-19",
    readTime: "10 min read",
    category: "strategy",
    categoryLabel: "Strategy Guide",
    relatedTools: [
      { name: "EV Calculator", slug: "ev-calculator" },
      { name: "Kelly Calculator", slug: "kelly-calculator" },
      { name: "Odds Converter", slug: "odds-converter" },
    ],
    content: `
<p>March Madness is the single biggest betting event of the year — and it's not even close. <strong>68 teams, 67 games in three weeks, with lines posted across 20+ sportsbooks.</strong> That kind of volume means one thing for +EV bettors: <em>opportunity everywhere.</em></p>

<p>But here's the catch. March Madness is also where recreational bettors lose the most. They chase upsets, bet parlays based on bracket vibes, and treat it like a lottery ticket. The sharps? They treat it like what it is — a massive, inefficient market where books are scrambling to price hundreds of college basketball games they don't normally cover.</p>

<p>This guide breaks down exactly how to use SharpMoney to find +EV plays throughout the NCAA Tournament — from the First Four all the way to the National Championship.</p>

<h2>Why March Madness Is a Goldmine for +EV Bettors</h2>

<p>During the regular NBA or NFL season, sportsbooks have months of data to sharpen their lines. They know the teams inside and out. The lines are tight. The edges are small.</p>

<p>March Madness is different:</p>

<ul>
<li><strong>Books are pricing 32+ games per day in the first round.</strong> That's an absurd number of lines to set perfectly. Mistakes happen — frequently.</li>
<li><strong>Public money floods in on name brands.</strong> Everyone bets Duke, Kentucky, and Kansas regardless of the line. That creates value on the other side.</li>
<li><strong>Matchup novelty.</strong> A 5-seed from the Big East playing a 12-seed from the WCC? Books don't have a deep history to lean on. The market is softer.</li>
<li><strong>Totals are wildly inefficient.</strong> Tempo differences between conferences create pricing errors that sharp books catch first.</li>
</ul>

<p>In short: <strong>more games + softer lines + public bias = more +EV opportunities.</strong> And SharpMoney is built to surface exactly those opportunities.</p>

<h2>Step 1: Set Up Your SharpMoney Filters for March Madness</h2>

<p>The first thing you want to do is configure your filters specifically for NCAA Tournament games. Here's the setup:</p>

<ul>
<li><strong>Sport:</strong> NCAAB (College Basketball)</li>
<li><strong>Market Types:</strong> Spread, Total, Moneyline — run all three. Totals tend to have the most value in college basketball.</li>
<li><strong>Minimum EV%:</strong> Start at 1%. During the first round, you'll find plenty of plays above 2-3% because of the volume and market inefficiency.</li>
<li><strong>Books:</strong> Make sure you have all your active sportsbooks selected. The more books you're comparing, the better your odds of finding mispriced lines.</li>
<li><strong>Sharp Books:</strong> If you're on Pro or Alpha, enable Pinnacle, Circa, and Bookmaker. These are the sharp books that move first — they're your true odds benchmark.</li>
</ul>

<p>During the first two rounds especially, refresh often. Lines are moving constantly as sharp money comes in, and the best +EV plays don't last long.</p>

<h2>Step 2: Read the Line Movement Charts</h2>

<p>This is where SharpMoney separates you from everyone else using a basic +EV tool. <strong>The line movement chart tells you whether the sharp money agrees with your bet.</strong></p>

<p>Here's what to look for during March Madness:</p>

<h3>The Confirmation Pattern (Green Light)</h3>
<p>You see a +EV play on a 12-seed spread. You pull up the line movement chart and see:</p>
<ul>
<li>The line is moving <em>toward</em> the 12-seed (spread getting tighter)</li>
<li>Pinnacle limits are going <em>up</em> (sharp books are confident)</li>
<li>Multiple sharp books have already moved</li>
</ul>
<p>This is the pattern you want. Sharp money is on the same side as your +EV play. <strong>The edge is real.</strong></p>

<h3>The Warning Pattern (Red Light)</h3>
<p>You see a +EV play on a 3-seed moneyline. But the chart shows:</p>
<ul>
<li>The line is moving <em>against</em> your side</li>
<li>Pinnacle limits are going <em>down</em> (sharp books aren't sure about this game)</li>
<li>The EV is coming from a single soft book that hasn't moved yet</li>
</ul>
<p>This is a trap. The "edge" will likely disappear by tipoff as that one book corrects their line. <strong>Pass on it.</strong></p>

<h3>The Tempo Mismatch (Total Plays)</h3>
<p>College basketball has massive tempo differences. A Big Ten team that plays 62 possessions per game facing a Big East team that plays 72 creates real pricing problems for books. When you see a total play with +EV and the line movement chart shows the total moving in your direction with increasing limits — <strong>that's one of the highest-value spots in the entire tournament.</strong></p>

<h2>Step 3: Bankroll Management During the Tournament</h2>

<p>March Madness can give you 15-20 +EV plays in a single day during the first round. That's exciting, but it's also where bettors blow up their bankroll by oversizing.</p>

<p><strong>Use the Kelly Criterion to size every bet.</strong> SharpMoney shows you the Kelly-optimal bet size right on the play card. During high-volume stretches like the first round:</p>

<ul>
<li><strong>Use fractional Kelly (quarter or half Kelly).</strong> With this many simultaneous bets, you need to account for variance. Going full Kelly on 15 plays at once is a recipe for a bad day.</li>
<li><strong>Set a daily max.</strong> Even if you find 20 +EV plays, don't risk more than 10-15% of your total bankroll in a single day.</li>
<li><strong>Don't chase.</strong> If you go 2-8 on the first slate, the math doesn't change. The next set of plays still has the same edge. Trust the process.</li>
</ul>

<p>Use our <a href="/tools/kelly-calculator">Kelly Calculator</a> to get the exact bet size for each play, and scale it down for tournament volume.</p>

<h2>Step 4: Target the Sweet Spots</h2>

<p>Not all rounds of March Madness are created equal. Here's where the best value tends to live:</p>

<h3>First Round (Best Volume)</h3>
<p>32 games in two days. This is the highest-volume, highest-opportunity window of the entire year. Books are stretched thin. Public money is everywhere. <strong>This is where you grind.</strong></p>

<ul>
<li>Focus on spreads and totals — moneylines on heavy favorites are usually priced correctly</li>
<li>12-vs-5 and 11-vs-6 matchups historically have the softest lines</li>
<li>First Four games (play-in) are often extremely mispriced because of low betting limits and less market attention</li>
</ul>

<h3>Second Round (Best Value Per Game)</h3>
<p>16 games. The public has already made their bracket bets and is doubling down on their picks. <strong>The emotional bias is at its peak here.</strong> If a public darling won in the first round, their line will be inflated in the second round. Look for value on their opponent.</p>

<h3>Sweet 16 / Elite 8 (Sharpest Lines)</h3>
<p>Lines get tighter here because the remaining teams are well-known and heavily analyzed. Edges are smaller, but they still exist — especially on totals and first-half lines. <strong>Be more selective.</strong> Only take plays with strong line movement confirmation.</p>

<h3>Final Four / Championship (Low Volume, Occasional Value)</h3>
<p>Only 2-3 games. The lines are extremely sharp by this point. If you find a +EV play here, it's usually small. <strong>Don't force bets.</strong> If nothing shows value, sit it out and enjoy the games.</p>

<h2>Common March Madness Betting Mistakes</h2>

<p>Even +EV bettors can get caught up in the madness. Avoid these traps:</p>

<ul>
<li><strong>Betting your bracket.</strong> Your bracket picks are for fun. Your real bets should come from data. These are two completely separate activities — never let your bracket influence your +EV plays.</li>
<li><strong>Overvaluing upsets.</strong> Yes, 12-seeds beat 5-seeds about 35% of the time. But that doesn't mean every 12-seed moneyline at +350 is +EV. Check the math.</li>
<li><strong>Ignoring first-half markets.</strong> Books spend less time pricing first-half lines, especially in the early rounds. If you see +EV on a first-half spread with line movement confirmation, take it seriously.</li>
<li><strong>Parlaying tournament games.</strong> Parlays are -EV by design. Don't combine your carefully researched +EV plays into a parlay that mathematically destroys the edge.</li>
<li><strong>Not adjusting for tempo.</strong> College basketball tempo varies wildly between conferences. If a book doesn't properly adjust for a slow-tempo team facing a fast-tempo team, the total will be mispriced. This is one of the most consistent edges in the tournament.</li>
</ul>

<h2>The March Madness +EV Checklist</h2>

<p>Before you place any March Madness bet, run through this checklist:</p>

<ol>
<li><strong>Does SharpMoney show it as +EV?</strong> If not, pass. No gut bets.</li>
<li><strong>What does the line movement chart say?</strong> Is the movement confirming your side? Are limits going up?</li>
<li><strong>Is the EV coming from one book or multiple?</strong> Multi-book EV is stronger than a single outlier.</li>
<li><strong>Have you sized it correctly?</strong> Use quarter or half Kelly during high-volume days.</li>
<li><strong>Are you within your daily risk limit?</strong> Don't exceed 10-15% of your bankroll in a single day, no matter how many plays you find.</li>
<li><strong>Is this a bracket bet or a data bet?</strong> Be honest with yourself. If you're betting it because "they're due for an upset," it's a bracket bet. Close the bet slip.</li>
</ol>

<h2>Key Takeaways</h2>

<ul>
<li><strong>March Madness is the best time of year for +EV bettors.</strong> Volume, soft lines, and public bias create edges that don't exist during the regular season.</li>
<li><strong>Use SharpMoney's filters to surface NCAA Tournament +EV plays.</strong> Set your minimum EV%, select NCAAB, and refresh often — especially during the first round.</li>
<li><strong>Line movement charts are your secret weapon.</strong> Don't take a +EV play without checking whether sharp money confirms it.</li>
<li><strong>Manage your bankroll aggressively but intelligently.</strong> Use fractional Kelly and set daily limits. The variance in a 32-game day is real.</li>
<li><strong>Target first and second round games for volume, totals for inefficiency, and the Signal for highest-conviction plays.</strong></li>
<li><strong>Don't let your bracket brain make your real-money decisions.</strong> Data over narrative. Always.</li>
</ul>

<p>March Madness is chaos for most bettors. For +EV bettors with the right tools, it's the most profitable three weeks of the year.</p>

<p><strong>Ready to bet March Madness the smart way?</strong> <a href="/#pricing?utm_source=website&utm_medium=guide&utm_campaign=march-madness">Get started with SharpMoney</a> and start finding +EV tournament plays today.</p>
`,
  },

  // =========================================================================
  // SharpMoney Promo Optimizer
  // =========================================================================
  {
    slug: "sharpmoney-promo-optimizer",
    title: "SharpMoney Promo Optimizer",
    headline:
      "SharpMoney Promo Optimizer: How to Maximize Profit Boosts & Sportsbook Promos",
    description:
      "Learn how the SharpMoney Promo Optimizer turns real +EV legs into better boosted parlays — safe, balanced, or long-shot builds — plus custom slips and SGP mode. Full video walkthrough included.",
    metaTitle:
      "SharpMoney Promo Optimizer Guide — Profit Boost Parlays & +EV Promos (2026)",
    metaDescription:
      "Use SharpMoney's Promo Optimizer to build data-driven profit boost parlays: match your sportsbook promo, get safe/balanced/long-shot combos, fair value vs boosted price, Kelly sizing, and custom SGP builds. Video tutorial included.",
    keywords: [
      "sharpmoney promo optimizer",
      "promo optimizer sports betting",
      "profit boost optimizer",
      "sportsbook promo tool",
      "boosted parlay ev",
      "profit boost parlay strategy",
      "fanduel profit boost",
      "how to use profit boosts",
      "+ev parlay",
      "sharp money promo",
      "sgp profit boost",
      "custom parlay builder",
      "sports betting promos",
      "maximize sportsbook promos",
      "promo combination tool",
    ],
    publishedAt: "2026-03-23",
    updatedAt: "2026-03-23",
    readTime: "9 min read",
    category: "tools",
    categoryLabel: "Tools & Features",
    relatedTools: [
      { name: "EV Calculator", slug: "ev-calculator" },
      { name: "Kelly Calculator", slug: "kelly-calculator" },
      { name: "Odds Converter", slug: "odds-converter" },
    ],
    content: `
<p>Sportsbook profit boosts can be one of the best ways to gain an edge — but they can also fool you into thinking every bet is good just because you have a boost. <strong>The boost itself is not the edge.</strong> The legs matter. The structure matters. The price matters.</p>

<p>That's why we built the <strong>SharpMoney Promo Optimizer</strong>: to help you maximize promos in a data-driven way. Instead of randomly scrolling markets and guessing which legs belong in a boosted parlay, the tool starts from real edge-based opportunities and helps you assemble stronger combinations.</p>

<h2>Watch the Full Video Walkthrough</h2>

<p>Here's the complete Promo Optimizer tutorial on YouTube:</p>

<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%;margin-bottom:2rem;">
<iframe style="position:absolute;top:0;left:0;width:100%;height:100%;" src="https://www.youtube.com/embed/6t2GJzAsuxo" title="SharpMoney Promo Optimizer Tutorial" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

<p><a href="https://www.youtube.com/watch?v=6t2GJzAsuxo" target="_blank" rel="noopener noreferrer">Open on YouTube →</a></p>

<h2>What the Promo Optimizer Does</h2>

<p>You select the sportsbook, match the boost percentage to the promo you actually have, and set the rules the book requires (minimum legs, odds floor, leagues, etc.). The optimizer then searches the leg pool and surfaces combinations that fit the structure — <strong>much more reliably than building something manually from narrative picks.</strong></p>

<p>Promos matter because they're one of the few places in sports betting where you can create genuinely strong edges. A lot of straight bets only carry a small edge, even when they're good. <strong>Apply a boost to the right structure</strong> and that edge can get a lot bigger. That's why promos are valuable for both beginners and experienced bettors — and why most people still waste them.</p>

<p>The typical mistake: you see a boost, throw together legs you "like," and assume the promo did the work. The tool exists to fix that.</p>

<h2>Pricing &amp; Access</h2>

<p>The Promo Optimizer is included in <strong>all SharpMoney packages</strong>, including <strong>Core</strong> (from $29.99/month), so you can use promos smarter without jumping to the highest tier.</p>

<p>At checkout you can use code <strong>YouTube</strong> for <strong>10% off</strong> (as mentioned in the video).</p>

<h2>Step 1: Match the Promo at the Sportsbook</h2>

<p>Before you touch the optimizer, open your book and read the promo rules. Example from the walkthrough: a <strong>50% profit boost</strong> on FanDuel for college basketball — eligible for same game parlays (SGP), SGP+, or traditional parlays; pregame or live; minimum odds often around <strong>-200</strong>; sometimes no minimum leg count.</p>

<p><strong>Important:</strong> The Promo Optimizer is built for <strong>pregame</strong> legs. If your promo allows live betting, you'll still want to build in the tool using pregame prices to stay consistent with the edge model.</p>

<p>Write down: book name, boost %, minimum legs (if any), minimum odds, allowed leagues/markets, and whether SGP or SGP+ is required.</p>

<h2>Step 2: Enter Your Settings in the Tool</h2>

<ul>
<li><strong>Sportsbook</strong> — Select the book you're playing at (e.g. FanDuel).</li>
<li><strong>Profit boost %</strong> — Type the exact boost (e.g. 50%) or use a preset. Odd boosts like 33% are common — use manual entry when needed.</li>
<li><strong>Minimum legs</strong> — If the promo doesn't require a minimum, you can still set a floor (e.g. 2) to match how you want to build.</li>
<li><strong>Leg types</strong> — Include all leg types, or narrow to main lines vs props only depending on the promo.</li>
<li><strong>League / sport</strong> — Restrict to the sport the promo applies to (e.g. college basketball only).</li>
</ul>

<p>Then hit <strong>Build optimal parlays</strong>. The engine returns multiple structures designed to fit your rules.</p>

<h2>Step 3: Safe, Balanced, and Long-Shot Builds</h2>

<p>The optimizer typically gives you three flavors:</p>

<ul>
<li><strong>Safe play</strong> — The minimum legs and lowest odds needed to satisfy the promo. Lowest variance, highest win rate.</li>
<li><strong>Balanced play</strong> — Often around roughly <strong>10:1 to 20:1</strong> — more upside, more variance.</li>
<li><strong>Long-shot play</strong> — Often in the <strong>30:1 to 50:1</strong> range — highest EV potential, lowest hit rate.</li>
</ul>

<p>If you're newer or building a bankroll, lean toward the <strong>safe</strong> builds and keep the ticket as small as the promo allows. If you're limited across books and need to maximize promo value when you can get down, you might lean <strong>balanced</strong> or <strong>long shot</strong> — knowing your win percentage drops sharply even when long-term value rises.</p>

<p>As you add legs, <strong>EV% often increases</strong> — but variance increases too. Pick the profile that matches your risk tolerance and account situation.</p>

<h2>Reading the Slip: Odds, Fair Value, and Kelly</h2>

<p>Each suggested parlay shows:</p>

<ul>
<li><strong>Original parlay odds</strong> (before boost)</li>
<li><strong>Boosted odds</strong> after the profit boost</li>
<li><strong>Fair value odds</strong> — SharpMoney's estimate of the fair price</li>
<li><strong>Win probability</strong></li>
<li><strong>Expected value (EV%)</strong> after the boost</li>
<li><strong>Recommended stake (Kelly)</strong> — e.g. quarter Kelly sizing when applicable</li>
</ul>

<p>The core rule: <strong>if the price you're getting is better than fair value, the play is +EV.</strong> A 50% boost can produce very large EV% on the right structure — but a low win rate (e.g. ~29%) can still be correct if the payout and edge justify it. That's the math working, not a reason to avoid the bet — as long as sizing matches your bankroll.</p>

<p>Always <strong>double-check the built odds at the sportsbook</strong> before you place: confirm the pre-boost parlay price matches what the optimizer showed, then apply the boost and confirm the boosted price matches. If something drifts, refresh and rebuild.</p>

<h2>Build Your Own Custom Slip</h2>

<p>Switch to <strong>custom slip</strong> mode when you don't want only the top automated builds. You'll see the full list of +EV opportunities on that book, sortable (e.g. by EV% or by odds). You can add legs across leagues — NBA, college hoops, soccer, tennis, etc. — and remove or swap legs as you go.</p>

<p>This is useful when you have a specific narrative or game stack in mind but still want to see whether each leg clears the EV bar before you lock the ticket.</p>

<h2>SGP and SGP+ Mode</h2>

<p>When the promo requires a <strong>same game parlay</strong> or <strong>SGP+</strong>, use the SGP workflow: pick your first leg, and the tool <strong>highlights other legs</strong> that are +EV and can complete the same-game structure the book allows. Add a second leg in the same game (e.g. spread + quarter total), then extend to <strong>SGP+</strong> if you need multiple games — mixing leagues only when the promo allows it.</p>

<h2>Why You Should Use Promos While You Have Them</h2>

<p>Profit boosts and promos are among the best bankroll builders for newer bettors — you can structure parlays with <strong>20–30%+ edges</strong> that are hard to replicate in straight markets. Books also tend to <strong>pull back promos</strong> for winning accounts over time. The goal is to extract maximum value from what's available <em>now</em>, with discipline, rather than leaving free EV on the table.</p>

<p><strong>Bottom line:</strong> Don't treat boosts as a substitute for edge. Use the Promo Optimizer so every boosted ticket starts from real +EV legs and a structure that fits the rules — then verify at the window and size with Kelly.</p>

<p><strong>Ready to try it?</strong> <a href="/#pricing?utm_source=website&utm_medium=guide&utm_campaign=promo-optimizer">Pick a SharpMoney plan</a> — Promo Optimizer is included on Core and up. Use code <strong>YouTube</strong> for 10% off at checkout.</p>
`,
  },

  // =========================================================================
  // MLB +EV Betting — 2026 video companion guide
  // =========================================================================
  {
    slug: "mlb-plus-ev-betting-guide-2026",
    title: "MLB Plus EV Betting Guide 2026",
    headline:
      "MLB Plus EV Betting in 2026: Tips, Common Mistakes & How SharpMoney Fits",
    description:
      "Companion to our YouTube MLB +EV guide: MLB vs NBA market behavior, Pinnacle limits & devig (no-vig fair odds from sharp books), home run props, prop-market sharpness, line movement, and the filter settings we actually run.",
    metaTitle:
      "MLB Plus EV Betting Guide 2026 | Tips, Mistakes & SharpMoney Strategy",
    metaDescription:
      "MLB +EV betting from our 2026 YouTube guide: stable markets vs NBA, when to trust EV without steam, home run prop discipline, Pinnacle limit lifts, prop vs main-line sharp books, line movement, filters & SharpMoney.",
    keywords: [
      "mlb plus ev betting",
      "mlb +ev strategy",
      "how to bet mlb sharp",
      "baseball sports betting ev",
      "mlb line movement betting",
      "sharp money mlb",
      "profitable mlb betting",
      "mlb betting mistakes",
      "mlb props ev",
      "pinnacle mlb lines",
      "mlb totals betting strategy",
      "expected value baseball betting",
      "sharpmoney mlb",
      "mlb betting guide 2026",
      "early season mlb betting",
      "mlb home run props ev",
      "pinnacle limits mlb betting",
      "mlb devig sharp books",
    ],
    publishedAt: "2026-03-27",
    updatedAt: "2026-03-27",
    readTime: "13 min read",
    category: "strategy",
    categoryLabel: "Strategy Guide",
    relatedTools: [
      { name: "EV Calculator", slug: "ev-calculator" },
      { name: "No-Vig Calculator", slug: "no-vig-calculator" },
      { name: "Kelly Calculator", slug: "kelly-calculator" },
    ],
    content: `
<p>A lot of bettors sleep on MLB (&quot;dead time in the summer&quot;) &mdash; but the video makes the case that baseball can be one of the <strong>best sports for +EV</strong>: enormous daily slates, tons of markets, and opportunities that add up over a long season. The catch is that <strong>MLB markets behave differently than the NBA and NFL</strong>, and betting <strong>main lines vs. props</strong> is almost two different games.</p>

<p>This page is a written companion to <strong>MLB Plus EV Betting Guide 2026 | Tips, Mistakes, and SharpMoney Strategy</strong> on YouTube. Watch the walkthrough for screen recordings and examples; use this as a checklist when you build your own filters.</p>

<h2>Watch the Full Video</h2>

<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%;margin-bottom:2rem;">
<iframe style="position:absolute;top:0;left:0;width:100%;height:100%;" src="https://www.youtube.com/embed/W7oN8IvJrKs" title="MLB Plus EV Betting Guide 2026 | Tips, Mistakes, and SharpMoney Strategy" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

<p><a href="https://www.youtube.com/watch?v=W7oN8IvJrKs" target="_blank" rel="noopener noreferrer">Open on YouTube &rarr;</a></p>

<h2>MLB vs. Other Sports: Calmer Markets (Usually)</h2>

<p>In baseball, <strong>starting pitchers are scheduled</strong>; lineups are often close to projections. Yes, there are rest days and injuries &mdash; but you typically do not get the same <strong>last-second &quot;star ruled out&quot;</strong> nukes that send NBA totals and spreads flying five minutes before tip. In the NBA, a huge chunk of &quot;steam&quot; is the market repricing who is actually playing. In MLB, <strong>movement is more often driven by betting action and handle</strong> once the core matchup info is known.</p>

<p>Practical shift: if you are used to <strong>chasing massive steam</strong> on NBA injury news, <strong>MLB will feel quiet</strong>. That does not mean the edge is gone &mdash; it means you should <strong>lean more on EV% and devig quality</strong> (how many sharp books agree) when the board is stable.</p>

<h3>Devig / sharp books: a simple rule of thumb</h3>

<p>As covered in the video, think in tiers: <strong>one</strong> sharp book in the devig can be acceptable; <strong>two</strong> is strong; <strong>Pinnacle, Bookmaker, and Circa all in the devig</strong> is about as good as it gets on main lines. On those plays, you can often fire when the number is stable or not moving <em>against</em> you &mdash; even if you do not see dramatic steam. Line movement still helps, but the video argues you should be <strong>less dependent on movement on MLB main lines</strong> than in the NBA, for the reasons above.</p>

<h2>Mistake #1: Hammering Every +EV Home Run Prop</h2>

<p>Home run props can show fat EV tags, but they are betting on a <strong>high-variance yes/no</strong> outcome. It is much harder to pin fair value than &quot;how many combined runs&quot; on a full game. In the video, the guidance is: <strong>do not let HR props become a big slice of your MLB book</strong> &mdash; think on the order of <strong>~5% of your baseball action</strong>, not the core portfolio.</p>

<p>If you still want to play them, be selective: situational edges (park, weather, bullpen quality) can matter, favor <strong>higher EV%</strong> (the video suggests thinking in terms of <strong>10%+</strong> if you are firing more often), and avoid treating extreme longshots like &quot;free lottery tickets&quot; just because hitting one feels like it pays for five misses.</p>

<h2>Tip: Watch Pinnacle Limit Increases (and What Happens Next)</h2>

<p>Sharps often <strong>wait for higher limits</strong> to get meaningful size down. Pinnacle lifts limits as a market matures; when limits step up and you see <strong>odds shorten on the side that mattered</strong>, that is often a tell that money showed up at the sharpest price.</p>

<p>The video walks through a real example (Royals alt line): limits climb, Pinnacle moves off a better price, and a retail number lags. The logic: <strong>if the sharp price was bet at +190, you can be confident there was edge at +190</strong> &mdash; so <strong>+200 on a soft book</strong> can still be a play even before you overthink every fair-value model. SharpMoney shows limit history and movement so you can spot that pattern.</p>

<h2>Bankroll &amp; Keeping Betting Money Separate</h2>

<p>The video also touches on <strong>keeping your betting roll separate from everyday spending</strong> &mdash; cleaner accounting, fewer declined deposits, and room to scale professionally. Our partner <strong>EdgeBoost</strong> is built as a betting-focused bank card; full offer details are on their site. If you want the SharpMoney partner link, start here: <a href="https://www.edgeboost.bet/guide/?oid=313&amp;affid=246" target="_blank" rel="noopener noreferrer">EdgeBoost &rarr;</a> (terms and promos can change &mdash; verify on their page).</p>

<h2>Mistake #2: Ignoring Line Movement Entirely</h2>

<p>This sounds like the opposite of &quot;MLB is calmer&quot; &mdash; it is not. <strong>Markets move all the time.</strong> A <strong>small EV%</strong> play with <strong>strong, sustained movement in your direction</strong> can turn into a much bigger edge by close. A <strong>fat EV%</strong> play with the wrong kind of drift can be <strong>negative EV by the time the game starts</strong> if the market keeps correcting against you.</p>

<p>The point is not to require NBA-style steam on every MLB bet; it is to <strong>never bet blind to direction</strong> if you care about <a href="/guides/line-movement-charts-ev-betting-strategy">closing line value</a>. Use the chart: it helps you size down on dead tickets and lean in when movement confirms.</p>

<h2>Mistake #3: Treating Sharp Books as Automatically Sharp on <em>Props</em></h2>

<p>Pinnacle may take <strong>tens of thousands</strong> on a big-league moneyline, but the same book might only hang <strong>a few hundred dollars</strong> on a niche prop. When limits are tiny, the &quot;sharp&quot; line is less battle-tested. A retail giant might actually have the <strong>tighter, more consensus price</strong> on some props because more handle shaped it.</p>

<p>The video&apos;s filter: look for your play to be a <strong>true outlier vs. the whole market</strong>. If FanDuel is -110 but half the industry is clustered there, a lone sharp book at -130 does not automatically make -110 a smash. If <strong>everyone</strong> lines up with the outlier, that is a different story.</p>

<h2>Timing, Filters &amp; Props (How We Actually Run MLB)</h2>

<p>These are the settings and habits from the video &mdash; tune them to what you track and your risk tolerance:</p>

<ul>
<li><strong>Main lines &mdash; &quot;today only.&quot;</strong> Skip most &quot;overnight&quot; MLB card plays; lines are less tested until limits and time of day catch up.</li>
<li><strong>Odds range:</strong> baseball often justifies a <strong>higher ceiling</strong> than other sports &mdash; the video mentions being comfortable up to around <strong>+200</strong> on some setups.</li>
<li><strong>EV floor on main lines:</strong> can go down to about <strong>0.5%</strong> <em>when</em> limits and line movement support the bet.</li>
<li><strong>Minimum Pinnacle limit (~$3,000):</strong> helps screen out the very earliest, untested postings; many lines get their first meaningful limit bump in the morning block.</li>
<li><strong>Props:</strong> stay <strong>same-day</strong>; demand <strong>higher EV%</strong> than main lines (think more like <strong>3&ndash;6%+</strong>) because liquidity is thinner; many bettors focus <strong>pitcher strikeouts</strong> and <strong>unders</strong> on counting stats (total bases, runs, hits, etc.) and trim exotic markets they do not want to trust.</li>
</ul>

<h2>Why SharpMoney for MLB</h2>

<p>The through-line in the video: MLB rewards tools that are <strong>fast</strong>, show <strong>Pinnacle limits and history</strong>, compare <strong>multiple sharp books</strong>, and pair <strong>EV% with movement</strong> so you are not guessing on a 15-book tab salvo every night. That is how SharpMoney is built.</p>

<p>New to the stack? Read <a href="/guides/beginners-guide-to-sharpmoney">A Beginner&apos;s Guide to SharpMoney</a>. Want more on charts? See <a href="/guides/line-movement-charts-ev-betting-strategy">How to Read Line Movement Charts for +EV Betting</a>.</p>

<h2>Key Takeaways</h2>

<ul>
<li><strong>MLB is often &quot;stable&quot; vs. the NBA:</strong> less injury chaos, more handle-driven movement &mdash; adjust how much you lean on steam.</li>
<li><strong>Main-line EV + strong devig</strong> can be enough when the line is not moving against you.</li>
<li><strong>Home run props:</strong> sprinkle and be selective; do not build your season around them.</li>
<li><strong>Limit increases + odds shifts</strong> on Pinnacle are a cheat code for seeing when sharp money finally sized.</li>
<li><strong>Props need higher EV%</strong> and a <strong>whole-market outlier</strong> test &mdash; sharp books are not automatically truth on thin markets.</li>
<li><strong>Line movement still matters</strong> for CLV even when MLB feels slower.</li>
</ul>

<p><strong>Plans:</strong> <a href="/#pricing?utm_source=website&utm_medium=guide&utm_campaign=mlb-plus-ev-2026">SharpMoney pricing</a>. The video mentions code <strong>YouTube10</strong> for <strong>10% off your first month</strong> at checkout. <strong>Core, Pro, and Alpha</strong> each include a <strong>3-day free trial</strong> &mdash; confirm current terms on Whop when you sign up.</p>
`,
  },
];

// Helper to get an article by slug
export function getArticleBySlug(slug: string): GuideArticle | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
