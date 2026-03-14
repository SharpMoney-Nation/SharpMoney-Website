'use client';

import React, { useState, useMemo } from 'react';
import ToolBranding from './ToolBranding';

// ============================================================================
// Odds Converter
// ============================================================================
// Enter odds in any format and instantly see the conversion to all others.
// Supports: American, Decimal, Fractional, and Implied Probability.
// ============================================================================

interface OddsConverterProps {
  isMobile: boolean;
}

// ──────────────────────────────────────────────
// Conversion helpers
// ──────────────────────────────────────────────

type OddsInput = 'american' | 'decimal' | 'fractional' | 'probability';

interface ConvertedOdds {
  american: number;
  decimal: number;
  fractionalNum: number;
  fractionalDen: number;
  probability: number; // 0-1
  payoutPer100: number;
}

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

/** Convert implied probability (0-1) to a simplified fractional odds string. */
function probToFraction(prob: number): { num: number; den: number } {
  if (prob <= 0 || prob >= 1) return { num: 0, den: 1 };

  // Fractional odds = (1 - prob) / prob
  const rawNum = 1 - prob;
  const rawDen = prob;

  // Scale to avoid floating-point issues: multiply both by 10000, then reduce
  const scale = 10000;
  let num = Math.round(rawNum * scale);
  let den = Math.round(rawDen * scale);

  const d = gcd(num, den);
  num = num / d;
  den = den / d;

  return { num, den };
}

function americanToAll(american: number): ConvertedOdds {
  let decimal: number;
  let probability: number;

  if (american >= 100) {
    decimal = (american / 100) + 1;
    probability = 100 / (american + 100);
  } else {
    decimal = (100 / Math.abs(american)) + 1;
    probability = Math.abs(american) / (Math.abs(american) + 100);
  }

  const frac = probToFraction(probability);
  return {
    american,
    decimal,
    fractionalNum: frac.num,
    fractionalDen: frac.den,
    probability,
    payoutPer100: decimal * 100,
  };
}

function decimalToAll(decimal: number): ConvertedOdds {
  if (decimal <= 1) decimal = 1.001; // Guard

  const probability = 1 / decimal;
  let american: number;

  if (decimal >= 2) {
    american = Math.round((decimal - 1) * 100);
  } else {
    american = Math.round(-100 / (decimal - 1));
  }

  const frac = probToFraction(probability);
  return {
    american,
    decimal,
    fractionalNum: frac.num,
    fractionalDen: frac.den,
    probability,
    payoutPer100: decimal * 100,
  };
}

function fractionalToAll(num: number, den: number): ConvertedOdds {
  if (den <= 0) den = 1; // Guard
  const decimal = (num / den) + 1;
  return decimalToAll(decimal);
}

function probabilityToAll(prob: number): ConvertedOdds {
  if (prob <= 0) prob = 0.001;
  if (prob >= 1) prob = 0.999;

  const decimal = 1 / prob;
  return decimalToAll(decimal);
}

// ──────────────────────────────────────────────
// Parsing helpers
// ──────────────────────────────────────────────

function parseAmerican(input: string): number | null {
  const trimmed = input.trim().replace(/^\+/, '');
  if (trimmed === '' || trimmed === '-') return null;
  const num = Number(trimmed);
  if (isNaN(num)) return null;
  if (num > -100 && num < 100 && num !== 0) return null;
  if (num === 0) return null;
  return num;
}

function parseDecimal(input: string): number | null {
  const trimmed = input.trim();
  if (trimmed === '') return null;
  const num = Number(trimmed);
  if (isNaN(num) || num <= 1) return null;
  return num;
}

function parseFractional(input: string): { num: number; den: number } | null {
  const trimmed = input.trim();
  if (!trimmed.includes('/')) return null;
  const parts = trimmed.split('/');
  if (parts.length !== 2) return null;
  const num = Number(parts[0].trim());
  const den = Number(parts[1].trim());
  if (isNaN(num) || isNaN(den) || num <= 0 || den <= 0) return null;
  return { num, den };
}

function parseProbability(input: string): number | null {
  const trimmed = input.trim().replace(/%$/, '');
  if (trimmed === '') return null;
  const num = Number(trimmed);
  if (isNaN(num) || num <= 0 || num >= 100) return null;
  return num / 100; // Convert percent to 0-1
}

// ──────────────────────────────────────────────
// Format helpers
// ──────────────────────────────────────────────

function fmtAmerican(odds: number): string {
  if (odds > 0) return `+${odds}`;
  return `${odds}`;
}

// ──────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────

export default function OddsConverter({ isMobile }: OddsConverterProps) {
  // Which field the user is actively typing in
  const [activeInput, setActiveInput] = useState<OddsInput | null>(null);

  // Raw input strings for each field
  const [americanInput, setAmericanInput] = useState('');
  const [decimalInput, setDecimalInput] = useState('');
  const [fractionalInput, setFractionalInput] = useState('');
  const [probabilityInput, setProbabilityInput] = useState('');
  const [betAmount, setBetAmount] = useState('100');

  // Convert from whichever field was last edited
  const converted: ConvertedOdds | null = useMemo(() => {
    switch (activeInput) {
      case 'american': {
        const val = parseAmerican(americanInput);
        return val !== null ? americanToAll(val) : null;
      }
      case 'decimal': {
        const val = parseDecimal(decimalInput);
        return val !== null ? decimalToAll(val) : null;
      }
      case 'fractional': {
        const val = parseFractional(fractionalInput);
        return val !== null ? fractionalToAll(val.num, val.den) : null;
      }
      case 'probability': {
        const val = parseProbability(probabilityInput);
        return val !== null ? probabilityToAll(val) : null;
      }
      default:
        return null;
    }
  }, [activeInput, americanInput, decimalInput, fractionalInput, probabilityInput]);

  // Update all OTHER fields when the active one changes (but don't overwrite the field being typed in)
  const displayAmerican = activeInput === 'american' ? americanInput : (converted ? fmtAmerican(converted.american) : '');
  const displayDecimal = activeInput === 'decimal' ? decimalInput : (converted ? converted.decimal.toFixed(4) : '');
  const displayFractional = activeInput === 'fractional' ? fractionalInput : (converted ? (converted.fractionalNum / converted.fractionalDen).toFixed(4) : '');
  const displayProbability = activeInput === 'probability' ? probabilityInput : (converted ? (converted.probability * 100).toFixed(2) : '');

  const handleChange = (field: OddsInput, value: string) => {
    setActiveInput(field);
    switch (field) {
      case 'american':
        setAmericanInput(value);
        break;
      case 'decimal':
        setDecimalInput(value);
        break;
      case 'fractional':
        setFractionalInput(value);
        break;
      case 'probability':
        setProbabilityInput(value);
        break;
    }
  };

  const handleClear = () => {
    setActiveInput(null);
    setAmericanInput('');
    setDecimalInput('');
    setFractionalInput('');
    setProbabilityInput('');
    setBetAmount('100');
  };

  const parsedBet = parseFloat(betAmount) || 0;

  const inputClass = (field: OddsInput) => `
    w-full px-4 py-3 bg-gray-900 border rounded-lg text-white text-lg font-mono placeholder-gray-600
    focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors
    ${activeInput === field ? 'border-cyan-500' : 'border-gray-600'}
  `;

  return (
    <div className={`${isMobile ? 'px-4' : 'max-w-2xl mx-auto'}`}>
      {/* Description */}
      <div className="mb-6">
        <p className="text-sm text-gray-400 leading-relaxed">
          Type odds into any field and the other formats update automatically. 
          Supports American, Decimal, Fractional, and Implied Probability.
        </p>
      </div>

      {/* ── Single unified card ── */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
        {/* Input fields */}
        <div className="p-5 space-y-4">
          <div className="relative flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
              Enter Odds
            </h3>
            <div className="absolute inset-0 flex items-center justify-center gap-2 pointer-events-none">
              <img src="/sharpmoney-logo.png" alt="" className="w-7 h-7 object-contain" />
              <span className="text-sm font-semibold text-cyan-400 tracking-widest" style={{ fontFamily: 'Russo One, sans-serif' }}>SHARPMONEY</span>
            </div>
            {converted && (
              <button
                onClick={handleClear}
                className="text-[11px] text-gray-500 hover:text-gray-300 transition-colors relative z-10"
              >
                Clear
              </button>
            )}
          </div>

          {/* American */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">
              American
            </label>
            <input
              type="text"
              inputMode="text"
              value={displayAmerican}
              onChange={(e) => handleChange('american', e.target.value)}
              onFocus={() => setActiveInput('american')}
              placeholder="-110"
              className={inputClass('american')}
            />
          </div>

          {/* Decimal */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">
              Decimal
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={displayDecimal}
              onChange={(e) => handleChange('decimal', e.target.value)}
              onFocus={() => setActiveInput('decimal')}
              placeholder="1.91"
              className={inputClass('decimal')}
            />
          </div>

          {/* Fractional */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">
              Fractional
            </label>
            <input
              type="text"
              value={displayFractional}
              onChange={(e) => handleChange('fractional', e.target.value)}
              onFocus={() => setActiveInput('fractional')}
              placeholder="10/11"
              className={inputClass('fractional')}
            />
          </div>

          {/* Implied Probability */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">
              Implied Probability
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={displayProbability}
                onChange={(e) => handleChange('probability', e.target.value)}
                onFocus={() => setActiveInput('probability')}
                placeholder="52.38"
                className={inputClass('probability')}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-lg">%</span>
            </div>
          </div>

          {/* Bet Amount */}
          <div className="pt-2 border-t border-gray-700/40">
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

        {/* ── Results summary ── */}
        {converted && (
          <div className="border-t border-gray-700/50 p-5">
            <div className="overflow-hidden rounded-lg border border-gray-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-900/60">
                    <th className="text-left px-4 py-2.5 text-gray-500 font-medium text-[10px] uppercase tracking-wide">
                      Format
                    </th>
                    <th className="text-right px-4 py-2.5 text-gray-500 font-medium text-[10px] uppercase tracking-wide">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/30">
                  <tr>
                    <td className="px-4 py-3 text-xs text-gray-400 font-medium">American</td>
                    <td className="px-4 py-3 text-right text-white font-mono font-semibold">{fmtAmerican(converted.american)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-xs text-gray-400 font-medium">Decimal</td>
                    <td className="px-4 py-3 text-right text-white font-mono font-semibold">{converted.decimal.toFixed(4)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-xs text-gray-400 font-medium">Fractional</td>
                    <td className="px-4 py-3 text-right font-mono">
                      <span className="text-gray-500 font-normal text-[11px] mr-2">({converted.fractionalNum}/{converted.fractionalDen})</span>
                      <span className="text-white font-semibold">{(converted.fractionalNum / converted.fractionalDen).toFixed(4)}</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-xs text-gray-400 font-medium">Implied Probability</td>
                    <td className="px-4 py-3 text-right text-white font-mono font-semibold">{(converted.probability * 100).toFixed(2)}%</td>
                  </tr>
                  <tr className="bg-cyan-950/20">
                    <td className="px-4 py-3 text-xs text-cyan-400 font-semibold">
                      Total Payout
                    </td>
                    <td className="px-4 py-3 text-right text-cyan-300 font-mono font-semibold">
                      ${(converted.decimal * parsedBet).toFixed(2)}
                    </td>
                  </tr>
                  <tr className="bg-cyan-950/10">
                    <td className="px-4 py-3 text-xs text-cyan-400/70 font-medium">
                      Profit
                    </td>
                    <td className="px-4 py-3 text-right text-cyan-200 font-mono font-semibold">
                      ${((converted.decimal - 1) * parsedBet).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Quick reference */}
            <div className="mt-3 px-1">
              <p className="text-[10px] text-gray-600">
                Bet ${parsedBet.toFixed(2)} → win ${((converted.decimal - 1) * parsedBet).toFixed(2)} profit → receive ${(converted.decimal * parsedBet).toFixed(2)} total.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Branding */}
      <ToolBranding className="mt-6" />
    </div>
  );
}
