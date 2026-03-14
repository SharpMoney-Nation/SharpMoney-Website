'use client';

import React, { useState, useMemo } from 'react';
import ToolBranding from './ToolBranding';

// ============================================================================
// Kelly Criterion Calculator
// ============================================================================
// Find optimal bet size based on your edge and bankroll.
// Supports input via odds + fair value, or odds + win probability directly.
// ============================================================================

interface KellyCalculatorProps {
  isMobile: boolean;
}

/** Convert American odds to decimal odds. */
function americanToDecimal(odds: number): number {
  if (odds >= 100) return (odds / 100) + 1;
  return (100 / Math.abs(odds)) + 1;
}

/** Convert American odds to implied probability (0-1). */
function americanToImpliedProb(odds: number): number {
  if (odds >= 100) return 100 / (odds + 100);
  return Math.abs(odds) / (Math.abs(odds) + 100);
}

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

/** Parse a probability input (e.g. "52.5" → 0.525). Returns null if invalid. */
function parseProbability(input: string): number | null {
  const trimmed = input.trim().replace(/%$/, '');
  if (trimmed === '') return null;
  const num = Number(trimmed);
  if (isNaN(num)) return null;
  if (num <= 0 || num >= 100) return null;
  return num / 100;
}

/** Format American odds with + prefix for positive. */
function fmtOdds(odds: number): string {
  if (odds > 0) return `+${odds}`;
  return `${odds}`;
}

type FairValueMode = 'odds' | 'probability';

export default function KellyCalculator({ isMobile }: KellyCalculatorProps) {
  const [betOddsInput, setBetOddsInput] = useState('');
  const [fairValueMode, setFairValueMode] = useState<FairValueMode>('odds');
  const [fairOddsInput, setFairOddsInput] = useState('');
  const [fairProbInput, setFairProbInput] = useState('');
  const [bankrollInput, setBankrollInput] = useState('');

  // Parse inputs
  const betOdds = parseOdds(betOddsInput);
  const fairProb = useMemo(() => {
    if (fairValueMode === 'odds') {
      const odds = parseOdds(fairOddsInput);
      return odds !== null ? americanToImpliedProb(odds) : null;
    }
    return parseProbability(fairProbInput);
  }, [fairValueMode, fairOddsInput, fairProbInput]);

  // Parse bankroll (simple computation, no memoization needed)
  const parseBankroll = (input: string): number | null => {
    const trimmed = input.trim().replace(/[$,]/g, '');
    if (trimmed === '') return null;
    const num = Number(trimmed);
    if (isNaN(num) || num <= 0) return null;
    return num;
  };
  const bankroll = parseBankroll(bankrollInput);

  // Calculate Kelly
  const result = useMemo(() => {
    if (betOdds === null || fairProb === null) return null;

    const decimal = americanToDecimal(betOdds);
    const betImpliedProb = americanToImpliedProb(betOdds);

    // EV% = (decimal * fairProb) - 1
    const evDecimal = (decimal * fairProb) - 1;
    const evPercent = evDecimal * 100;

    // b = decimal - 1 (net odds received on a 1-unit bet)
    const b = decimal - 1;

    // Kelly% = (b * p - q) / b  where p = fairProb, q = 1 - fairProb
    // Equivalent to: (decimal * fairProb - 1) / (decimal - 1)
    const kellyFraction = evDecimal / b;
    const kellyPercent = kellyFraction * 100;

    // Fractional Kelly
    const halfKelly = kellyFraction / 2;
    const quarterKelly = kellyFraction / 4;
    const thirdKelly = kellyFraction / 3;

    // Parse bankroll directly from input for reactivity
    const br = parseBankroll(bankrollInput);

    // Dollar amounts if bankroll provided
    const fullDollars = br !== null ? br * Math.max(kellyFraction, 0) : null;
    const halfDollars = br !== null ? br * Math.max(halfKelly, 0) : null;
    const quarterDollars = br !== null ? br * Math.max(quarterKelly, 0) : null;
    const thirdDollars = br !== null ? br * Math.max(thirdKelly, 0) : null;

    return {
      decimal,
      betImpliedProb,
      fairProb,
      evPercent,
      kellyPercent,
      halfKellyPercent: halfKelly * 100,
      quarterKellyPercent: quarterKelly * 100,
      thirdKellyPercent: thirdKelly * 100,
      fullDollars,
      halfDollars,
      quarterDollars,
      thirdDollars,
      isPositiveEV: evDecimal > 0,
    };
  }, [betOdds, fairProb, bankrollInput]);

  return (
    <div className={`${isMobile ? 'px-4' : 'max-w-2xl mx-auto'}`}>
      {/* Description */}
      <div className="mb-6">
        <p className="text-sm text-gray-400 leading-relaxed">
          The Kelly Criterion determines the mathematically optimal percentage of your bankroll to wager 
          based on your edge. Enter your bet odds and the true fair value to see recommended bet sizes.
        </p>
      </div>

      {/* ── Single unified card ── */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
        {/* ── Inputs ── */}
        <div className="p-5 border-b border-gray-700/50">
          <div className="relative flex items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
              Enter Details
            </h3>
            <div className="absolute inset-0 flex items-center justify-center gap-2 pointer-events-none">
              <img src="/sharpmoney-logo.png" alt="" className="w-7 h-7 object-contain" />
              <span className="text-sm font-semibold text-cyan-400 tracking-widest" style={{ fontFamily: 'Russo One, sans-serif' }}>SHARPMONEY</span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Bet Odds */}
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                Your Bet Odds
              </label>
              <input
                type="text"
                inputMode="text"
                value={betOddsInput}
                onChange={(e) => setBetOddsInput(e.target.value)}
                placeholder="-110"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white text-lg font-mono placeholder-gray-600
                  focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
            </div>

            {/* Fair Value - Mode Toggle */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-gray-400 font-medium">
                  Fair Value ({fairValueMode === 'odds' ? 'No-Vig Odds' : 'Win Probability'})
                </label>
                <div className="flex bg-gray-900 rounded-lg p-0.5 border border-gray-700">
                  <button
                    onClick={() => setFairValueMode('odds')}
                    className={`px-2.5 py-1 text-[10px] font-semibold rounded-md transition-colors ${
                      fairValueMode === 'odds'
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    Odds
                  </button>
                  <button
                    onClick={() => setFairValueMode('probability')}
                    className={`px-2.5 py-1 text-[10px] font-semibold rounded-md transition-colors ${
                      fairValueMode === 'probability'
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    Probability
                  </button>
                </div>
              </div>

              {fairValueMode === 'odds' ? (
                <input
                  type="text"
                  inputMode="text"
                  value={fairOddsInput}
                  onChange={(e) => setFairOddsInput(e.target.value)}
                  placeholder="-105"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white text-lg font-mono placeholder-gray-600
                    focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                />
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={fairProbInput}
                    onChange={(e) => setFairProbInput(e.target.value)}
                    placeholder="52.38"
                    className="w-full px-4 py-3 pr-8 bg-gray-900 border border-gray-600 rounded-lg text-white text-lg font-mono placeholder-gray-600
                      focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-lg">%</span>
                </div>
              )}
            </div>

            {/* Bankroll */}
            <div className="border-t border-gray-700/50 pt-4">
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                Bankroll <span className="text-gray-600">(optional — for $ amounts)</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-lg">$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={bankrollInput}
                  onChange={(e) => setBankrollInput(e.target.value)}
                  placeholder="5,000"
                  className="w-full pl-8 pr-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white text-lg font-mono placeholder-gray-600
                    focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Results ── */}
        <div className="p-5">
          {betOdds === null || fairProb === null ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">
                {betOddsInput || fairOddsInput || fairProbInput
                  ? 'Enter valid bet odds and fair value.'
                  : 'Enter your bet odds and fair value to calculate Kelly.'}
              </p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              {/* Not +EV warning */}
              {!result.isPositiveEV && (
                <div className="bg-red-950/20 border border-red-800/30 rounded-lg p-4 text-center">
                  <p className="text-red-400 text-sm font-semibold">No Edge Detected</p>
                  <p className="text-red-400/70 text-xs mt-1">
                    Kelly says don&apos;t bet — EV is {result.evPercent.toFixed(2)}%. There&apos;s no mathematically optimal wager on a negative EV bet.
                  </p>
                </div>
              )}

              {/* Kelly hero */}
              {result.isPositiveEV && (
                <div className="text-center py-4">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-2">Recommended Bet Size</p>
                  <p className="text-5xl font-bold font-mono tracking-tight text-cyan-400">
                    {result.halfKellyPercent.toFixed(2)}%
                  </p>
                  <p className="text-xs mt-2 text-gray-400 font-medium">
                    Half Kelly <span className="text-gray-600">(recommended)</span>
                  </p>
                </div>
              )}

              {/* Context row */}
              <div className="overflow-hidden rounded-lg border border-gray-700">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-700/30">
                    <tr>
                      <td className="px-4 py-2.5 text-xs text-gray-400 font-medium">Your Odds</td>
                      <td className="px-4 py-2.5 text-right text-white font-mono font-semibold">
                        {fmtOdds(betOdds)} <span className="text-gray-500 text-[11px]">({result.decimal.toFixed(2)})</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-xs text-gray-400 font-medium">Win Probability</td>
                      <td className="px-4 py-2.5 text-right text-cyan-300 font-mono font-semibold">
                        {(result.fairProb * 100).toFixed(2)}%
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-xs text-gray-400 font-medium">EV%</td>
                      <td className={`px-4 py-2.5 text-right font-mono font-semibold ${result.isPositiveEV ? 'text-green-400' : 'text-red-400'}`}>
                        {result.evPercent > 0 ? '+' : ''}{result.evPercent.toFixed(2)}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Kelly sizing table */}
              {result.isPositiveEV && (
                <div className="overflow-hidden rounded-lg border border-gray-700">
                  <div className="bg-gray-900/40 px-4 py-2.5">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold">Kelly Bet Sizing</p>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-900/30">
                        <th className="text-left px-4 py-2 text-gray-500 font-medium text-[10px] uppercase tracking-wide">
                          Fraction
                        </th>
                        <th className="text-center px-3 py-2 text-gray-500 font-medium text-[10px] uppercase tracking-wide">
                          % of Bankroll
                        </th>
                        {bankroll !== null && (
                          <th className="text-right px-4 py-2 text-gray-500 font-medium text-[10px] uppercase tracking-wide">
                            Bet Amount
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/30">
                      <tr>
                        <td className="px-4 py-2.5 text-xs text-gray-400 font-medium">Full Kelly</td>
                        <td className="px-3 py-2.5 text-center text-white font-mono font-semibold">
                          {result.kellyPercent.toFixed(2)}%
                        </td>
                        {bankroll !== null && (
                          <td className="px-4 py-2.5 text-right text-white font-mono font-semibold">
                            ${result.fullDollars!.toFixed(2)}
                          </td>
                        )}
                      </tr>
                      <tr className="bg-cyan-950/10 border-l-2 border-l-cyan-500">
                        <td className="px-4 py-2.5 text-xs text-cyan-400 font-semibold">
                          Half Kelly <span className="text-cyan-600 text-[10px]">★</span>
                        </td>
                        <td className="px-3 py-2.5 text-center text-cyan-300 font-mono font-semibold">
                          {result.halfKellyPercent.toFixed(2)}%
                        </td>
                        {bankroll !== null && (
                          <td className="px-4 py-2.5 text-right text-cyan-300 font-mono font-semibold">
                            ${result.halfDollars!.toFixed(2)}
                          </td>
                        )}
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 text-xs text-gray-400 font-medium">Third Kelly</td>
                        <td className="px-3 py-2.5 text-center text-gray-300 font-mono font-semibold">
                          {result.thirdKellyPercent.toFixed(2)}%
                        </td>
                        {bankroll !== null && (
                          <td className="px-4 py-2.5 text-right text-gray-300 font-mono font-semibold">
                            ${result.thirdDollars!.toFixed(2)}
                          </td>
                        )}
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 text-xs text-gray-400 font-medium">Quarter Kelly</td>
                        <td className="px-3 py-2.5 text-center text-gray-300 font-mono font-semibold">
                          {result.quarterKellyPercent.toFixed(2)}%
                        </td>
                        {bankroll !== null && (
                          <td className="px-4 py-2.5 text-right text-gray-300 font-mono font-semibold">
                            ${result.quarterDollars!.toFixed(2)}
                          </td>
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Why Half Kelly */}
              <div className="bg-gray-900/40 rounded-lg p-4 border border-gray-700/40">
                <p className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold mb-2">Why Half Kelly?</p>
                <div className="space-y-2 text-[11px] text-gray-400 leading-relaxed">
                  <p>
                    Full Kelly maximizes long-term growth rate but produces <span className="text-gray-300 font-medium">extreme variance</span>. 
                    In practice, your edge estimate is never perfectly accurate — even small errors in win probability cause Full Kelly to over-bet dramatically.
                  </p>
                  <p>
                    <span className="text-cyan-400 font-medium">Half Kelly</span> captures roughly <span className="text-gray-300 font-medium">75% of the growth rate</span> of 
                    Full Kelly while cutting the variance nearly in half. Most professional bettors and sharp money managers use Half Kelly or less.
                  </p>
                  <p>
                    <span className="text-gray-300 font-medium">Quarter Kelly</span> is the most conservative option — ideal when you have lower confidence in your edge 
                    or are working with a smaller bankroll where drawdowns hurt more.
                  </p>
                </div>
              </div>

              {/* Formula reference */}
              <div className="bg-gray-900/40 rounded-lg p-4 border border-gray-700/40">
                <p className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold mb-2">The Kelly Formula</p>
                <div className="space-y-1.5 text-[11px] text-gray-400 leading-relaxed">
                  <p>
                    <span className="text-gray-300 font-mono font-medium">f* = (bp − q) / b</span>
                  </p>
                  <p>
                    Where <span className="text-gray-300">b</span> = net odds (decimal − 1), <span className="text-gray-300">p</span> = win probability, <span className="text-gray-300">q</span> = loss probability (1 − p)
                  </p>
                  <p className="text-gray-500 mt-1">
                    If f* is negative or zero, the Kelly Criterion says there is no edge — don&apos;t bet.
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Branding */}
      <ToolBranding className="mt-6" />
    </div>
  );
}
