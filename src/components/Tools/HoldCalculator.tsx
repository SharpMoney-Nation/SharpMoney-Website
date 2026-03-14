'use client';

import React, { useState, useMemo } from 'react';
import ToolBranding from './ToolBranding';

// ============================================================================
// Hold % Calculator
// ============================================================================
// See how much juice/vig a sportsbook is charging on a market.
// Supports 2-way and 3-way markets (e.g., soccer moneyline with draw).
// ============================================================================

interface HoldCalculatorProps {
  isMobile: boolean;
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

/** Format a probability as a percentage string. */
function fmtProb(p: number): string {
  return `${(p * 100).toFixed(2)}%`;
}

/** Format American odds with + prefix for positive. */
function fmtOdds(odds: number): string {
  if (odds > 0) return `+${odds}`;
  return `${odds}`;
}

/** Convert a probability (0-1) back to American odds. */
function probabilityToAmerican(prob: number): number {
  if (prob <= 0 || prob >= 1) return 0;
  if (Math.abs(prob - 0.5) < 1e-9) return -100;
  if (prob > 0.5) {
    return Math.round((-prob / (1 - prob)) * 100);
  }
  return Math.round(((1 - prob) / prob) * 100);
}

/** Get a hold severity color based on the percentage. */
function getHoldColor(hold: number): string {
  if (hold <= 2) return 'text-green-400';
  if (hold <= 5) return 'text-cyan-400';
  if (hold <= 8) return 'text-amber-400';
  return 'text-red-400';
}

/** Get a hold severity label. */
function getHoldLabel(hold: number): { label: string; color: string } {
  if (hold <= 2) return { label: 'Very Low (Sharp)', color: 'text-green-400' };
  if (hold <= 4) return { label: 'Low', color: 'text-green-300' };
  if (hold <= 6) return { label: 'Average', color: 'text-cyan-400' };
  if (hold <= 8) return { label: 'Above Average', color: 'text-amber-400' };
  if (hold <= 12) return { label: 'High', color: 'text-amber-500' };
  return { label: 'Very High', color: 'text-red-400' };
}

interface OutcomeRow {
  id: number;
  label: string;
  input: string;
}

let nextId = 3;

export default function HoldCalculator({ isMobile }: HoldCalculatorProps) {
  const [outcomes, setOutcomes] = useState<OutcomeRow[]>([
    { id: 1, label: 'Side A', input: '' },
    { id: 2, label: 'Side B', input: '' },
  ]);

  // Parse all inputs
  const parsed = useMemo(() => {
    return outcomes.map((o) => ({
      ...o,
      odds: parseOdds(o.input),
      prob: parseOdds(o.input) !== null ? americanToImpliedProb(parseOdds(o.input)!) : null,
    }));
  }, [outcomes]);

  const allValid = parsed.every((p) => p.odds !== null);
  const validCount = parsed.filter((p) => p.odds !== null).length;

  // Calculate hold
  const result = useMemo(() => {
    if (!allValid || validCount < 2) return null;

    const totalImplied = parsed.reduce((sum, p) => sum + (p.prob || 0), 0);
    const holdPercent = (totalImplied - 1) * 100;

    // Fair (no-vig) probabilities using multiplicative method
    const fairProbs = parsed.map((p) => (p.prob || 0) / totalImplied);

    return {
      totalImplied,
      holdPercent,
      fairProbs,
    };
  }, [parsed, allValid, validCount]);

  const updateOutcome = (id: number, value: string) => {
    setOutcomes((prev) => prev.map((o) => (o.id === id ? { ...o, input: value } : o)));
  };

  const addOutcome = () => {
    if (outcomes.length >= 3) return;
    setOutcomes((prev) => [...prev, { id: nextId++, label: 'Draw / Tie', input: '' }]);
  };

  const removeOutcome = (id: number) => {
    if (outcomes.length <= 2) return;
    setOutcomes((prev) => {
      const filtered = prev.filter((o) => o.id !== id);
      const labels = ['Side A', 'Side B', 'Draw / Tie'];
      return filtered.map((o, i) => ({ ...o, label: labels[i] || `Side ${i + 1}` }));
    });
  };

  const holdInfo = result ? getHoldLabel(result.holdPercent) : null;

  return (
    <div className={`${isMobile ? 'px-4' : 'max-w-2xl mx-auto'}`}>
      {/* Description */}
      <div className="mb-6">
        <p className="text-sm text-gray-400 leading-relaxed">
          Enter the odds for every outcome in a market to see how much juice the sportsbook is charging. 
          Works with 2-way markets (spreads, totals, moneylines) and 3-way markets (soccer).
        </p>
      </div>

      {/* ── Single unified card ── */}
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

          <div className="space-y-3">
            {outcomes.map((outcome, idx) => (
              <div key={outcome.id} className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                    {outcome.label}
                  </label>
                  <input
                    type="text"
                    inputMode="text"
                    value={outcome.input}
                    onChange={(e) => updateOutcome(outcome.id, e.target.value)}
                    placeholder={idx === 0 ? '-110' : idx === 1 ? '-110' : '+250'}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white text-lg font-mono placeholder-gray-600
                      focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                  />
                </div>
                {outcomes.length > 2 && (
                  <button
                    onClick={() => removeOutcome(outcome.id)}
                    className="px-2 py-3 text-gray-500 hover:text-red-400 transition-colors"
                    title="Remove"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add outcome button */}
          {outcomes.length < 3 && (
            <button
              onClick={addOutcome}
              className="mt-3 flex items-center gap-1.5 text-xs text-cyan-500 hover:text-cyan-400 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v8M8 12h8" />
              </svg>
              Add Draw / Tie (3-way market)
            </button>
          )}
        </div>

        {/* ── Results ── */}
        <div className="p-5">
          {!allValid || validCount < 2 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">
                {outcomes.some((o) => o.input)
                  ? 'Enter valid American odds for all sides.'
                  : 'Enter odds for all sides to see the hold.'}
              </p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              {/* Hold % hero */}
              <div className="text-center py-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-2">Book Hold</p>
                <p className={`text-5xl font-bold font-mono tracking-tight ${getHoldColor(result.holdPercent)}`}>
                  {result.holdPercent.toFixed(2)}%
                </p>
                {holdInfo && (
                  <p className={`text-xs mt-2 font-medium ${holdInfo.color}`}>
                    {holdInfo.label}
                  </p>
                )}
              </div>

              {/* Breakdown table */}
              <div className="overflow-hidden rounded-lg border border-gray-700">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-900/60">
                      <th className="text-left px-4 py-2.5 text-gray-500 font-medium text-[10px] uppercase tracking-wide">
                        Outcome
                      </th>
                      <th className="text-center px-3 py-2.5 text-gray-500 font-medium text-[10px] uppercase tracking-wide">
                        Odds
                      </th>
                      <th className="text-center px-3 py-2.5 text-gray-500 font-medium text-[10px] uppercase tracking-wide">
                        Implied Prob.
                      </th>
                      <th className="text-center px-3 py-2.5 text-gray-500 font-medium text-[10px] uppercase tracking-wide">
                        No-Vig Odds
                      </th>
                      <th className="text-center px-3 py-2.5 text-gray-500 font-medium text-[10px] uppercase tracking-wide">
                        No-Vig Prob.
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/30">
                    {parsed.map((p, idx) => {
                      const fairProb = result.fairProbs[idx];
                      const fairOdds = fairProb !== undefined ? probabilityToAmerican(fairProb) : null;
                      return (
                        <tr key={p.id}>
                          <td className="px-4 py-3 text-xs text-gray-400 font-medium">{p.label}</td>
                          <td className="px-3 py-3 text-center text-white font-mono font-semibold">
                            {p.odds !== null ? fmtOdds(p.odds) : '—'}
                          </td>
                          <td className="px-3 py-3 text-center text-gray-300 font-mono">
                            {p.prob !== null ? fmtProb(p.prob) : '—'}
                          </td>
                          <td className="px-3 py-3 text-center text-cyan-300 font-mono font-semibold">
                            {fairOdds !== null ? fmtOdds(fairOdds) : '—'}
                          </td>
                          <td className="px-3 py-3 text-center text-cyan-300 font-mono">
                            {fairProb !== undefined ? fmtProb(fairProb) : '—'}
                          </td>
                        </tr>
                      );
                    })}
                    {/* Totals row */}
                    <tr className="bg-gray-900/40">
                      <td className="px-4 py-3 text-xs text-gray-400 font-semibold">Total</td>
                      <td className="px-3 py-3 text-center text-gray-500">—</td>
                      <td className="px-3 py-3 text-center text-amber-400 font-mono font-semibold">
                        {fmtProb(result.totalImplied)}
                      </td>
                      <td className="px-3 py-3 text-center text-gray-500">—</td>
                      <td className="px-3 py-3 text-center text-cyan-400 font-mono font-semibold">
                        100.00%
                      </td>
                    </tr>
                  </tbody>
                </table>
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
