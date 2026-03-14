'use client';

import React, { useState, useMemo } from 'react';
import ToolBranding from './ToolBranding';

// ============================================================================
// EV Calculator
// ============================================================================
// Manually calculate Expected Value for any bet given your bet odds
// and the fair value (no-vig line or true probability).
// ============================================================================

interface EVCalculatorProps {
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

/** Get EV color based on percentage. */
function getEVColor(ev: number): string {
  if (ev > 5) return 'text-green-400';
  if (ev > 0) return 'text-green-300';
  if (ev > -2) return 'text-amber-400';
  return 'text-red-400';
}

/** Get EV label. */
function getEVLabel(ev: number): { label: string; color: string } {
  if (ev > 10) return { label: 'Strong +EV', color: 'text-green-400' };
  if (ev > 5) return { label: 'Good +EV', color: 'text-green-400' };
  if (ev > 2) return { label: 'Moderate +EV', color: 'text-green-300' };
  if (ev > 0) return { label: 'Slight +EV', color: 'text-green-300' };
  if (ev > -2) return { label: 'Near Break-Even', color: 'text-amber-400' };
  if (ev > -5) return { label: 'Negative EV', color: 'text-red-400' };
  return { label: 'Bad Bet', color: 'text-red-400' };
}

type FairValueMode = 'odds' | 'probability';

export default function EVCalculator({ isMobile }: EVCalculatorProps) {
  const [betOddsInput, setBetOddsInput] = useState('');
  const [fairValueMode, setFairValueMode] = useState<FairValueMode>('odds');
  const [fairOddsInput, setFairOddsInput] = useState('');
  const [fairProbInput, setFairProbInput] = useState('');
  const [betAmount, setBetAmount] = useState('100');

  // Parse inputs
  const betOdds = parseOdds(betOddsInput);
  const fairProb = useMemo(() => {
    if (fairValueMode === 'odds') {
      const odds = parseOdds(fairOddsInput);
      return odds !== null ? americanToImpliedProb(odds) : null;
    }
    return parseProbability(fairProbInput);
  }, [fairValueMode, fairOddsInput, fairProbInput]);

  // Calculate EV
  const result = useMemo(() => {
    if (betOdds === null || fairProb === null) return null;

    const decimal = americanToDecimal(betOdds);
    const betImpliedProb = americanToImpliedProb(betOdds);

    // EV% = (decimal * fairProb) - 1
    const evDecimal = (decimal * fairProb) - 1;
    const evPercent = evDecimal * 100;

    // Edge = fairProb - betImpliedProb (as percentage)
    const edge = (fairProb - betImpliedProb) * 100;

    // Kelly Criterion = (decimal * fairProb - 1) / (decimal - 1)
    const kelly = evDecimal / (decimal - 1);
    const kellyPercent = kelly * 100;

    // Bet sizing
    const parsedBet = parseFloat(betAmount);
    const bet = isNaN(parsedBet) || parsedBet <= 0 ? 0 : parsedBet;
    const expectedProfit = bet * evDecimal;
    const winPayout = bet * decimal;
    const winProfit = winPayout - bet;

    return {
      decimal,
      betImpliedProb,
      fairProb,
      evPercent,
      edge,
      kellyPercent,
      kellyHalf: kellyPercent / 2,
      kellyQuarter: kellyPercent / 4,
      bet,
      expectedProfit,
      winPayout,
      winProfit,
    };
  }, [betOdds, fairProb, betAmount]);

  const evInfo = result ? getEVLabel(result.evPercent) : null;

  return (
    <div className={`${isMobile ? 'px-4' : 'max-w-2xl mx-auto'}`}>
      {/* Description */}
      <div className="mb-6">
        <p className="text-sm text-gray-400 leading-relaxed">
          Calculate the Expected Value of any bet by entering your bet odds and the true fair value. 
          Use a no-vig line from a sharp book or enter a probability directly.
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
                  Fair Value ({fairValueMode === 'odds' ? 'No-Vig Odds' : 'True Probability'})
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

            {/* Bet Amount */}
            <div className="border-t border-gray-700/50 pt-4">
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                Bet Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-lg">$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
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
          {betOdds === null || fairProb === null ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">
                {betOddsInput || fairOddsInput || fairProbInput
                  ? 'Enter valid bet odds and fair value.'
                  : 'Enter your bet odds and fair value to calculate EV.'}
              </p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              {/* EV% hero */}
              <div className="text-center py-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-2">Expected Value</p>
                <p className={`text-5xl font-bold font-mono tracking-tight ${getEVColor(result.evPercent)}`}>
                  {result.evPercent > 0 ? '+' : ''}{result.evPercent.toFixed(2)}%
                </p>
                {evInfo && (
                  <p className={`text-xs mt-2 font-medium ${evInfo.color}`}>
                    {evInfo.label}
                  </p>
                )}
              </div>

              {/* Main results table */}
              <div className="overflow-hidden rounded-lg border border-gray-700">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-700/30">
                    <tr>
                      <td className="px-4 py-3 text-xs text-gray-400 font-medium">Your Odds</td>
                      <td className="px-4 py-3 text-right text-white font-mono font-semibold">
                        {fmtOdds(betOdds)} <span className="text-gray-500 text-[11px]">({result.decimal.toFixed(2)})</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-xs text-gray-400 font-medium">Implied Probability</td>
                      <td className="px-4 py-3 text-right text-gray-300 font-mono">
                        {(result.betImpliedProb * 100).toFixed(2)}%
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-xs text-gray-400 font-medium">Fair (True) Probability</td>
                      <td className="px-4 py-3 text-right text-cyan-300 font-mono font-semibold">
                        {(result.fairProb * 100).toFixed(2)}%
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-xs text-gray-400 font-medium">Edge</td>
                      <td className={`px-4 py-3 text-right font-mono font-semibold ${result.edge > 0 ? 'text-green-400' : result.edge > -2 ? 'text-amber-400' : 'text-red-400'}`}>
                        {result.edge > 0 ? '+' : ''}{result.edge.toFixed(2)}%
                      </td>
                    </tr>
                    <tr className={`${result.evPercent > 0 ? 'bg-green-950/20' : result.evPercent > -2 ? 'bg-amber-950/10' : 'bg-red-950/10'}`}>
                      <td className={`px-4 py-3 text-xs font-semibold ${getEVColor(result.evPercent)}`}>Expected Value</td>
                      <td className={`px-4 py-3 text-right font-mono font-semibold ${getEVColor(result.evPercent)}`}>
                        {result.evPercent > 0 ? '+' : ''}{result.evPercent.toFixed(2)}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Kelly Criterion */}
              <div className="overflow-hidden rounded-lg border border-gray-700">
                <div className="bg-gray-900/40 px-4 py-2.5">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold">Kelly Criterion (% of Bankroll)</p>
                </div>
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-700/30">
                    <tr>
                      <td className="px-4 py-2.5 text-xs text-gray-400 font-medium">Full Kelly</td>
                      <td className="px-4 py-2.5 text-right font-mono font-semibold text-white">
                        {result.kellyPercent > 0 ? `${result.kellyPercent.toFixed(2)}%` : '—'}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-xs text-gray-400 font-medium">Half Kelly</td>
                      <td className="px-4 py-2.5 text-right font-mono font-semibold text-cyan-300">
                        {result.kellyHalf > 0 ? `${result.kellyHalf.toFixed(2)}%` : '—'}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-xs text-gray-400 font-medium">Quarter Kelly</td>
                      <td className="px-4 py-2.5 text-right font-mono font-semibold text-gray-300">
                        {result.kellyQuarter > 0 ? `${result.kellyQuarter.toFixed(2)}%` : '—'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Payout section */}
              {result.bet > 0 && (
                <div className="overflow-hidden rounded-lg border border-gray-700">
                  <div className="bg-gray-900/40 px-4 py-2.5">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold">If You Win</p>
                  </div>
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-gray-700/30">
                      <tr>
                        <td className="px-4 py-2.5 text-xs text-gray-400 font-medium">Wager</td>
                        <td className="px-4 py-2.5 text-right text-white font-mono font-semibold">
                          ${result.bet.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 text-xs text-gray-400 font-medium">Total Payout</td>
                        <td className="px-4 py-2.5 text-right text-white font-mono font-semibold">
                          ${result.winPayout.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 text-xs text-gray-400 font-medium">Win Profit</td>
                        <td className="px-4 py-2.5 text-right text-green-400 font-mono font-semibold">
                          +${result.winProfit.toFixed(2)}
                        </td>
                      </tr>
                      <tr className="bg-cyan-950/20">
                        <td className="px-4 py-2.5 text-xs text-cyan-400 font-semibold">Expected Profit / Bet</td>
                        <td className={`px-4 py-2.5 text-right font-mono font-semibold ${result.expectedProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {result.expectedProfit >= 0 ? '+' : ''}${result.expectedProfit.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* How it works */}
              <div className="bg-gray-900/40 rounded-lg p-4 border border-gray-700/40">
                <p className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold mb-2">How EV Is Calculated</p>
                <div className="space-y-1.5 text-[11px] text-gray-400 leading-relaxed">
                  <p>
                    <span className="text-gray-300 font-medium">EV%</span> = (Decimal Odds × Fair Probability) − 1
                  </p>
                  <p>
                    <span className="text-gray-300 font-medium">Edge</span> = Fair Probability − Implied Probability
                  </p>
                  <p>
                    <span className="text-gray-300 font-medium">Kelly%</span> = EV / (Decimal Odds − 1)
                  </p>
                  <p className="text-gray-500 mt-2">
                    A positive EV% means the bet has long-term value. The Kelly Criterion suggests how much of your bankroll to wager based on your edge.
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
