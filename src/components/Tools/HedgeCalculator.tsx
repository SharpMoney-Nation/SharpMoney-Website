'use client';

import React, { useState, useMemo } from 'react';
import ToolBranding from './ToolBranding';

// ============================================================================
// Hedge Calculator
// ============================================================================
// Lock in profit or minimize loss by hedging an existing bet.
// Supports two modes:
//   1. Equal Profit — same profit regardless of which side wins
//   2. Adjust Profit — slider to shift profit toward original or hedge side
// ============================================================================

interface HedgeCalculatorProps {
  isMobile: boolean;
}

/** Convert American odds to decimal odds. */
function americanToDecimal(odds: number): number {
  if (odds >= 100) return (odds / 100) + 1;
  return (100 / Math.abs(odds)) + 1;
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

/** Parse a dollar amount. Returns null if invalid. */
function parseDollar(input: string): number | null {
  const trimmed = input.trim().replace(/[$,]/g, '');
  if (trimmed === '') return null;
  const num = Number(trimmed);
  if (isNaN(num) || num <= 0) return null;
  return num;
}

/** Format American odds with + prefix for positive. */
function fmtOdds(odds: number): string {
  if (odds > 0) return `+${odds}`;
  return `${odds}`;
}

/** Format dollar amount with sign. */
function fmtDollar(amount: number, showSign = true): string {
  if (showSign) {
    if (amount >= 0) return `+$${amount.toFixed(2)}`;
    return `-$${Math.abs(amount).toFixed(2)}`;
  }
  return `$${amount.toFixed(2)}`;
}

type HedgeMode = 'equal' | 'adjust';

export default function HedgeCalculator({ isMobile }: HedgeCalculatorProps) {
  const [originalOddsInput, setOriginalOddsInput] = useState('');
  const [originalStakeInput, setOriginalStakeInput] = useState('');
  const [hedgeOddsInput, setHedgeOddsInput] = useState('');
  const [hedgeMode, setHedgeMode] = useState<HedgeMode>('equal');
  // Slider: 0 = all profit on hedge win, 50 = equal, 100 = all profit on original win
  const [profitSlider, setProfitSlider] = useState(50);

  // Parse inputs
  const originalOdds = parseOdds(originalOddsInput);
  const originalStake = parseDollar(originalStakeInput);
  const hedgeOdds = parseOdds(hedgeOddsInput);

  // Compute the equal-profit hedge stake (used as the baseline)
  const equalHedgeStake = useMemo(() => {
    if (originalOdds === null || originalStake === null || hedgeOdds === null) return null;
    const originalDecimal = americanToDecimal(originalOdds);
    const hedgeDecimal = americanToDecimal(hedgeOdds);
    const originalPayout = originalStake * originalDecimal;
    return originalPayout / hedgeDecimal;
  }, [originalOdds, originalStake, hedgeOdds]);

  // Calculate hedge
  const result = useMemo(() => {
    if (originalOdds === null || originalStake === null || hedgeOdds === null || equalHedgeStake === null) return null;

    const originalDecimal = americanToDecimal(originalOdds);
    const hedgeDecimal = americanToDecimal(hedgeOdds);
    const originalPayout = originalStake * originalDecimal;
    const originalProfit = originalPayout - originalStake;

    let hedgeStake: number;

    if (hedgeMode === 'equal') {
      hedgeStake = equalHedgeStake;
    } else {
      // Slider maps to hedge stake:
      // slider=100 → small hedge (more profit if original wins)
      // slider=50  → equal profit
      // slider=0   → large hedge (more profit if hedge wins)
      //
      // Range: slider 100 → hedgeStake=0, slider 50 → equalStake, slider 0 → 2*equalStake
      // Linear interpolation: hedgeStake = equalStake * 2 * (1 - slider/100)
      hedgeStake = equalHedgeStake * 2 * (1 - profitSlider / 100);
      // Clamp to non-negative
      hedgeStake = Math.max(0, hedgeStake);
    }

    const totalStaked = originalStake + hedgeStake;

    // Scenario 1: Original wins
    const profitIfOriginalWins = originalPayout - totalStaked;
    // Scenario 2: Hedge wins
    const hedgePayout = hedgeStake * hedgeDecimal;
    const profitIfHedgeWins = hedgePayout - totalStaked;

    return {
      hedgeStake,
      totalStaked,
      originalDecimal,
      hedgeDecimal,
      originalPayout,
      originalProfit,
      profitIfOriginalWins,
      profitIfHedgeWins,
      guaranteedProfit: Math.min(profitIfOriginalWins, profitIfHedgeWins),
      isArbitrage: profitIfOriginalWins > 0 && profitIfHedgeWins > 0,
    };
  }, [originalOdds, originalStake, hedgeOdds, hedgeMode, profitSlider, equalHedgeStake]);

  const allInputsProvided = originalOdds !== null && originalStake !== null && hedgeOdds !== null;

  return (
    <div className={`${isMobile ? 'px-4' : 'max-w-2xl mx-auto'}`}>
      {/* Description */}
      <div className="mb-6">
        <p className="text-sm text-gray-400 leading-relaxed">
          Already placed a bet? Enter your original bet details and the hedge odds to calculate 
          the optimal hedge stake — lock in profit or minimize your downside.
        </p>
      </div>

      {/* ── Single unified card ── */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
        {/* ── Inputs ── */}
        <div className="p-5 border-b border-gray-700/50">
          <div className="relative flex items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
              Original Bet
            </h3>
            <div className="absolute inset-0 flex items-center justify-center gap-2 pointer-events-none">
              <img src="/sharpmoney-logo.png" alt="" className="w-7 h-7 object-contain" />
              <span className="text-sm font-semibold text-cyan-400 tracking-widest" style={{ fontFamily: 'Russo One, sans-serif' }}>SHARPMONEY</span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Original Odds + Stake side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                  Odds
                </label>
                <input
                  type="text"
                  inputMode="text"
                  value={originalOddsInput}
                  onChange={(e) => setOriginalOddsInput(e.target.value)}
                  placeholder="+300"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white text-lg font-mono placeholder-gray-600
                    focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                  Stake
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-lg">$</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={originalStakeInput}
                    onChange={(e) => setOriginalStakeInput(e.target.value)}
                    placeholder="100"
                    className="w-full pl-8 pr-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white text-lg font-mono placeholder-gray-600
                      focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Hedge section */}
            <div className="border-t border-gray-700/50 pt-4">
              <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
                Hedge Bet
              </h4>

              {/* Hedge Odds */}
              <div className="mb-3">
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                  Hedge Odds
                </label>
                <input
                  type="text"
                  inputMode="text"
                  value={hedgeOddsInput}
                  onChange={(e) => setHedgeOddsInput(e.target.value)}
                  placeholder="-150"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white text-lg font-mono placeholder-gray-600
                    focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                />
              </div>

              {/* Mode toggle */}
              <div className="flex bg-gray-900 rounded-lg p-0.5 border border-gray-700 mb-3">
                <button
                  onClick={() => { setHedgeMode('equal'); setProfitSlider(50); }}
                  className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    hedgeMode === 'equal'
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  Equal Profit
                </button>
                <button
                  onClick={() => setHedgeMode('adjust')}
                  className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    hedgeMode === 'adjust'
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  Adjust Profit
                </button>
              </div>

              {/* Profit distribution slider (only in adjust mode) */}
              {hedgeMode === 'adjust' && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">
                      Profit Distribution
                    </span>
                    {profitSlider === 50 && (
                      <span className="text-[10px] text-cyan-500 font-semibold">Equal</span>
                    )}
                  </div>

                  {/* Slider */}
                  <div className="relative">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={profitSlider}
                      onChange={(e) => setProfitSlider(Number(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400
                        [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-cyan-400/30
                        [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing
                        [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full
                        [&::-moz-range-thumb]:bg-cyan-400 [&::-moz-range-thumb]:border-0
                        [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:active:cursor-grabbing"
                    />
                    {/* Center tick mark */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-4 bg-gray-500 pointer-events-none rounded-full" />
                  </div>

                  {/* Labels under slider */}
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[10px] text-gray-500 font-medium">
                      ← More on Hedge
                    </span>
                    <span className="text-[10px] text-gray-600 font-medium">
                      Equal
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">
                      More on Original →
                    </span>
                  </div>

                  {/* Computed hedge stake display */}
                  {result && (
                    <div className="mt-3 text-center">
                      <span className="text-xs text-gray-400">Hedge Stake: </span>
                      <span className="text-sm text-cyan-400 font-mono font-semibold">${result.hedgeStake.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Results ── */}
        <div className="p-5">
          {!allInputsProvided ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">
                {originalOddsInput || originalStakeInput || hedgeOddsInput
                  ? 'Enter valid odds and stake for both sides.'
                  : 'Enter your original bet and hedge odds to calculate.'}
              </p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              {/* Hedge stake hero (equal mode) */}
              {hedgeMode === 'equal' && (
                <div className="text-center py-4">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-2">
                    Hedge Stake
                  </p>
                  <p className="text-5xl font-bold font-mono tracking-tight text-cyan-400">
                    ${result.hedgeStake.toFixed(2)}
                  </p>
                  <p className="text-xs mt-2 text-gray-400 font-medium">
                    to guarantee equal profit on both sides
                  </p>
                </div>
              )}

              {/* P/L Scenarios */}
              <div className="overflow-hidden rounded-lg border border-gray-700">
                <div className="bg-gray-900/40 px-4 py-2.5">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold">Profit / Loss Scenarios</p>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-900/30">
                      <th className="text-left px-4 py-2 text-gray-500 font-medium text-[10px] uppercase tracking-wide">
                        Outcome
                      </th>
                      <th className="text-right px-4 py-2 text-gray-500 font-medium text-[10px] uppercase tracking-wide">
                        Profit / Loss
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/30">
                    <tr>
                      <td className="px-4 py-3 text-xs text-gray-400 font-medium">
                        Original bet wins
                        <span className="text-gray-600 ml-1.5">({fmtOdds(originalOdds!)})</span>
                      </td>
                      <td className={`px-4 py-3 text-right font-mono font-semibold ${
                        result.profitIfOriginalWins >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {fmtDollar(result.profitIfOriginalWins)}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-xs text-gray-400 font-medium">
                        Hedge bet wins
                        <span className="text-gray-600 ml-1.5">({fmtOdds(hedgeOdds!)})</span>
                      </td>
                      <td className={`px-4 py-3 text-right font-mono font-semibold ${
                        result.profitIfHedgeWins >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {fmtDollar(result.profitIfHedgeWins)}
                      </td>
                    </tr>
                    <tr className={`${result.guaranteedProfit >= 0 ? 'bg-green-950/20' : 'bg-amber-950/10'}`}>
                      <td className={`px-4 py-3 text-xs font-semibold ${result.guaranteedProfit >= 0 ? 'text-green-400' : 'text-amber-400'}`}>
                        {result.guaranteedProfit >= 0 ? 'Guaranteed Profit' : 'Worst Case'}
                      </td>
                      <td className={`px-4 py-3 text-right font-mono font-bold ${
                        result.guaranteedProfit >= 0 ? 'text-green-400' : 'text-amber-400'
                      }`}>
                        {fmtDollar(result.guaranteedProfit)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Breakdown table */}
              <div className="overflow-hidden rounded-lg border border-gray-700">
                <div className="bg-gray-900/40 px-4 py-2.5">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold">Bet Breakdown</p>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-900/30">
                      <th className="text-left px-4 py-2 text-gray-500 font-medium text-[10px] uppercase tracking-wide">
                        &nbsp;
                      </th>
                      <th className="text-center px-3 py-2 text-gray-500 font-medium text-[10px] uppercase tracking-wide">
                        Original
                      </th>
                      <th className="text-center px-3 py-2 text-gray-500 font-medium text-[10px] uppercase tracking-wide">
                        Hedge
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/30">
                    <tr>
                      <td className="px-4 py-2.5 text-xs text-gray-400 font-medium">Odds</td>
                      <td className="px-3 py-2.5 text-center text-white font-mono font-semibold">
                        {fmtOdds(originalOdds!)}
                      </td>
                      <td className="px-3 py-2.5 text-center text-white font-mono font-semibold">
                        {fmtOdds(hedgeOdds!)}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-xs text-gray-400 font-medium">Decimal</td>
                      <td className="px-3 py-2.5 text-center text-gray-300 font-mono">
                        {result.originalDecimal.toFixed(2)}
                      </td>
                      <td className="px-3 py-2.5 text-center text-gray-300 font-mono">
                        {result.hedgeDecimal.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-xs text-gray-400 font-medium">Stake</td>
                      <td className="px-3 py-2.5 text-center text-white font-mono font-semibold">
                        ${originalStake!.toFixed(2)}
                      </td>
                      <td className="px-3 py-2.5 text-center text-cyan-300 font-mono font-semibold">
                        ${result.hedgeStake.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-xs text-gray-400 font-medium">Potential Payout</td>
                      <td className="px-3 py-2.5 text-center text-gray-300 font-mono">
                        ${result.originalPayout.toFixed(2)}
                      </td>
                      <td className="px-3 py-2.5 text-center text-gray-300 font-mono">
                        ${(result.hedgeStake * result.hedgeDecimal).toFixed(2)}
                      </td>
                    </tr>
                    <tr className="bg-gray-900/40">
                      <td className="px-4 py-2.5 text-xs text-gray-400 font-semibold">Total at Risk</td>
                      <td colSpan={2} className="px-3 py-2.5 text-center text-amber-400 font-mono font-semibold">
                        ${result.totalStaked.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Arbitrage badge */}
              {result.isArbitrage && (
                <div className="bg-green-950/20 border border-green-800/30 rounded-lg p-4 text-center">
                  <p className="text-green-400 text-sm font-semibold">✨ Arbitrage Opportunity</p>
                  <p className="text-green-400/70 text-xs mt-1">
                    Both outcomes are profitable — you&apos;re guaranteed {fmtDollar(result.guaranteedProfit, false)} no matter what.
                  </p>
                </div>
              )}

              {/* How it works */}
              <div className="bg-gray-900/40 rounded-lg p-4 border border-gray-700/40">
                <p className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold mb-2">How Hedging Works</p>
                <div className="space-y-2 text-[11px] text-gray-400 leading-relaxed">
                  <p>
                    <span className="text-gray-300 font-medium">Equal Profit</span> calculates the hedge stake so you make the same profit whether your original bet or hedge bet wins.
                  </p>
                  <p>
                    <span className="text-gray-300 font-medium">Adjust Profit</span> lets you slide the profit distribution — shift right to keep more profit if your original bet hits, or left to lock in more if the hedge side wins.
                  </p>
                  <p>
                    <span className="text-gray-300 font-medium">Formula:</span>{' '}
                    <span className="font-mono text-gray-300">Hedge Stake = Original Payout ÷ Hedge Decimal Odds</span>
                  </p>
                  <p className="text-gray-500 mt-1">
                    If the guaranteed profit is positive, you&apos;ve locked in a win regardless of outcome. This often happens with futures bets or when lines have moved significantly in your favor.
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
