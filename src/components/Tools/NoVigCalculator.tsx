'use client';

import React, { useState, useMemo } from 'react';
import ToolBranding from './ToolBranding';

// ============================================================================
// No-Vig Calculator
// ============================================================================
// Remove the vig/juice from a 2-way line to find the true fair odds.
// Supports 6 devigging methods: Multiplicative, Additive, Power, Shin,
// Worst Case, and Average.
//
// All methods are always visible in the results table — the selected method
// is highlighted so the user can quickly compare approaches.
// ============================================================================

// ── Inlined Devig Methods ──────────────────────────────────────────────────

type DevigMethod = 'multiplicative' | 'additive' | 'power' | 'shin' | 'worst_case' | 'average';

interface DevigResult {
  method: DevigMethod;
  fairProbA: number;
  fairProbB: number;
  fairOddsA: number;
  fairOddsB: number;
  holdPercent: number;
}

interface MethodInfo {
  label: string;
  shortLabel: string;
  description: string;
  article: string;
  bestFor: string;
  limitations: string;
}

const METHOD_INFO: Record<DevigMethod, MethodInfo> = {
  multiplicative: {
    label: 'Multiplicative',
    shortLabel: 'Mult',
    description: 'Divides each implied probability proportionally so they sum to 100%. The industry standard and most widely used method.',
    article: 'The Multiplicative method (also called the proportional or ratio method) is the simplest and most common devigging approach. It assumes the sportsbook added vig proportionally — meaning each side\'s implied probability was inflated by the same factor. To remove it, you divide each probability by the total overround. This preserves the ratio between the two sides. Most +EV betting tools (OddsJam, etc.) use this method by default.',
    bestFor: 'Standard 2-way markets (spreads, totals, moneylines) with moderate vig. Good all-around default.',
    limitations: 'Assumes vig is split proportionally, which isn\'t always how books price lines. Can be slightly off on lopsided markets.',
  },
  additive: {
    label: 'Additive',
    shortLabel: 'Add',
    description: 'Subtracts an equal amount of vig from each side. Simple but can produce unusual results on lopsided lines.',
    article: 'The Additive method assumes the sportsbook added the same flat margin to both sides. To devig, you subtract half the total margin from each implied probability. This is mathematically simple and easy to understand, but it treats both sides identically regardless of their probability — a -500 favorite and a +400 underdog each get the same amount of vig removed, which isn\'t how books typically operate.',
    bestFor: 'Lines where both sides have similar odds (close to pick\'em). Quick mental math.',
    limitations: 'Can produce probabilities below 0% or above 100% on very lopsided lines. Not realistic for heavy favorites/underdogs.',
  },
  power: {
    label: 'Power',
    shortLabel: 'Power',
    description: 'Raises each probability to a power k that makes them sum to 100%. More accurate for lopsided lines.',
    article: 'The Power method (also called the logarithmic or exponential method) finds an exponent k such that q₁ᵏ + q₂ᵏ = 1, where q₁ and q₂ are the raw implied probabilities. This is solved numerically (bisection). The Power method removes more vig from the favorite side than the underdog side, which better reflects how sportsbooks actually distribute their margin — they tend to shade the favorite more.',
    bestFor: 'Lopsided markets (heavy favorites) where the book shades one side more. More realistic vig distribution.',
    limitations: 'Slightly more complex. Requires numerical solving. Less intuitive than multiplicative.',
  },
  shin: {
    label: 'Shin',
    shortLabel: 'Shin',
    description: 'Models insider trading to estimate fair odds. Considered the most theoretically sound method.',
    article: 'The Shin method, developed by Hyun Song Shin, models the sportsbook\'s margin as a response to insider trading. It assumes a fraction z of bets come from informed bettors (insiders), and the book widens its margin to protect against them. The fair probability for each side is computed using the formula: pᵢ = (√(z² + 4(1−z)·qᵢ²/S) − z) / (2(1−z)). This is considered the most theoretically grounded method, especially for markets where insider information could be a factor (like player props).',
    bestFor: 'Markets with potential insider activity. Theoretically the most rigorous method. Academic research supports it.',
    limitations: 'The insider fraction z is estimated from the margin itself — it\'s a model, not ground truth. Overkill for standard liquid markets.',
  },
  worst_case: {
    label: 'Worst Case',
    shortLabel: 'Worst',
    description: 'Uses the lowest fair probability for each side across all methods. Most conservative approach.',
    article: 'The Worst Case method runs all four primary devigging methods and takes the minimum fair probability for each side independently. This gives you the most conservative estimate — the lowest edge you can reasonably claim. It\'s useful when you want to make sure a bet is truly +EV even under the most pessimistic interpretation of the line.',
    bestFor: 'Confirming a bet is +EV under any devigging assumption. Conservative bankroll management.',
    limitations: 'By definition, it underestimates probabilities. Sides may come from different methods and won\'t sum to 100%.',
  },
  average: {
    label: 'Average',
    shortLabel: 'Avg',
    description: 'Averages the fair probabilities across all four primary methods. A balanced middle ground.',
    article: 'The Average method computes fair probabilities using all four primary methods (Multiplicative, Additive, Power, Shin) and takes the arithmetic mean for each side. This hedges against any single method\'s assumptions being wrong. It\'s a pragmatic approach when you\'re unsure which method best fits a particular market.',
    bestFor: 'When you\'re unsure which method is best. Smooths out individual method biases.',
    limitations: 'Averages out nuance — if one method is clearly better for a market type, averaging dilutes its accuracy.',
  },
};

/** Convert American odds to implied probability (0-1). */
function americanToImpliedProb(odds: number): number {
  if (odds >= 100) return 100 / (odds + 100);
  return Math.abs(odds) / (Math.abs(odds) + 100);
}

/** Convert probability (0-1) to American odds. */
function probToAmerican(prob: number): number {
  if (prob <= 0 || prob >= 1) return 0;
  if (Math.abs(prob - 0.5) < 1e-9) return -100;
  if (prob > 0.5) return Math.round((-prob / (1 - prob)) * 100);
  return Math.round(((1 - prob) / prob) * 100);
}

/** Bisection to find Power exponent k where q1^k + q2^k = 1. */
function findPowerK(q1: number, q2: number): number {
  let lo = 1.0, hi = 100.0;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const sum = Math.pow(q1, mid) + Math.pow(q2, mid);
    if (Math.abs(sum - 1) < 1e-12) return mid;
    if (sum > 1) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Bisection to find Shin insider fraction z where Σpᵢ(z) = 1. */
function findShinZ(q1: number, q2: number): number {
  const S = q1 + q2;
  const shinProb = (q: number, z: number) =>
    (Math.sqrt(z * z + 4 * (1 - z) * q * q / S) - z) / (2 * (1 - z));

  let lo = 0, hi = 0.999;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const sum = shinProb(q1, mid) + shinProb(q2, mid);
    if (Math.abs(sum - 1) < 1e-12) return mid;
    if (sum > 1) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

function calculateAllMethods(oddsA: number, oddsB: number): DevigResult[] {
  const q1 = americanToImpliedProb(oddsA);
  const q2 = americanToImpliedProb(oddsB);
  const S = q1 + q2;
  const holdPercent = (S - 1) * 100;

  const results: DevigResult[] = [];

  // Multiplicative
  const multA = q1 / S;
  const multB = q2 / S;
  results.push({
    method: 'multiplicative',
    fairProbA: multA,
    fairProbB: multB,
    fairOddsA: probToAmerican(multA),
    fairOddsB: probToAmerican(multB),
    holdPercent,
  });

  // Additive
  const halfMargin = (S - 1) / 2;
  const addA = q1 - halfMargin;
  const addB = q2 - halfMargin;
  results.push({
    method: 'additive',
    fairProbA: addA,
    fairProbB: addB,
    fairOddsA: probToAmerican(addA),
    fairOddsB: probToAmerican(addB),
    holdPercent,
  });

  // Power
  const k = findPowerK(q1, q2);
  const powA = Math.pow(q1, k);
  const powB = Math.pow(q2, k);
  results.push({
    method: 'power',
    fairProbA: powA,
    fairProbB: powB,
    fairOddsA: probToAmerican(powA),
    fairOddsB: probToAmerican(powB),
    holdPercent,
  });

  // Shin
  const z = findShinZ(q1, q2);
  const shinProb = (q: number) =>
    (Math.sqrt(z * z + 4 * (1 - z) * q * q / S) - z) / (2 * (1 - z));
  const shinA = shinProb(q1);
  const shinB = shinProb(q2);
  results.push({
    method: 'shin',
    fairProbA: shinA,
    fairProbB: shinB,
    fairOddsA: probToAmerican(shinA),
    fairOddsB: probToAmerican(shinB),
    holdPercent,
  });

  // Worst Case — min probability per side across the 4 primary methods
  const primary = results.slice(0, 4);
  const wcA = Math.min(...primary.map((r) => r.fairProbA));
  const wcB = Math.min(...primary.map((r) => r.fairProbB));
  results.push({
    method: 'worst_case',
    fairProbA: wcA,
    fairProbB: wcB,
    fairOddsA: probToAmerican(wcA),
    fairOddsB: probToAmerican(wcB),
    holdPercent,
  });

  // Average — mean probability per side across the 4 primary methods
  const avgA = primary.reduce((sum, r) => sum + r.fairProbA, 0) / primary.length;
  const avgB = primary.reduce((sum, r) => sum + r.fairProbB, 0) / primary.length;
  results.push({
    method: 'average',
    fairProbA: avgA,
    fairProbB: avgB,
    fairOddsA: probToAmerican(avgA),
    fairOddsB: probToAmerican(avgB),
    holdPercent,
  });

  return results;
}

// ── Component ──────────────────────────────────────────────────────────────

interface NoVigCalculatorProps {
  isMobile: boolean;
}

const METHODS: DevigMethod[] = ['multiplicative', 'additive', 'power', 'shin', 'worst_case', 'average'];

/** Parse a string into American odds. Returns null if invalid. */
function parseOdds(input: string): number | null {
  const trimmed = input.trim().replace(/^\+/, '');
  if (trimmed === '' || trimmed === '-') return null;
  const num = Number(trimmed);
  if (isNaN(num)) return null;
  if (num > -100 && num < 100 && num !== 0) return null;
  if (num === 0) return null;
  return num;
}

/** Format a probability as a percentage string. */
function fmtProb(p: number): string {
  return `${(p * 100).toFixed(2)}%`;
}

/** Format American odds with + prefix for positive. */
function fmtOdds(odds: number): string {
  if (odds > 0) return `+${odds}`;
  return `${odds}`;
}

/** Format a number to N decimal places. */
function fmtNum(n: number, dp: number = 4): string {
  return n.toFixed(dp);
}

export default function NoVigCalculator({ isMobile }: NoVigCalculatorProps) {
  const [sideAOdds, setSideAOdds] = useState('');
  const [sideBOdds, setSideBOdds] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<DevigMethod>('multiplicative');
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [showWhatIsVig, setShowWhatIsVig] = useState(false);
  const [showMath, setShowMath] = useState(false);

  // Parse inputs
  const parsedA = parseOdds(sideAOdds);
  const parsedB = parseOdds(sideBOdds);
  const hasValidInputs = parsedA !== null && parsedB !== null;

  // Always calculate all methods when inputs are valid
  const allResults: DevigResult[] | null = useMemo(() => {
    if (!hasValidInputs) return null;
    return calculateAllMethods(parsedA!, parsedB!);
  }, [parsedA, parsedB, hasValidInputs]);

  // The hold % is the same for every method — grab it once
  const holdPercent = allResults ? allResults[0].holdPercent : null;

  return (
    <div className={`${isMobile ? 'px-4' : 'max-w-2xl mx-auto'}`}>
      {/* Tool description + What is Vig? */}
      <div className="mb-6 space-y-3">
        <p className="text-sm text-gray-400 leading-relaxed">
          Enter the American odds for both sides of a 2-way market (e.g., moneyline, spread, total). 
          This tool strips out the sportsbook&apos;s built-in margin to reveal the true fair odds and probabilities underneath.
        </p>

        {/* What is Vig? expandable */}
        <button
          onClick={() => setShowWhatIsVig(!showWhatIsVig)}
          className="text-xs text-cyan-500 hover:text-cyan-400 transition-colors flex items-center gap-1.5"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-cyan-500"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          {showWhatIsVig ? 'Hide: What is Vig?' : 'What is Vig?'}
        </button>

        {showWhatIsVig && (
          <div className="bg-gray-800/80 border border-gray-700/60 rounded-lg p-4 space-y-3">
            <p className="text-xs text-gray-300 leading-relaxed">
              <span className="text-white font-semibold">Vig</span> (also called juice, overround, or hold) is the margin a sportsbook builds into every line. 
              It&apos;s how they make money — by paying out slightly less than the true odds warrant. 
              When you see a standard -110/-110 spread, the combined implied probabilities add up to ~104.8% instead of 100%. That extra ~4.8% is the vig.
            </p>
            <p className="text-xs text-gray-300 leading-relaxed">
              Not all sportsbooks carry the same vig. Sharp books like Pinnacle operate on razor-thin margins — often under 2% on liquid markets like NFL spreads. 
              Retail sportsbooks can carry 6–8% or more, especially on player props and alt lines. 
              This gap is what creates opportunities for value bettors.
            </p>
            <p className="text-xs text-gray-300 leading-relaxed">
              By de-vigging a sharp book&apos;s odds, you can estimate the true probability of each outcome. 
              Compare those fair probabilities against the inflated lines at retail books, and you can identify bets where the payout exceeds the real risk — that&apos;s a +EV bet.
            </p>
            <div className="bg-gray-900/50 rounded-md p-3 border border-gray-700/40">
              <p className="text-[11px] text-gray-400 leading-relaxed">
                <span className="text-cyan-400 font-medium">Example:</span> A Pinnacle spread is -108/-108 (3.8% vig). 
                De-vigging reveals the true probability is 50%/50%. 
                Meanwhile, DraftKings has the same spread at -110/+100. 
                The +100 side implies 50% — but the fair probability is 50%, so you&apos;re getting paid at even odds on a coin flip. 
                That&apos;s breakeven. But if DraftKings had +105, you&apos;d be getting paid above fair value — that&apos;s +EV.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Single unified card: Inputs → Method → Results ── */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
        {/* ── Odds Inputs ── */}
        <div className="p-5 border-b border-gray-700/50">
          <div className="relative flex items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
              Enter Odds
            </h3>
            <div className="absolute inset-0 flex items-center justify-center gap-2 pointer-events-none">
              <img src="/sharpmoney-logo.png" alt="" className="w-7 h-7 object-contain" />
              <span className="text-sm font-semibold text-cyan-400 tracking-widest" style={{ fontFamily: 'Russo One, sans-serif' }}>SHARPMONEY</span>
            </div>
          </div>
          
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-6'}`}>
            {/* Side A */}
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                Side A
              </label>
              <input
                type="text"
                inputMode="text"
                value={sideAOdds}
                onChange={(e) => setSideAOdds(e.target.value)}
                placeholder="-110"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white text-lg font-mono placeholder-gray-600 
                  focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
            </div>

            {/* Side B */}
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                Side B
              </label>
              <input
                type="text"
                inputMode="text"
                value={sideBOdds}
                onChange={(e) => setSideBOdds(e.target.value)}
                placeholder="-110"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white text-lg font-mono placeholder-gray-600 
                  focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* ── Method Selector ── */}
        <div className="px-5 pt-4 pb-3 border-b border-gray-700/50">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
            Method
          </h3>

          {/* Method pills */}
          <div className="flex flex-wrap gap-2">
            {METHODS.map((m) => {
              const info = METHOD_INFO[m];
              const isActive = selectedMethod === m;
              return (
                <button
                  key={m}
                  onClick={() => setSelectedMethod(m)}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-medium transition-all border
                    ${isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-gray-900/50 text-gray-400 border-gray-700 hover:border-gray-500 hover:text-gray-300'
                    }
                  `}
                  title={info.description}
                >
                  {isMobile ? info.shortLabel : info.label}
                </button>
              );
            })}
          </div>

          {/* Selected method description + Learn More */}
          <div className="mt-3">
            <p className="text-xs text-gray-500 leading-relaxed">
              {METHOD_INFO[selectedMethod].description}
            </p>

            <button
              onClick={() => setShowLearnMore(!showLearnMore)}
              className="mt-2 text-[11px] text-cyan-500 hover:text-cyan-400 transition-colors flex items-center gap-1"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`transition-transform duration-200 ${showLearnMore ? 'rotate-90' : ''}`}
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
              {showLearnMore ? 'Hide details' : 'Learn more about this method'}
            </button>

            {showLearnMore && (
              <MethodArticle info={METHOD_INFO[selectedMethod]} />
            )}
          </div>
        </div>

        {/* ── Results Table (always shows all methods) ── */}
        <div className="p-5">
          {!hasValidInputs ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">
                {sideAOdds || sideBOdds
                  ? 'Enter valid American odds for both sides (e.g., -110, +150).'
                  : 'Enter odds above to see fair values.'}
              </p>
            </div>
          ) : allResults ? (
            <div className="space-y-0">
              {/* Book Hold badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-gray-400 font-medium">Book Hold</span>
                <span className="text-xs text-amber-400 font-mono font-semibold bg-amber-950/30 border border-amber-800/30 px-2 py-0.5 rounded">
                  {holdPercent!.toFixed(2)}%
                </span>
              </div>

              {/* All-methods table */}
              <div className="overflow-hidden rounded-lg border border-gray-700">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-900/60">
                      <th className="text-left px-4 py-2.5 text-gray-500 font-medium text-[10px] uppercase tracking-wide">
                        Method
                      </th>
                      <th className="text-center px-3 py-2.5 text-gray-500 font-medium text-[10px] uppercase tracking-wide">
                        Fair Odds A
                      </th>
                      <th className="text-center px-3 py-2.5 text-gray-500 font-medium text-[10px] uppercase tracking-wide">
                        Fair Odds B
                      </th>
                      <th className="text-center px-3 py-2.5 text-gray-500 font-medium text-[10px] uppercase tracking-wide">
                        {isMobile ? 'Prob A' : 'Fair Prob A'}
                      </th>
                      <th className="text-center px-3 py-2.5 text-gray-500 font-medium text-[10px] uppercase tracking-wide">
                        {isMobile ? 'Prob B' : 'Fair Prob B'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/30">
                    {allResults.map((r) => {
                      const info = METHOD_INFO[r.method];
                      const isSelected = r.method === selectedMethod;

                      const rowClass = isSelected
                        ? 'bg-cyan-950/30 border-l-2 border-l-cyan-400'
                        : '';

                      const methodTextClass = isSelected
                        ? 'text-cyan-300 font-semibold'
                        : 'text-gray-400';

                      const valueTextClass = isSelected
                        ? 'text-white font-semibold'
                        : 'text-gray-400';

                      return (
                        <tr
                          key={r.method}
                          className={`${rowClass} cursor-pointer hover:bg-gray-700/20 transition-colors`}
                          onClick={() => setSelectedMethod(r.method)}
                        >
                          <td className={`px-4 py-3 text-xs ${methodTextClass}`}>
                            {isMobile ? info.shortLabel : info.label}
                            {isSelected && (
                              <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-cyan-400" />
                            )}
                          </td>
                          <td className={`px-3 py-3 text-center font-mono text-sm ${valueTextClass}`}>
                            {fmtOdds(r.fairOddsA)}
                          </td>
                          <td className={`px-3 py-3 text-center font-mono text-sm ${valueTextClass}`}>
                            {fmtOdds(r.fairOddsB)}
                          </td>
                          <td className={`px-3 py-3 text-center font-mono text-xs ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                            {fmtProb(r.fairProbA)}
                          </td>
                          <td className={`px-3 py-3 text-center font-mono text-xs ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                            {fmtProb(r.fairProbB)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Input odds reference beneath table */}
              <div className="flex justify-between mt-3 px-1">
                <span className="text-[10px] text-gray-600">
                  Book odds: <span className="font-mono text-gray-500">{sideAOdds}</span> / <span className="font-mono text-gray-500">{sideBOdds}</span>
                </span>
                <span className="text-[10px] text-gray-600">
                  Click any row to highlight
                </span>
              </div>

              {/* Best For / Limitations for the selected method */}
              <MethodStrengths info={METHOD_INFO[selectedMethod]} methodLabel={METHOD_INFO[selectedMethod].label} />

              {/* Show Math toggle */}
              <button
                onClick={() => setShowMath(!showMath)}
                className="mt-4 flex items-center gap-1.5 text-[11px] text-cyan-500 hover:text-cyan-400 transition-colors"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`transition-transform duration-200 ${showMath ? 'rotate-90' : ''}`}
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
                {showMath ? 'Hide math' : 'Show the math'}
              </button>

              {showMath && (
                <MathBreakdown
                  method={selectedMethod}
                  oddsA={parsedA!}
                  oddsB={parsedB!}
                  result={allResults.find(r => r.method === selectedMethod)!}
                  allResults={allResults}
                />
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* Branding watermark */}
      <ToolBranding className="mt-6" />
    </div>
  );
}

// ============================================================================
// Sub-components
// ============================================================================

function MethodStrengths({ info, methodLabel }: { info: MethodInfo; methodLabel: string }) {
  return (
    <div className="mt-4 space-y-2">
      <p className="text-[10px] text-gray-500 uppercase tracking-wide font-medium">
        {methodLabel} Method
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-green-950/20 border border-green-900/30 rounded-md p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-400">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            <span className="text-[10px] font-semibold text-green-400 uppercase tracking-wide">Best For</span>
          </div>
          <p className="text-[11px] text-green-300/80 leading-relaxed">{info.bestFor}</p>
        </div>

        <div className="bg-amber-950/20 border border-amber-900/30 rounded-md p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-amber-400">
              <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wide">Limitations</span>
          </div>
          <p className="text-[11px] text-amber-300/80 leading-relaxed">{info.limitations}</p>
        </div>
      </div>
    </div>
  );
}

function MathBreakdown({
  method,
  oddsA,
  oddsB,
  result,
  allResults,
}: {
  method: DevigMethod;
  oddsA: number;
  oddsB: number;
  result: DevigResult;
  allResults: DevigResult[];
}) {
  const q1 = americanToImpliedProb(oddsA);
  const q2 = americanToImpliedProb(oddsB);
  const S = q1 + q2;
  const margin = S - 1;

  const renderStep = (num: number, title: string, content: React.ReactNode) => (
    <div className="space-y-1.5">
      <p className="text-[11px] text-cyan-400 font-semibold">Step {num}: {title}</p>
      <div className="bg-gray-950/60 rounded-md px-3 py-2 font-mono text-[11px] text-gray-300 leading-relaxed space-y-0.5">
        {content}
      </div>
    </div>
  );

  const step1 = renderStep(1, 'Convert to implied probabilities', (
    <>
      <p>Side A ({fmtOdds(oddsA)}): q₁ = {fmtNum(q1, 6)} <span className="text-gray-500">({fmtProb(q1)})</span></p>
      <p>Side B ({fmtOdds(oddsB)}): q₂ = {fmtNum(q2, 6)} <span className="text-gray-500">({fmtProb(q2)})</span></p>
    </>
  ));

  const step2Overround = renderStep(2, 'Sum of implied probabilities (overround)', (
    <>
      <p>S = q₁ + q₂ = {fmtNum(q1, 6)} + {fmtNum(q2, 6)} = <span className="text-white font-semibold">{fmtNum(S, 6)}</span></p>
      <p>Margin = S − 1 = {fmtNum(margin, 6)} <span className="text-gray-500">({fmtNum(margin * 100, 2)}% hold)</span></p>
    </>
  ));

  const stepConvert = (stepNum: number, p1: number, p2: number) =>
    renderStep(stepNum, 'Convert back to American odds', (
      <>
        <p>p₁ = {fmtNum(p1 * 100, 2)}% → <span className="text-white font-semibold">{fmtOdds(result.fairOddsA)}</span></p>
        <p>p₂ = {fmtNum(p2 * 100, 2)}% → <span className="text-white font-semibold">{fmtOdds(result.fairOddsB)}</span></p>
      </>
    ));

  let methodSteps: React.ReactNode;

  switch (method) {
    case 'multiplicative': {
      const p1 = q1 / S;
      const p2 = q2 / S;
      methodSteps = (
        <>
          {step1}
          {step2Overround}
          {renderStep(3, 'Divide each by total (remove vig proportionally)', (
            <>
              <p className="text-gray-500 italic mb-1">pᵢ = qᵢ / S</p>
              <p>p₁ = {fmtNum(q1, 6)} / {fmtNum(S, 6)} = <span className="text-white font-semibold">{fmtNum(p1, 6)}</span> <span className="text-gray-500">({fmtProb(p1)})</span></p>
              <p>p₂ = {fmtNum(q2, 6)} / {fmtNum(S, 6)} = <span className="text-white font-semibold">{fmtNum(p2, 6)}</span> <span className="text-gray-500">({fmtProb(p2)})</span></p>
            </>
          ))}
          {stepConvert(4, p1, p2)}
        </>
      );
      break;
    }

    case 'additive': {
      const halfM = margin / 2;
      const p1 = q1 - halfM;
      const p2 = q2 - halfM;
      methodSteps = (
        <>
          {step1}
          {step2Overround}
          {renderStep(3, 'Subtract equal margin from each side', (
            <>
              <p className="text-gray-500 italic mb-1">pᵢ = qᵢ − margin/2</p>
              <p>margin / 2 = {fmtNum(margin, 6)} / 2 = {fmtNum(halfM, 6)}</p>
              <p>p₁ = {fmtNum(q1, 6)} − {fmtNum(halfM, 6)} = <span className="text-white font-semibold">{fmtNum(p1, 6)}</span> <span className="text-gray-500">({fmtProb(p1)})</span></p>
              <p>p₂ = {fmtNum(q2, 6)} − {fmtNum(halfM, 6)} = <span className="text-white font-semibold">{fmtNum(p2, 6)}</span> <span className="text-gray-500">({fmtProb(p2)})</span></p>
            </>
          ))}
          {stepConvert(4, p1, p2)}
        </>
      );
      break;
    }

    case 'power': {
      const kk = findPowerK(q1, q2);
      const p1 = Math.pow(q1, kk);
      const p2 = Math.pow(q2, kk);
      methodSteps = (
        <>
          {step1}
          {step2Overround}
          {renderStep(3, 'Find exponent k where q₁ᵏ + q₂ᵏ = 1', (
            <>
              <p className="text-gray-500 italic mb-1">Solve numerically (bisection)</p>
              <p>k = <span className="text-white font-semibold">{fmtNum(kk, 6)}</span></p>
              <p className="text-gray-500 mt-1">Verify: {fmtNum(q1, 4)}^{fmtNum(kk, 4)} + {fmtNum(q2, 4)}^{fmtNum(kk, 4)} = {fmtNum(p1 + p2, 6)}</p>
            </>
          ))}
          {renderStep(4, 'Raise each implied probability to power k', (
            <>
              <p className="text-gray-500 italic mb-1">pᵢ = qᵢᵏ</p>
              <p>p₁ = {fmtNum(q1, 6)}^{fmtNum(kk, 4)} = <span className="text-white font-semibold">{fmtNum(p1, 6)}</span> <span className="text-gray-500">({fmtProb(p1)})</span></p>
              <p>p₂ = {fmtNum(q2, 6)}^{fmtNum(kk, 4)} = <span className="text-white font-semibold">{fmtNum(p2, 6)}</span> <span className="text-gray-500">({fmtProb(p2)})</span></p>
            </>
          ))}
          {stepConvert(5, p1, p2)}
        </>
      );
      break;
    }

    case 'shin': {
      const zz = findShinZ(q1, q2);
      methodSteps = (
        <>
          {step1}
          {step2Overround}
          {renderStep(3, 'Find insider fraction z where Σpᵢ(z) = 1', (
            <>
              <p className="text-gray-500 italic mb-1">Solve numerically (bisection)</p>
              <p>z = <span className="text-white font-semibold">{fmtNum(zz, 6)}</span></p>
              <p className="text-gray-500 mt-1">Interpretation: ~{fmtNum(zz * 100, 2)}% of bets modeled as insider-driven</p>
            </>
          ))}
          {renderStep(4, 'Compute fair probabilities using Shin formula', (
            <>
              <p className="text-gray-500 italic mb-1">pᵢ = (√(z² + 4(1−z)·qᵢ²/S) − z) / (2(1−z))</p>
              <p>p₁ = <span className="text-white font-semibold">{fmtNum(result.fairProbA, 6)}</span> <span className="text-gray-500">({fmtProb(result.fairProbA)})</span></p>
              <p>p₂ = <span className="text-white font-semibold">{fmtNum(result.fairProbB, 6)}</span> <span className="text-gray-500">({fmtProb(result.fairProbB)})</span></p>
            </>
          ))}
          {stepConvert(5, result.fairProbA, result.fairProbB)}
        </>
      );
      break;
    }

    case 'worst_case': {
      const primary = allResults.filter(r =>
        !['worst_case', 'average'].includes(r.method)
      );
      methodSteps = (
        <>
          {step1}
          {renderStep(2, 'Compute fair probabilities with all four primary methods', (
            <>
              {primary.map(r => (
                <p key={r.method}>
                  {METHOD_INFO[r.method].label}: p₁ = {fmtProb(r.fairProbA)}, p₂ = {fmtProb(r.fairProbB)}
                </p>
              ))}
            </>
          ))}
          {renderStep(3, 'Take minimum probability for each side', (
            <>
              <p className="text-gray-500 italic mb-1">Worst case = most conservative per-side</p>
              <p>Side A: min({primary.map(r => fmtProb(r.fairProbA)).join(', ')}) = <span className="text-white font-semibold">{fmtProb(result.fairProbA)}</span></p>
              <p>Side B: min({primary.map(r => fmtProb(r.fairProbB)).join(', ')}) = <span className="text-white font-semibold">{fmtProb(result.fairProbB)}</span></p>
              <p className="text-gray-500 mt-1">Note: sides may come from different methods — probabilities may not sum to 100%</p>
            </>
          ))}
          {stepConvert(4, result.fairProbA, result.fairProbB)}
        </>
      );
      break;
    }

    case 'average': {
      const primary = allResults.filter(r =>
        !['worst_case', 'average'].includes(r.method)
      );
      methodSteps = (
        <>
          {step1}
          {renderStep(2, 'Compute fair probabilities with all four primary methods', (
            <>
              {primary.map(r => (
                <p key={r.method}>
                  {METHOD_INFO[r.method].label}: p₁ = {fmtProb(r.fairProbA)}, p₂ = {fmtProb(r.fairProbB)}
                </p>
              ))}
            </>
          ))}
          {renderStep(3, 'Average the probabilities across all four methods', (
            <>
              <p className="text-gray-500 italic mb-1">Mean of all primary methods</p>
              <p>Side A: ({primary.map(r => fmtNum(r.fairProbA * 100, 2) + '%').join(' + ')}) / 4 = <span className="text-white font-semibold">{fmtProb(result.fairProbA)}</span></p>
              <p>Side B: ({primary.map(r => fmtNum(r.fairProbB * 100, 2) + '%').join(' + ')}) / 4 = <span className="text-white font-semibold">{fmtProb(result.fairProbB)}</span></p>
            </>
          ))}
          {stepConvert(4, result.fairProbA, result.fairProbB)}
        </>
      );
      break;
    }
  }

  return (
    <div className="mt-3 bg-gray-900/60 border border-gray-700/50 rounded-lg p-4 space-y-4">
      <p className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold">
        {METHOD_INFO[method].label} — Step-by-step calculation
      </p>
      {methodSteps}
    </div>
  );
}

function MethodArticle({ info }: { info: MethodInfo }) {
  return (
    <div className="mt-3 bg-gray-900/60 border border-gray-700/50 rounded-lg p-4 space-y-3">
      <p className="text-xs text-gray-300 leading-relaxed">
        {info.article}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div className="bg-green-950/20 border border-green-900/30 rounded-md p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-400">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            <span className="text-[10px] font-semibold text-green-400 uppercase tracking-wide">Best For</span>
          </div>
          <p className="text-[11px] text-green-300/80 leading-relaxed">{info.bestFor}</p>
        </div>

        <div className="bg-amber-950/20 border border-amber-900/30 rounded-md p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-amber-400">
              <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wide">Limitations</span>
          </div>
          <p className="text-[11px] text-amber-300/80 leading-relaxed">{info.limitations}</p>
        </div>
      </div>
    </div>
  );
}
