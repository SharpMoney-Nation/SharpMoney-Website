'use client';

import React, { useState, useMemo } from 'react';
import ToolBranding from './ToolBranding';

// ============================================================================
// Arbitrage Calculator
// ============================================================================
// Find and size arbitrage opportunities across sportsbooks.
// Supports:
//   - 2-Way Arb (spread, moneyline, totals — two opposite sides)
//   - 3-Way Arb (soccer moneyline — home / draw / away)
//   - Profit adjustment slider (2-way only) — shift profit toward one side
//     while keeping both sides profitable (never goes red).
// ============================================================================

interface ArbitrageCalculatorProps {
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

type ArbMode = '2-way' | '3-way';

interface ArbSide {
  label: string;
  odds: number;
  decimal: number;
  impliedProb: number;
  stake: number;
  payout: number;
  profit: number;
}

interface ArbResult {
  isArb: boolean;
  totalImpliedProb: number;
  arbPercent: number;
  totalStake: number;
  guaranteedProfit: number;
  roi: number;
  sides: ArbSide[];
}

export default function ArbitrageCalculator({ isMobile }: ArbitrageCalculatorProps) {
  const [mode, setMode] = useState<ArbMode>('2-way');
  const [totalStakeInput, setTotalStakeInput] = useState('100');
  // Slider: 0 = max profit on Side A, 50 = equal, 100 = max profit on Side B
  const [profitSlider, setProfitSlider] = useState(50);

  // 2-way inputs
  const [odds1Input, setOdds1Input] = useState('');
  const [odds2Input, setOdds2Input] = useState('');

  // 3-way inputs
  const [homeOddsInput, setHomeOddsInput] = useState('');
  const [drawOddsInput, setDrawOddsInput] = useState('');
  const [awayOddsInput, setAwayOddsInput] = useState('');

  // Parse inputs based on mode
  const parsedOdds = useMemo(() => {
    if (mode === '2-way') {
      const o1 = parseOdds(odds1Input);
      const o2 = parseOdds(odds2Input);
      if (o1 === null || o2 === null) return null;
      return [
        { label: 'Side A', odds: o1 },
        { label: 'Side B', odds: o2 },
      ];
    } else {
      const home = parseOdds(homeOddsInput);
      const draw = parseOdds(drawOddsInput);
      const away = parseOdds(awayOddsInput);
      if (home === null || draw === null || away === null) return null;
      return [
        { label: 'Home', odds: home },
        { label: 'Draw', odds: draw },
        { label: 'Away', odds: away },
      ];
    }
  }, [mode, odds1Input, odds2Input, homeOddsInput, drawOddsInput, awayOddsInput]);

  const totalStake = parseDollar(totalStakeInput);

  // Calculate arb with profit adjustment for 2-way
  const result: ArbResult | null = useMemo(() => {
    if (parsedOdds === null || totalStake === null) return null;

    const sides: ArbSide[] = parsedOdds.map((s) => {
      const decimal = americanToDecimal(s.odds);
      const impliedProb = americanToImpliedProb(s.odds);
      return {
        label: s.label,
        odds: s.odds,
        decimal,
        impliedProb,
        stake: 0,
        payout: 0,
        profit: 0,
      };
    });

    const totalImpliedProb = sides.reduce((sum, s) => sum + s.impliedProb, 0);
    const isArb = totalImpliedProb < 1;
    const arbPercent = isArb ? ((1 / totalImpliedProb) - 1) * 100 : 0;

    if (isArb && mode === '2-way' && sides.length === 2) {
      // ── 2-Way with profit adjustment slider ──
      const S = totalStake;
      const d1 = sides[0].decimal;
      const d2 = sides[1].decimal;

      // Equal payout (slider = 50)
      const payoutEqual = S / (1 / d1 + 1 / d2);

      // Max payout for Side A (Side B breaks even → payout_B = S)
      // stake_B = S/d2, stake_A = S - S/d2, payout_A = stake_A * d1
      const payoutAMax = (S - S / d2) * d1;

      // Max payout for Side B (Side A breaks even → payout_A = S)
      // stake_A = S/d1, stake_B = S - S/d1, payout_B = stake_B * d2
      const payoutBMax = (S - S / d1) * d2;

      // Interpolate payout_A based on slider
      let payoutA: number;
      if (profitSlider <= 50) {
        // t=0 → payoutAMax, t=50 → payoutEqual
        const t = profitSlider / 50; // 0..1
        payoutA = payoutAMax + t * (payoutEqual - payoutAMax);
      } else {
        // t=50 → payoutEqual, t=100 → S (break-even for A)
        const t = (profitSlider - 50) / 50; // 0..1
        payoutA = payoutEqual + t * (S - payoutEqual);
      }

      const stakeA = payoutA / d1;
      const stakeB = S - stakeA;
      const payoutB = stakeB * d2;

      sides[0].stake = stakeA;
      sides[0].payout = payoutA;
      sides[0].profit = payoutA - S;

      sides[1].stake = stakeB;
      sides[1].payout = payoutB;
      sides[1].profit = payoutB - S;
    } else {
      // ── 3-Way or no-arb: equal distribution ──
      const inverseDecimalSum = sides.reduce((sum, s) => sum + (1 / s.decimal), 0);

      sides.forEach((s) => {
        s.stake = totalStake * (1 / s.decimal) / inverseDecimalSum;
        s.payout = s.stake * s.decimal;
        s.profit = s.payout - totalStake;
      });
    }

    const guaranteedProfit = Math.min(...sides.map((s) => s.profit));
    const roi = (guaranteedProfit / totalStake) * 100;

    return {
      isArb,
      totalImpliedProb,
      arbPercent,
      totalStake,
      guaranteedProfit,
      roi,
      sides,
    };
  }, [parsedOdds, totalStake, profitSlider, mode]);

  const hasAnyInput = mode === '2-way'
    ? !!(odds1Input || odds2Input)
    : !!(homeOddsInput || drawOddsInput || awayOddsInput);

  const allInputsValid = parsedOdds !== null && totalStake !== null;

  return (
    <div className={`${isMobile ? 'px-4' : 'max-w-2xl mx-auto'}`}>
      {/* Description */}
      <div className="mb-6">
        <p className="text-sm text-gray-400 leading-relaxed">
          Enter odds from two (or three) sportsbooks on opposite sides of a market. 
          If the combined implied probability is under 100%, you&apos;ve found an arbitrage — guaranteed profit regardless of outcome.
        </p>
      </div>

      {/* ── Single unified card ── */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
        {/* ── Inputs ── */}
        <div className="p-5 border-b border-gray-700/50">
          {/* Header with branding */}
          <div className="relative flex items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
              Enter Odds
            </h3>
            <div className="absolute inset-0 flex items-center justify-center gap-2 pointer-events-none">
              <img src="/sharpmoney-logo.png" alt="" className="w-7 h-7 object-contain" />
              <span className="text-sm font-semibold text-cyan-400 tracking-widest" style={{ fontFamily: 'Russo One, sans-serif' }}>SHARPMONEY</span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Mode toggle */}
            <div className="flex bg-gray-900 rounded-lg p-0.5 border border-gray-700">
              <button
                onClick={() => { setMode('2-way'); setProfitSlider(50); }}
                className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  mode === '2-way'
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                2-Way
              </button>
              <button
                onClick={() => { setMode('3-way'); setProfitSlider(50); }}
                className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  mode === '3-way'
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                3-Way
              </button>
            </div>

            {/* Odds inputs */}
            {mode === '2-way' ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-white mb-1.5 font-semibold">
                    Side A Odds
                  </label>
                  <input
                    type="text"
                    inputMode="text"
                    value={odds1Input}
                    onChange={(e) => setOdds1Input(e.target.value)}
                    placeholder="+150"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white text-lg font-mono placeholder-gray-600
                      focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white mb-1.5 font-semibold">
                    Side B Odds
                  </label>
                  <input
                    type="text"
                    inputMode="text"
                    value={odds2Input}
                    onChange={(e) => setOdds2Input(e.target.value)}
                    placeholder="-140"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white text-lg font-mono placeholder-gray-600
                      focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm text-white mb-1.5 font-semibold">
                    Home
                  </label>
                  <input
                    type="text"
                    inputMode="text"
                    value={homeOddsInput}
                    onChange={(e) => setHomeOddsInput(e.target.value)}
                    placeholder="+180"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white text-lg font-mono placeholder-gray-600
                      focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white mb-1.5 font-semibold">
                    Draw
                  </label>
                  <input
                    type="text"
                    inputMode="text"
                    value={drawOddsInput}
                    onChange={(e) => setDrawOddsInput(e.target.value)}
                    placeholder="+240"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white text-lg font-mono placeholder-gray-600
                      focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white mb-1.5 font-semibold">
                    Away
                  </label>
                  <input
                    type="text"
                    inputMode="text"
                    value={awayOddsInput}
                    onChange={(e) => setAwayOddsInput(e.target.value)}
                    placeholder="+130"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white text-lg font-mono placeholder-gray-600
                      focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Total stake */}
            <div className="border-t border-gray-700/50 pt-4">
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                Total Stake
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-lg">$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={totalStakeInput}
                  onChange={(e) => setTotalStakeInput(e.target.value)}
                  placeholder="100"
                  className="w-full pl-8 pr-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white text-lg font-mono placeholder-gray-600
                    focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Results ── */}
        <div className="p-5">
          {!allInputsValid ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">
                {hasAnyInput
                  ? 'Enter valid American odds for all sides.'
                  : `Enter odds from ${mode === '2-way' ? 'two' : 'three'} sportsbooks to check for arbitrage.`}
              </p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              {/* Hero section — Arb or No Arb */}
              {result.isArb ? (
                <>
                  {/* Arb found header */}
                  <div className="text-center py-4">
                    <div className="inline-flex items-center gap-2 bg-green-950/30 border border-green-800/30 rounded-full px-4 py-1.5 mb-3">
                      <span className="text-green-400 text-sm">✨</span>
                      <span className="text-green-400 text-xs font-semibold uppercase tracking-wide">Arbitrage Found</span>
                    </div>
                    <p className="text-5xl font-bold font-mono tracking-tight text-green-400">
                      +{result.arbPercent.toFixed(2)}%
                    </p>
                    <p className="text-xs mt-2 text-gray-400 font-medium">
                      guaranteed profit margin
                    </p>
                  </div>

                  {/* Bet this much on each side — prominent cards */}
                  <div className={`grid ${result.sides.length === 3 ? 'grid-cols-3' : 'grid-cols-2'} gap-3`}>
                    {result.sides.map((side) => (
                      <div key={side.label} className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-center">
                        <p className="text-sm text-white uppercase tracking-wide font-bold mb-1">
                          {side.label}
                        </p>
                        <p className="text-gray-400 text-xs font-mono mb-2">{fmtOdds(side.odds)}</p>
                        <p className="text-2xl font-bold font-mono text-cyan-400">
                          ${side.stake.toFixed(2)}
                        </p>
                        <p className="text-xs font-mono text-green-400 mt-1">
                          +${side.profit.toFixed(2)} if wins
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Profit adjustment slider — 2-way only */}
                  {mode === '2-way' && result.sides.length === 2 && (
                    <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
                          Adjust Profit Distribution
                        </p>
                        {profitSlider === 50 && (
                          <span className="text-[10px] text-cyan-500 font-semibold">Equal</span>
                        )}
                        {profitSlider !== 50 && (
                          <button
                            onClick={() => setProfitSlider(50)}
                            className="text-[10px] text-gray-500 hover:text-cyan-400 font-semibold transition-colors"
                          >
                            Reset
                          </button>
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
                      <div className="flex justify-between mt-2">
                        <span className="text-xs text-gray-400 font-semibold">
                          ← {result.sides[0].label}
                        </span>
                        <span className="text-[10px] text-gray-600 font-medium">
                          Equal
                        </span>
                        <span className="text-xs text-gray-400 font-semibold">
                          {result.sides[1].label} →
                        </span>
                      </div>

                      {/* Live profit preview */}
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div className="text-center">
                          <p className="text-xs text-white font-semibold mb-0.5">{result.sides[0].label}</p>
                          <p className="text-sm font-bold font-mono text-green-400">
                            +${result.sides[0].profit.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-white font-semibold mb-0.5">{result.sides[1].label}</p>
                          <p className="text-sm font-bold font-mono text-green-400">
                            +${result.sides[1].profit.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Guaranteed profit callout */}
                  <div className="bg-green-950/20 border border-green-800/30 rounded-xl p-4 text-center">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1">Guaranteed Profit</p>
                    <p className="text-3xl font-bold font-mono text-green-400">
                      +${result.guaranteedProfit.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 font-medium">
                      no matter which side wins
                    </p>
                  </div>

                  {/* Payout by outcome table */}
                  <div className="overflow-hidden rounded-lg border border-gray-700">
                    <div className="bg-gray-900/40 px-4 py-2.5">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold">Payout by Outcome</p>
                    </div>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-900/30">
                          <th className="text-left px-4 py-2 text-gray-500 font-medium text-[10px] uppercase tracking-wide">If This Wins</th>
                          <th className="text-right px-3 py-2 text-gray-500 font-medium text-[10px] uppercase tracking-wide">Payout</th>
                          <th className="text-right px-4 py-2 text-gray-500 font-medium text-[10px] uppercase tracking-wide">Profit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700/30">
                        {result.sides.map((side) => (
                          <tr key={side.label}>
                            <td className="px-4 py-3 text-sm text-white font-semibold">
                              {side.label}
                              <span className="text-gray-500 ml-1.5 text-xs font-normal">({fmtOdds(side.odds)})</span>
                            </td>
                            <td className="px-3 py-3 text-right text-gray-300 font-mono">${side.payout.toFixed(2)}</td>
                            <td className="px-4 py-3 text-right font-mono font-semibold text-green-400">
                              +${side.profit.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-900/40 border border-gray-700/40 rounded-lg p-3 text-center">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold mb-1">Arb %</p>
                      <p className="text-lg font-bold font-mono text-green-400">
                        {result.arbPercent.toFixed(2)}%
                      </p>
                    </div>
                    <div className="bg-gray-900/40 border border-gray-700/40 rounded-lg p-3 text-center">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold mb-1">Total Staked</p>
                      <p className="text-lg font-bold font-mono text-white">
                        ${result.totalStake.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-gray-900/40 border border-gray-700/40 rounded-lg p-3 text-center">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold mb-1">ROI</p>
                      <p className="text-lg font-bold font-mono text-green-400">
                        {result.roi.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* No arb */}
                  <div className="text-center py-4">
                    <div className="inline-flex items-center gap-2 bg-red-950/20 border border-red-800/30 rounded-full px-4 py-1.5 mb-3">
                      <span className="text-red-400 text-sm">✕</span>
                      <span className="text-red-400 text-xs font-semibold uppercase tracking-wide">No Arbitrage</span>
                    </div>
                    <p className="text-3xl font-bold font-mono tracking-tight text-red-400">
                      {((result.totalImpliedProb - 1) * 100).toFixed(2)}% Hold
                    </p>
                    <p className="text-xs mt-2 text-gray-400 font-medium">
                      combined implied probability exceeds 100%
                    </p>
                  </div>

                  {/* Implied probability breakdown */}
                  <div className="overflow-hidden rounded-lg border border-gray-700">
                    <div className="bg-gray-900/40 px-4 py-2.5">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold">Implied Probability</p>
                    </div>
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-gray-700/30">
                        {result.sides.map((side) => (
                          <tr key={side.label}>
                            <td className="px-4 py-2.5 text-sm text-white font-semibold">
                              {side.label}
                              <span className="text-gray-500 ml-1.5 text-xs font-normal">({fmtOdds(side.odds)})</span>
                            </td>
                            <td className="px-4 py-2.5 text-right text-gray-300 font-mono">
                              {(side.impliedProb * 100).toFixed(2)}%
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-red-950/10">
                          <td className="px-4 py-2.5 text-xs font-semibold text-red-400">
                            Total
                          </td>
                          <td className="px-4 py-2.5 text-right font-mono font-semibold text-red-400">
                            {(result.totalImpliedProb * 100).toFixed(2)}%
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* How it works */}
              <div className="bg-gray-900/40 rounded-lg p-4 border border-gray-700/40">
                <p className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold mb-2">How Arbitrage Works</p>
                <div className="space-y-2 text-[11px] text-gray-400 leading-relaxed">
                  <p>
                    <span className="text-gray-300 font-medium">Arbitrage</span> exists when two or more sportsbooks offer odds on opposite sides of a market that, 
                    when combined, imply less than 100% total probability. The gap is your guaranteed profit.
                  </p>
                  <p>
                    <span className="text-gray-300 font-medium">Arb %</span> = (1 ÷ Total Implied Probability) − 1
                  </p>
                  <p>
                    <span className="text-gray-300 font-medium">Stake per side</span> = Total Stake × (1 ÷ Decimal Odds) ÷ Σ(1 ÷ Each Decimal Odds)
                  </p>
                  <p className="text-gray-500 mt-1">
                    By distributing your stake proportionally to the inverse of each side&apos;s decimal odds, 
                    every outcome pays out the same amount — locking in a risk-free profit. Use the slider to shift more profit toward one side while keeping both in the green.
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
