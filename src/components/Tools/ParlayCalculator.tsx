'use client';

import React, { useState, useMemo } from 'react';
import ToolBranding from './ToolBranding';

// ============================================================================
// Parlay Calculator
// ============================================================================
// Calculate combined parlay odds and payouts across multiple legs.
// ============================================================================

interface ParlayCalculatorProps {
  isMobile: boolean;
}

interface ParlayLeg {
  id: number;
  input: string;
}

let nextLegId = 3;

/** Convert American odds to decimal odds. */
function americanToDecimal(odds: number): number {
  if (odds >= 100) return (odds / 100) + 1;
  return (100 / Math.abs(odds)) + 1;
}

/** Convert decimal odds to American odds. */
function decimalToAmerican(decimal: number): number {
  if (decimal >= 2) return Math.round((decimal - 1) * 100);
  return Math.round(-100 / (decimal - 1));
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

/** Format American odds with + prefix for positive. */
function fmtOdds(odds: number): string {
  if (odds > 0) return `+${odds}`;
  return `${odds}`;
}

export default function ParlayCalculator({ isMobile }: ParlayCalculatorProps) {
  const [legs, setLegs] = useState<ParlayLeg[]>([
    { id: 1, input: '' },
    { id: 2, input: '' },
  ]);
  const [betAmount, setBetAmount] = useState('100');

  // Parse all leg inputs
  const parsedLegs = useMemo(() => {
    return legs.map((leg) => ({
      ...leg,
      odds: parseOdds(leg.input),
    }));
  }, [legs]);

  const validLegs = parsedLegs.filter((l) => l.odds !== null);
  const allValid = parsedLegs.every((l) => l.odds !== null) && parsedLegs.length >= 2;

  // Calculate parlay
  const result = useMemo(() => {
    if (validLegs.length < 2) return null;

    // Parlay decimal odds = product of individual decimal odds
    const combinedDecimal = validLegs.reduce((prod, leg) => {
      return prod * americanToDecimal(leg.odds!);
    }, 1);

    const combinedAmerican = decimalToAmerican(combinedDecimal);
    const impliedProb = 1 / combinedDecimal;

    const parsedBet = parseFloat(betAmount);
    const bet = isNaN(parsedBet) || parsedBet <= 0 ? 0 : parsedBet;
    const totalPayout = combinedDecimal * bet;
    const profit = totalPayout - bet;

    return {
      combinedDecimal,
      combinedAmerican,
      impliedProb,
      bet,
      totalPayout,
      profit,
      legCount: validLegs.length,
    };
  }, [validLegs, betAmount]);

  const updateLeg = (id: number, value: string) => {
    setLegs((prev) => prev.map((l) => (l.id === id ? { ...l, input: value } : l)));
  };

  const addLeg = () => {
    if (legs.length >= 15) return;
    setLegs((prev) => [...prev, { id: nextLegId++, input: '' }]);
  };

  const removeLeg = (id: number) => {
    if (legs.length <= 2) return;
    setLegs((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <div className={`${isMobile ? 'px-4' : 'max-w-2xl mx-auto'}`}>
      {/* Description */}
      <div className="mb-6">
        <p className="text-sm text-gray-400 leading-relaxed">
          Enter the American odds for each leg to calculate combined parlay odds, implied probability, and payout.
        </p>
      </div>

      {/* ── Single unified card ── */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
        {/* ── Header + Inputs ── */}
        <div className="p-5 border-b border-gray-700/50">
          <div className="relative flex items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
              Parlay Legs
            </h3>
            <div className="absolute inset-0 flex items-center justify-center gap-2 pointer-events-none">
              <img src="/sharpmoney-logo.png" alt="" className="w-7 h-7 object-contain" />
              <span className="text-sm font-semibold text-cyan-400 tracking-widest" style={{ fontFamily: 'Russo One, sans-serif' }}>SHARPMONEY</span>
            </div>
          </div>

          {/* Leg inputs */}
          <div className="space-y-3">
            {legs.map((leg, idx) => (
              <div key={leg.id} className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                    Leg {idx + 1}
                  </label>
                  <input
                    type="text"
                    inputMode="text"
                    value={leg.input}
                    onChange={(e) => updateLeg(leg.id, e.target.value)}
                    placeholder={idx === 0 ? '-110' : idx === 1 ? '+150' : '-200'}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white text-lg font-mono placeholder-gray-600
                      focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                  />
                </div>
                {legs.length > 2 && (
                  <button
                    onClick={() => removeLeg(leg.id)}
                    className="px-2 py-3 text-gray-500 hover:text-red-400 transition-colors"
                    title="Remove leg"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add leg button */}
          {legs.length < 15 && (
            <button
              onClick={addLeg}
              className="mt-3 flex items-center gap-1.5 text-xs text-cyan-500 hover:text-cyan-400 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v8M8 12h8" />
              </svg>
              Add leg
            </button>
          )}

          {/* Bet Amount */}
          <div className="border-t border-gray-700/50 mt-5 pt-5">
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

        {/* ── Results ── */}
        <div className="p-5">
          {validLegs.length < 2 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">
                {legs.some((l) => l.input)
                  ? 'Enter valid American odds for at least 2 legs.'
                  : 'Enter odds for each leg to calculate the parlay.'}
              </p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              {/* Parlay odds hero */}
              <div className="text-center py-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-2">
                  {result.legCount}-Leg Parlay Odds
                </p>
                <p className="text-5xl font-bold font-mono tracking-tight text-cyan-400">
                  {fmtOdds(result.combinedAmerican)}
                </p>
              </div>

              {/* Leg breakdown table */}
              <div className="overflow-hidden rounded-lg border border-gray-700">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-900/60">
                      <th className="text-left px-4 py-2.5 text-gray-500 font-medium text-[10px] uppercase tracking-wide">
                        Leg
                      </th>
                      <th className="text-center px-3 py-2.5 text-gray-500 font-medium text-[10px] uppercase tracking-wide">
                        American
                      </th>
                      <th className="text-center px-3 py-2.5 text-gray-500 font-medium text-[10px] uppercase tracking-wide">
                        Decimal
                      </th>
                      <th className="text-center px-3 py-2.5 text-gray-500 font-medium text-[10px] uppercase tracking-wide">
                        Implied Prob.
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/30">
                    {validLegs.map((leg, idx) => {
                      const decimal = americanToDecimal(leg.odds!);
                      const prob = americanToImpliedProb(leg.odds!);
                      return (
                        <tr key={leg.id}>
                          <td className="px-4 py-3 text-xs text-gray-400 font-medium">Leg {idx + 1}</td>
                          <td className="px-3 py-3 text-center text-white font-mono font-semibold">
                            {fmtOdds(leg.odds!)}
                          </td>
                          <td className="px-3 py-3 text-center text-gray-300 font-mono">
                            {decimal.toFixed(2)}
                          </td>
                          <td className="px-3 py-3 text-center text-gray-300 font-mono">
                            {(prob * 100).toFixed(2)}%
                          </td>
                        </tr>
                      );
                    })}
                    {/* Combined row */}
                    <tr className="bg-gray-900/40">
                      <td className="px-4 py-3 text-xs text-cyan-400 font-semibold">Parlay</td>
                      <td className="px-3 py-3 text-center text-cyan-300 font-mono font-semibold">
                        {fmtOdds(result.combinedAmerican)}
                      </td>
                      <td className="px-3 py-3 text-center text-cyan-300 font-mono font-semibold">
                        {result.combinedDecimal.toFixed(2)}
                      </td>
                      <td className="px-3 py-3 text-center text-cyan-300 font-mono font-semibold">
                        {(result.impliedProb * 100).toFixed(2)}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Payout section */}
              {result.bet > 0 && (
                <div className="overflow-hidden rounded-lg border border-gray-700">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-gray-700/30">
                        <td className="px-4 py-3 text-xs text-gray-400 font-medium">Wager</td>
                        <td className="px-4 py-3 text-right text-white font-mono font-semibold">
                          ${result.bet.toFixed(2)}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-700/30">
                        <td className="px-4 py-3 text-xs text-gray-400 font-medium">Total Payout</td>
                        <td className="px-4 py-3 text-right text-white font-mono font-semibold">
                          ${result.totalPayout.toFixed(2)}
                        </td>
                      </tr>
                      <tr className="bg-cyan-950/20">
                        <td className="px-4 py-3 text-xs text-cyan-400 font-semibold">Profit</td>
                        <td className="px-4 py-3 text-right text-cyan-300 font-mono font-semibold">
                          ${result.profit.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* Branding */}
      <ToolBranding className="mt-6" />
    </div>
  );
}
