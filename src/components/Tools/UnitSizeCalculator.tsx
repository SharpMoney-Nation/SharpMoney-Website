'use client';

import React, { useState, useMemo } from 'react';
import ToolBranding from './ToolBranding';

// ============================================================================
// Unit Size Calculator
// ============================================================================
// Determine your unit size and recommended bet ranges from your bankroll.
// Enter your bankroll, pick a unit % (or custom), and see bet sizing tiers.
// ============================================================================

interface UnitSizeCalculatorProps {
  isMobile: boolean;
}

/** Parse a dollar amount. Returns null if invalid. */
function parseDollar(input: string): number | null {
  const trimmed = input.trim().replace(/[$,]/g, '');
  if (trimmed === '') return null;
  const num = Number(trimmed);
  if (isNaN(num) || num <= 0) return null;
  return num;
}

/** Format a dollar amount with commas. */
function fmtDollar(amount: number): string {
  if (amount >= 1000) {
    return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return '$' + amount.toFixed(2);
}

// Preset unit % options
const UNIT_PRESETS = [
  { label: '0.5%', value: 0.5, description: 'Conservative — maximum protection against variance', recommended: false },
  { label: '1%', value: 1, description: 'Recommended — best balance of growth and bankroll safety for most bettors', recommended: true },
  { label: '2%', value: 2, description: 'Moderate — higher risk, requires a consistent winning record', recommended: false },
  { label: '3%', value: 3, description: 'Aggressive — only for experienced bettors with a proven edge', recommended: false },
  { label: '5%', value: 5, description: 'Not recommended — extreme variance, high bust risk', recommended: false },
];

// Bet sizing tiers
const BET_TIERS = [
  { label: '0.25u', multiplier: 0.25, description: 'Low-confidence lean' },
  { label: '0.5u', multiplier: 0.5, description: 'Below-average confidence' },
  { label: '1u', multiplier: 1, description: 'Standard bet', highlighted: true },
  { label: '1.5u', multiplier: 1.5, description: 'Above-average edge' },
  { label: '2u', multiplier: 2, description: 'Strong edge / high conviction' },
  { label: '3u', multiplier: 3, description: 'Max bet — only for elite edges' },
];

export default function UnitSizeCalculator({ isMobile }: UnitSizeCalculatorProps) {
  const [bankrollInput, setBankrollInput] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(1); // index into UNIT_PRESETS (default: 1% Recommended)
  const [customMode, setCustomMode] = useState(false);
  const [customPercentInput, setCustomPercentInput] = useState('');

  // Parse bankroll
  const bankroll = useMemo(() => parseDollar(bankrollInput), [bankrollInput]);

  // Determine active unit %
  const unitPercent = useMemo(() => {
    if (customMode) {
      const trimmed = customPercentInput.trim().replace(/%$/, '');
      if (trimmed === '') return null;
      const num = Number(trimmed);
      if (isNaN(num) || num <= 0 || num > 100) return null;
      return num;
    }
    return UNIT_PRESETS[selectedPreset].value;
  }, [customMode, customPercentInput, selectedPreset]);

  // Calculate results
  const result = useMemo(() => {
    if (bankroll === null || unitPercent === null) return null;

    const unitSize = bankroll * (unitPercent / 100);

    const tiers = BET_TIERS.map((tier) => ({
      ...tier,
      amount: unitSize * tier.multiplier,
    }));

    // How many units the bankroll contains
    const totalUnits = bankroll / unitSize;

    return {
      unitSize,
      unitPercent,
      totalUnits,
      tiers,
    };
  }, [bankroll, unitPercent]);

  // Severity label for unit %
  const severityLabel = useMemo(() => {
    if (unitPercent === null) return null;
    if (unitPercent <= 0.5) return { text: 'Conservative', color: 'text-green-400', bg: 'bg-green-950/20 border-green-800/30' };
    if (unitPercent <= 1) return { text: 'Recommended', color: 'text-cyan-400', bg: 'bg-cyan-950/20 border-cyan-800/30' };
    if (unitPercent <= 2) return { text: 'Moderate', color: 'text-amber-400', bg: 'bg-amber-950/20 border-amber-800/30' };
    if (unitPercent <= 3) return { text: 'Aggressive', color: 'text-orange-400', bg: 'bg-orange-950/20 border-orange-800/30' };
    return { text: 'Not Recommended', color: 'text-red-400', bg: 'bg-red-950/20 border-red-800/30' };
  }, [unitPercent]);

  return (
    <div className={`${isMobile ? 'px-4' : 'max-w-2xl mx-auto'}`}>
      {/* Description */}
      <div className="mb-6">
        <p className="text-sm text-gray-400 leading-relaxed">
          A &quot;unit&quot; is a fixed percentage of your bankroll that you use as your standard bet size. 
          Enter your bankroll below to see your unit size and a full bet sizing guide.
        </p>
      </div>

      {/* ── Single unified card ── */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
        {/* ── Inputs ── */}
        <div className="p-5 border-b border-gray-700/50">
          <div className="relative flex items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
              Your Bankroll
            </h3>
            <div className="absolute inset-0 flex items-center justify-center gap-2 pointer-events-none">
              <img src="/sharpmoney-logo.png" alt="" className="w-7 h-7 object-contain" />
              <span className="text-sm font-semibold text-cyan-400 tracking-widest" style={{ fontFamily: 'Russo One, sans-serif' }}>SHARPMONEY</span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Bankroll input */}
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                Total Bankroll
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

            {/* Unit % selection */}
            <div className="border-t border-gray-700/50 pt-4">
              <label className="block text-xs text-gray-400 mb-2.5 font-medium">
                Unit Size (% of Bankroll)
              </label>

              {/* Preset pills */}
              <div className="flex flex-wrap gap-2 mb-3">
                {UNIT_PRESETS.map((preset, idx) => (
                  <button
                    key={preset.value}
                    onClick={() => {
                      setSelectedPreset(idx);
                      setCustomMode(false);
                    }}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-colors ${
                      !customMode && selectedPreset === idx
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                        : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                    }`}
                  >
                    {preset.label}
                    {preset.recommended && <span className="ml-1 text-[10px] text-cyan-600">★</span>}
                  </button>
                ))}
                <button
                  onClick={() => setCustomMode(true)}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-colors ${
                    customMode
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                      : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                  }`}
                >
                  Custom
                </button>
              </div>

              {/* Custom input */}
              {customMode && (
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={customPercentInput}
                    onChange={(e) => setCustomPercentInput(e.target.value)}
                    placeholder="2.5"
                    className="w-full px-4 py-3 pr-8 bg-gray-900 border border-gray-600 rounded-lg text-white text-lg font-mono placeholder-gray-600
                      focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-lg">%</span>
                </div>
              )}

              {/* Description for selected preset */}
              {!customMode && (
                <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">
                  {UNIT_PRESETS[selectedPreset].description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Results ── */}
        <div className="p-5">
          {bankroll === null || unitPercent === null ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">
                {bankrollInput
                  ? customMode && !customPercentInput
                    ? 'Enter your custom unit percentage.'
                    : 'Enter a valid bankroll amount.'
                  : 'Enter your bankroll to calculate your unit size.'}
              </p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              {/* Unit size hero */}
              <div className="text-center py-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-2">
                  Your 1 Unit
                </p>
                <p className="text-5xl font-bold font-mono tracking-tight text-cyan-400">
                  {fmtDollar(result.unitSize)}
                </p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  {severityLabel && (
                    <span className={`text-xs font-semibold ${severityLabel.color}`}>
                      {severityLabel.text}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    ({result.unitPercent}% of {fmtDollar(bankroll)})
                  </span>
                </div>
              </div>

              {/* Bankroll context */}
              <div className="overflow-hidden rounded-lg border border-gray-700">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-700/30">
                    <tr>
                      <td className="px-4 py-2.5 text-xs text-gray-400 font-medium">Bankroll</td>
                      <td className="px-4 py-2.5 text-right text-white font-mono font-semibold">
                        {fmtDollar(bankroll)}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-xs text-gray-400 font-medium">Unit %</td>
                      <td className="px-4 py-2.5 text-right text-cyan-300 font-mono font-semibold">
                        {result.unitPercent}%
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-xs text-gray-400 font-medium">1 Unit</td>
                      <td className="px-4 py-2.5 text-right text-cyan-300 font-mono font-semibold">
                        {fmtDollar(result.unitSize)}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-xs text-gray-400 font-medium">Total Units in Bankroll</td>
                      <td className="px-4 py-2.5 text-right text-white font-mono font-semibold">
                        {result.totalUnits.toFixed(1)}u
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Bet Sizing Guide */}
              <div className="overflow-hidden rounded-lg border border-gray-700">
                <div className="bg-gray-900/40 px-4 py-2.5">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold">Bet Sizing Guide</p>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-900/30">
                      <th className="text-left px-4 py-2 text-gray-500 font-medium text-[10px] uppercase tracking-wide">
                        Size
                      </th>
                      <th className="text-center px-3 py-2 text-gray-500 font-medium text-[10px] uppercase tracking-wide">
                        Amount
                      </th>
                      <th className="text-right px-4 py-2 text-gray-500 font-medium text-[10px] uppercase tracking-wide">
                        When to Use
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/30">
                    {result.tiers.map((tier) => (
                      <tr
                        key={tier.label}
                        className={tier.highlighted ? 'bg-cyan-950/10 border-l-2 border-l-cyan-500' : ''}
                      >
                        <td className={`px-4 py-2.5 text-xs font-semibold ${
                          tier.highlighted ? 'text-cyan-400' : 'text-gray-400'
                        }`}>
                          {tier.label}
                          {tier.highlighted && <span className="text-cyan-600 ml-1 text-[10px]">★</span>}
                        </td>
                        <td className={`px-3 py-2.5 text-center font-mono font-semibold ${
                          tier.highlighted ? 'text-cyan-300' : 'text-white'
                        }`}>
                          {fmtDollar(tier.amount)}
                        </td>
                        <td className="px-4 py-2.5 text-right text-[11px] text-gray-500">
                          {tier.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Risk Warning based on unit % */}
              {unitPercent > 3 && (
                <div className={`rounded-lg p-4 border ${severityLabel?.bg || 'bg-amber-950/20 border-amber-800/30'}`}>
                  <p className={`text-sm font-semibold ${severityLabel?.color || 'text-amber-400'}`}>
                    ⚠️ High Risk Warning
                  </p>
                  <p className={`text-xs mt-1 ${severityLabel?.color || 'text-amber-400'} opacity-70`}>
                    A {unitPercent}% unit size means a 10-unit downswing would cost you {(unitPercent * 10).toFixed(0)}% of your 
                    bankroll ({fmtDollar(result.unitSize * 10)}). Even sharp bettors experience 10+ unit drawdowns regularly. 
                    Consider a smaller unit size unless you have a proven, high-volume edge.
                  </p>
                </div>
              )}

              {/* Educational content */}
              <div className="bg-gray-900/40 rounded-lg p-4 border border-gray-700/40">
                <p className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold mb-2">What is a Unit?</p>
                <div className="space-y-2 text-[11px] text-gray-400 leading-relaxed">
                  <p>
                    A <span className="text-gray-300 font-medium">unit</span> is a fixed percentage of your bankroll that represents your standard bet size. 
                    Using units instead of flat dollar amounts keeps your bets proportional to your bankroll — as your bankroll grows, your bets grow with it, 
                    and as it shrinks, you naturally bet less.
                  </p>
                  <p>
                    <span className="text-cyan-400 font-medium">0.5–1%</span> is the most common range for serious bettors. 
                    At 1%, you can withstand a 50-unit losing streak and only lose half your bankroll. 
                    At 0.5%, you&apos;d only lose 25%. At 2%+, that same streak wipes you out.
                  </p>
                  <p>
                    <span className="text-gray-300 font-medium">Pro tip:</span> Reassess your unit size when your bankroll changes by more than 25% in either direction. 
                    If you started with $5,000 and grew to $6,500 — recalculate. If you dropped to $3,500 — recalculate.
                  </p>
                </div>
              </div>

              {/* Drawdown table */}
              <div className="bg-gray-900/40 rounded-lg p-4 border border-gray-700/40">
                <p className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold mb-2">Drawdown Risk</p>
                <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">
                  Even profitable bettors experience losing streaks. Here&apos;s what different drawdowns look like at your current unit size:
                </p>
                <div className="overflow-hidden rounded-lg border border-gray-700/50">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-900/60">
                        <th className="text-left px-3 py-2 text-gray-500 font-medium text-[10px] uppercase tracking-wide">
                          Losing Streak
                        </th>
                        <th className="text-center px-3 py-2 text-gray-500 font-medium text-[10px] uppercase tracking-wide">
                          Loss
                        </th>
                        <th className="text-right px-3 py-2 text-gray-500 font-medium text-[10px] uppercase tracking-wide">
                          Remaining
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/30">
                      {[10, 20, 30, 40, 50].map((streak) => {
                        const loss = result.unitSize * streak;
                        const remaining = bankroll - loss;
                        const pctLost = (loss / bankroll) * 100;
                        const busted = remaining <= 0;
                        return (
                          <tr key={streak} className={busted ? 'bg-red-950/10' : ''}>
                            <td className="px-3 py-2 text-xs text-gray-400 font-medium">{streak} units</td>
                            <td className={`px-3 py-2 text-center font-mono text-xs font-semibold ${
                              busted ? 'text-red-400' : pctLost > 50 ? 'text-red-400' : pctLost > 25 ? 'text-amber-400' : 'text-gray-300'
                            }`}>
                              −{fmtDollar(Math.min(loss, bankroll))} <span className="text-gray-600">({Math.min(pctLost, 100).toFixed(0)}%)</span>
                            </td>
                            <td className={`px-3 py-2 text-right font-mono text-xs font-semibold ${
                              busted ? 'text-red-400' : 'text-gray-300'
                            }`}>
                              {busted ? '💀 Busted' : fmtDollar(remaining)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
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
