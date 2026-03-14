'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from 'recharts';
import ToolBranding from './ToolBranding';

// ============================================================================
// Bankroll Simulator — Monte Carlo Variance Visualizer
// ============================================================================
// Runs 10,000 simulated bet sequences with staking strategies
// ============================================================================

interface BankrollSimulatorProps {
  isMobile: boolean;
}

// ════════════════════════════════════════════════════════════════════════════
// SIMULATOR TYPES
// ════════════════════════════════════════════════════════════════════════════

// ── Staking Methods ────────────────────────────────────────────────────────

type StakingMethod = 'flat' | 'full_kelly' | 'half_kelly' | 'quarter_kelly';

const STAKING_METHODS: { id: StakingMethod; label: string; shortLabel: string; description: string }[] = [
  {
    id: 'flat',
    label: 'Flat Betting',
    shortLabel: 'Flat',
    description: 'Bet a fixed dollar amount every time based on your starting bankroll. Simple and predictable.',
  },
  {
    id: 'quarter_kelly',
    label: 'Quarter Kelly',
    shortLabel: '¼ Kelly',
    description: 'Bet 25% of the Kelly-optimal fraction of your current bankroll. Most conservative Kelly variant — lowest variance.',
  },
  {
    id: 'half_kelly',
    label: 'Half Kelly',
    shortLabel: '½ Kelly',
    description: 'Bet 50% of the Kelly-optimal fraction of your current bankroll. Best balance of growth and safety — industry standard.',
  },
  {
    id: 'full_kelly',
    label: 'Full Kelly',
    shortLabel: 'Full Kelly',
    description: 'Bet the mathematically optimal fraction of your current bankroll. Maximum growth rate but extreme variance.',
  },
];

// ── Constants ──────────────────────────────────────────────────────────────

const NUM_SIMULATIONS = 10_000;
const CHART_SAMPLE_POINTS = 100;
const NUM_SPRAY_PATHS = 50; // individual sim paths to show behind percentile lines

const BET_PRESETS = [
  { label: '250', value: 250 },
  { label: '500', value: 500 },
  { label: '1,000', value: 1000 },
  { label: '2,500', value: 2500 },
  { label: '5,000', value: 5000 },
];

// ── Helpers ────────────────────────────────────────────────────────────────

function parseDollar(input: string): number | null {
  const trimmed = input.trim().replace(/[$,]/g, '');
  if (trimmed === '') return null;
  const num = Number(trimmed);
  if (isNaN(num) || num <= 0) return null;
  return num;
}

function parsePercent(input: string): number | null {
  const trimmed = input.trim().replace(/%$/, '');
  if (trimmed === '') return null;
  const num = Number(trimmed);
  if (isNaN(num) || num <= 0 || num > 100) return null;
  return num;
}

/** Parse EV% input — allows negative values (and zero) for simulating -EV scenarios. */
function parseEVPercent(input: string): number | null {
  const trimmed = input.trim().replace(/%$/, '');
  if (trimmed === '' || trimmed === '-') return null;
  const num = Number(trimmed);
  if (isNaN(num) || num < -100 || num > 100) return null;
  return num;
}

function parseOdds(input: string): number | null {
  const trimmed = input.trim().replace(/^\+/, '');
  if (trimmed === '' || trimmed === '-') return null;
  const num = Number(trimmed);
  if (isNaN(num)) return null;
  if (num > -100 && num < 100 && num !== 0) return null;
  if (num === 0) return null;
  return num;
}

function americanToDecimal(odds: number): number {
  if (odds >= 100) return (odds / 100) + 1;
  return (100 / Math.abs(odds)) + 1;
}

function fmtDollar(amount: number): string {
  if (Math.abs(amount) >= 1000) {
    return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
  return '$' + amount.toFixed(0);
}

function fmtDollarPrecise(amount: number): string {
  if (Math.abs(amount) >= 1000) {
    return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return '$' + amount.toFixed(2);
}

function percentile(sortedArr: number[], p: number): number {
  const idx = (p / 100) * (sortedArr.length - 1);
  const lower = Math.floor(idx);
  const upper = Math.ceil(idx);
  if (lower === upper) return sortedArr[lower];
  const weight = idx - lower;
  return sortedArr[lower] * (1 - weight) + sortedArr[upper] * weight;
}

// ── Simulation Types ───────────────────────────────────────────────────────

interface SimulationResult {
  chartData: ChartDataPoint[];
  bustRate: number;
  medianFinal: number;
  expectedProfit: number;
  worstCase: number;
  bestCase: number;
  maxDrawdown95: number; // 95th percentile of max drawdown $ across all sims
  maxDrawdownPct95: number; // 95th percentile of max drawdown as % of peak
  lostMoneyRate: number;
  stakingMethod: StakingMethod;
  kellyFraction: number | null; // null for flat
  avgBetSize: number; // average bet size across median path
}

interface ChartDataPoint {
  bet: number;
  p5: number;
  p25: number;
  p50: number;
  p75: number;
  p95: number;
  [key: `s${number}`]: number; // sampled individual sim paths (s0, s1, ... s49)
}

// ── Monte Carlo Engine ─────────────────────────────────────────────────────

function deriveWinProbability(odds: number, evPercent: number): number {
  const decimalOdds = americanToDecimal(odds);
  const b = decimalOdds - 1; // net payout per unit risked
  // EV% = (winProb * b - (1 - winProb)) * 100 / 1
  // evPercent/100 = winProb * b - 1 + winProb = winProb * (b + 1) - 1
  // winProb = (evPercent/100 + 1) / (b + 1)
  const winProb = (evPercent / 100 + 1) / (decimalOdds);
  return Math.max(0, Math.min(1, winProb));
}

function computeKellyFraction(winProb: number, odds: number): number {
  const decimalOdds = americanToDecimal(odds);
  const b = decimalOdds - 1;
  // Kelly: f = (bp - q) / b
  const f = (b * winProb - (1 - winProb)) / b;
  return Math.max(0, f);
}

function runSimulation(
  bankroll: number,
  unitPercent: number,
  odds: number,
  evPercent: number,
  numBets: number,
  stakingMethod: StakingMethod,
): SimulationResult {
  const decimalOdds = americanToDecimal(odds);
  const b = decimalOdds - 1;
  const winProb = deriveWinProbability(odds, evPercent);
  const kellyF = computeKellyFraction(winProb, odds);

  // For flat betting
  const flatUnitSize = bankroll * (unitPercent / 100);
  const flatProfit = b * flatUnitSize;

  // Kelly multiplier
  let kellyMultiplier = 0;
  if (stakingMethod === 'full_kelly') kellyMultiplier = 1;
  else if (stakingMethod === 'half_kelly') kellyMultiplier = 0.5;
  else if (stakingMethod === 'quarter_kelly') kellyMultiplier = 0.25;

  const effectiveKellyF = kellyF * kellyMultiplier;

  // EV per bet for expected profit calculation
  const evPerBetFlat = flatUnitSize * (evPercent / 100);

  // Sample points for chart
  const sampleInterval = Math.max(1, Math.floor(numBets / CHART_SAMPLE_POINTS));
  const sampleIndices: number[] = [0];
  for (let i = sampleInterval; i < numBets; i += sampleInterval) {
    sampleIndices.push(i);
  }
  if (sampleIndices[sampleIndices.length - 1] !== numBets) {
    sampleIndices.push(numBets);
  }

  const numSamples = sampleIndices.length;
  const allValues: number[][] = Array.from({ length: numSamples }, () => []);

  // Pick which simulation indices to sample for the spray visualization
  // Evenly spaced across all sims to get a representative sample
  const sprayInterval = Math.floor(NUM_SIMULATIONS / NUM_SPRAY_PATHS);
  const spraySimIndices = new Set<number>();
  for (let i = 0; i < NUM_SPRAY_PATHS; i++) {
    spraySimIndices.add(i * sprayInterval);
  }
  // Storage: sprayPaths[pathIndex][sampleIndex] = balance at that sample point
  const sprayPaths: number[][] = Array.from({ length: NUM_SPRAY_PATHS }, () => []);
  let sprayPathCounter = 0;

  let bustCount = 0;
  let lostMoneyCount = 0;
  const finalValues: number[] = [];
  const maxDrawdowns: number[] = []; // track max drawdown $ per simulation
  const maxDrawdownPcts: number[] = []; // track max drawdown % of peak per simulation
  let totalBetSizeSum = 0; // for computing average bet size

  const isFlat = stakingMethod === 'flat';
  const isSpraySim = (simIdx: number) => spraySimIndices.has(simIdx);

  for (let sim = 0; sim < NUM_SIMULATIONS; sim++) {
    let balance = bankroll;
    let busted = false;
    let sampleIdx = 0;
    let simBetSum = 0;
    let simPeak = bankroll; // track peak within this sim
    let simMaxDD = 0; // track max drawdown $ within this sim
    let simMaxDDPct = 0; // track max drawdown % of peak within this sim

    const isSpray = isSpraySim(sim);
    let sprayIdx = -1;
    if (isSpray) {
      sprayIdx = sprayPathCounter++;
    }

    if (sampleIndices[0] === 0) {
      allValues[0].push(balance);
      if (isSpray) sprayPaths[sprayIdx].push(balance);
      sampleIdx = 1;
    }

    for (let bet = 1; bet <= numBets; bet++) {
      if (!busted) {
        let wager: number;

        if (isFlat) {
          wager = flatUnitSize;
        } else {
          // Kelly: bet a fraction of CURRENT bankroll
          wager = balance * effectiveKellyF;
        }

        // Can't bet more than you have
        if (wager > balance) wager = balance;
        // Minimum bet threshold — below $0.01 is effectively bust
        if (wager < 0.01 || balance < 0.01) {
          busted = true;
          balance = 0;
        }

        if (!busted) {
          simBetSum += wager;
          if (Math.random() < winProb) {
            balance += wager * b;
          } else {
            balance -= wager;
          }
          if (balance <= 0.01) {
            balance = 0;
            busted = true;
          }
        }

        // Track max drawdown for this simulation (both $ and % of peak)
        if (balance > simPeak) simPeak = balance;
        const dd = simPeak - balance;
        if (dd > simMaxDD) simMaxDD = dd;
        const ddPct = simPeak > 0 ? (dd / simPeak) * 100 : 0;
        if (ddPct > simMaxDDPct) simMaxDDPct = ddPct;
      }

      if (sampleIdx < numSamples && bet === sampleIndices[sampleIdx]) {
        allValues[sampleIdx].push(balance);
        if (isSpray) sprayPaths[sprayIdx].push(balance);
        sampleIdx++;
      }
    }

    while (sampleIdx < numSamples) {
      allValues[sampleIdx].push(0);
      if (isSpray) sprayPaths[sprayIdx].push(0);
      sampleIdx++;
    }

    if (busted) bustCount++;
    finalValues.push(balance);
    maxDrawdowns.push(simMaxDD);
    maxDrawdownPcts.push(simMaxDDPct);
    if (balance < bankroll) lostMoneyCount++;
    totalBetSizeSum += simBetSum;
  }

  // Percentiles
  const chartData: ChartDataPoint[] = [];
  const medianPath: number[] = [];

  for (let s = 0; s < numSamples; s++) {
    const sorted = allValues[s].sort((a, b) => a - b);
    const p5 = percentile(sorted, 5);
    const p25 = percentile(sorted, 25);
    const p50 = percentile(sorted, 50);
    const p75 = percentile(sorted, 75);
    const p95 = percentile(sorted, 95);
    const point: ChartDataPoint = { bet: sampleIndices[s], p5, p25, p50, p75, p95 };
    // Attach each spray path's value at this sample point
    for (let sp = 0; sp < NUM_SPRAY_PATHS; sp++) {
      point[`s${sp}` as `s${number}`] = sprayPaths[sp][s] ?? 0;
    }
    chartData.push(point);
    medianPath.push(p50);
  }

  // Max drawdown: 95th percentile across all simulations (worst case you should prepare for)
  maxDrawdowns.sort((a, b) => a - b);
  const maxDrawdown95 = percentile(maxDrawdowns, 95);
  maxDrawdownPcts.sort((a, b) => a - b);
  const maxDrawdownPct95 = percentile(maxDrawdownPcts, 95);

  finalValues.sort((a, b) => a - b);

  // Expected profit: for flat it's straightforward, for Kelly it's approximate
  const expectedProfit = isFlat
    ? evPerBetFlat * numBets
    : bankroll * (Math.pow(1 + effectiveKellyF * (winProb * b - (1 - winProb)), numBets) - 1);

  // Use median final as a more honest expected profit for Kelly (geometric growth is skewed)
  const displayExpectedProfit = isFlat ? evPerBetFlat * numBets : percentile(finalValues, 50) - bankroll;

  return {
    chartData,
    bustRate: (bustCount / NUM_SIMULATIONS) * 100,
    medianFinal: percentile(finalValues, 50),
    expectedProfit: displayExpectedProfit,
    worstCase: percentile(finalValues, 5),
    bestCase: percentile(finalValues, 95),
    maxDrawdown95,
    maxDrawdownPct95,
    lostMoneyRate: (lostMoneyCount / NUM_SIMULATIONS) * 100,
    stakingMethod,
    kellyFraction: isFlat ? null : effectiveKellyF,
    avgBetSize: totalBetSizeSum / (NUM_SIMULATIONS * numBets),
  };
}

// ── Custom Tooltip ─────────────────────────────────────────────────────────

function SimTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload as ChartDataPoint;
  if (!data) return null;

  return (
    <div className="bg-gray-950/95 border border-gray-600 rounded-xl px-5 py-3.5 shadow-2xl text-[13px] backdrop-blur-sm">
      <p className="text-gray-400 font-bold mb-2.5 text-xs tracking-wide">Bet {data.bet.toLocaleString()}</p>
      <div className="space-y-1.5">
        <div className="flex justify-between gap-8">
          <span className="text-emerald-300 font-medium">Best (95th)</span>
          <span className="text-white font-mono font-semibold">{fmtDollar(data.p95)}</span>
        </div>
        <div className="flex justify-between gap-8">
          <span className="text-green-400/80 font-medium">Good (75th)</span>
          <span className="text-white font-mono font-semibold">{fmtDollar(data.p75)}</span>
        </div>
        <div className="flex justify-between gap-8 py-0.5 border-y border-gray-700/50">
          <span className="text-cyan-400 font-bold">Median</span>
          <span className="text-cyan-300 font-mono font-bold">{fmtDollar(data.p50)}</span>
        </div>
        <div className="flex justify-between gap-8">
          <span className="text-amber-400/80 font-medium">Below Avg (25th)</span>
          <span className="text-white font-mono font-semibold">{fmtDollar(data.p25)}</span>
        </div>
        <div className="flex justify-between gap-8">
          <span className="text-red-400 font-medium">Worst (5th)</span>
          <span className="text-white font-mono font-semibold">{fmtDollar(data.p5)}</span>
        </div>
      </div>
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────

export default function BankrollSimulator({ isMobile }: BankrollSimulatorProps) {
  // ── Simulator inputs ──
  const [bankrollInput, setBankrollInput] = useState('5000');
  const [unitPercentInput, setUnitPercentInput] = useState('1');
  const [oddsInput, setOddsInput] = useState('-110');
  const [evPercentInput, setEvPercentInput] = useState('2');
  const [numBets, setNumBets] = useState(1000);
  const [customBetsInput, setCustomBetsInput] = useState('');
  const [customBetsMode, setCustomBetsMode] = useState(false);
  const [stakingMethod, setStakingMethod] = useState<StakingMethod>('flat');

  // Simulation state
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Parse inputs
  const bankroll = useMemo(() => parseDollar(bankrollInput), [bankrollInput]);
  const unitPercent = useMemo(() => parsePercent(unitPercentInput), [unitPercentInput]);
  const odds = useMemo(() => parseOdds(oddsInput), [oddsInput]);
  const evPercent = useMemo(() => parseEVPercent(evPercentInput), [evPercentInput]);

  const activeBets = useMemo(() => {
    if (customBetsMode) {
      const trimmed = customBetsInput.trim().replace(/,/g, '');
      if (trimmed === '') return null;
      const num = Number(trimmed);
      if (isNaN(num) || num < 10 || num > 50000 || !Number.isInteger(num)) return null;
      return num;
    }
    return numBets;
  }, [customBetsMode, customBetsInput, numBets]);

  const isKellyMode = stakingMethod !== 'flat';

  // Derived values
  const derivedWinProb = useMemo(() => {
    if (odds === null || evPercent === null) return null;
    return deriveWinProbability(odds, evPercent);
  }, [odds, evPercent]);

  const derivedKellyFraction = useMemo(() => {
    if (odds === null || derivedWinProb === null) return null;
    return computeKellyFraction(derivedWinProb, odds);
  }, [odds, derivedWinProb]);

  // For Kelly modes, unit size isn't needed AND edge must be positive (Kelly says don't bet on -EV)
  const canSimulate = bankroll !== null && odds !== null && evPercent !== null && activeBets !== null &&
    (isKellyMode ? evPercent > 0 : unitPercent !== null);

  const handleSimulate = useCallback(() => {
    if (!canSimulate || bankroll === null || odds === null || evPercent === null || activeBets === null) return;
    const effectiveUnit = isKellyMode ? 1 : (unitPercent ?? 1); // unit % is ignored for Kelly

    setIsSimulating(true);
    setTimeout(() => {
      const result = runSimulation(bankroll, effectiveUnit, odds, evPercent, activeBets, stakingMethod);
      setSimResult(result);
      setIsSimulating(false);
    }, 50);
  }, [canSimulate, bankroll, unitPercent, odds, evPercent, activeBets, stakingMethod, isKellyMode]);

  // Chart Y-axis — include spray path values so nothing gets clipped
  const yDomain = useMemo(() => {
    if (!simResult) return [0, 10000];
    let min = Infinity;
    let max = -Infinity;
    for (const d of simResult.chartData) {
      if (d.p5 < min) min = d.p5;
      if (d.p95 > max) max = d.p95;
      // Check spray paths too
      for (let sp = 0; sp < NUM_SPRAY_PATHS; sp++) {
        const val = d[`s${sp}` as `s${number}`];
        if (val !== undefined) {
          if (val < min) min = val;
          if (val > max) max = val;
        }
      }
    }
    const padding = (max - min) * 0.1;
    return [Math.max(0, Math.floor(min - padding)), Math.ceil(max + padding)];
  }, [simResult]);

  const activeMethodInfo = STAKING_METHODS.find(m => m.id === stakingMethod)!;

  // Pre-build spray path indices array for rendering
  const sprayKeys = useMemo(() => {
    return Array.from({ length: NUM_SPRAY_PATHS }, (_, i) => `s${i}`);
  }, []);

  return (
    <div className={`${isMobile ? 'px-4' : 'max-w-5xl mx-auto'}`}>
      {/* Description */}
      <div className="mb-5">
        <p className="text-sm text-gray-400 leading-relaxed">
          See how variance really works. This simulator runs <span className="text-gray-200 font-medium">10,000 Monte Carlo simulations</span> of 
          your betting journey and shows the range of outcomes you might experience — even with a real edge.
        </p>
      </div>

      {/* ── Input Section ── */}
      <div className="bg-gray-800/80 border border-gray-700 rounded-2xl overflow-hidden backdrop-blur-sm">
        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-gray-700/50">
          <div className="relative flex items-center">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
              Simulation Settings
            </h3>
            <div className="absolute inset-0 flex items-center justify-center gap-2 pointer-events-none">
              <img src="/sharpmoney-logo.png" alt="" className="w-7 h-7 object-contain" />
              <span className="text-sm font-semibold text-cyan-400 tracking-widest" style={{ fontFamily: 'Russo One, sans-serif' }}>SHARPMONEY</span>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* ── Staking Method Selector ── */}
          <div>
            <label className="block text-xs text-gray-400 mb-2.5 font-medium uppercase tracking-wide">
              Staking Method
            </label>
            <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-2`}>
              {STAKING_METHODS.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setStakingMethod(method.id)}
                  className={`relative px-3 py-3 text-sm font-semibold rounded-xl border-2 transition-all ${
                    stakingMethod === method.id
                      ? 'bg-cyan-500/10 border-cyan-500/60 text-cyan-400 shadow-lg shadow-cyan-500/5'
                      : 'bg-gray-900/60 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300'
                  }`}
                >
                  {method.shortLabel}
                  {method.id === 'half_kelly' && (
                    <span className="absolute -top-1.5 -right-1.5 text-[8px] px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-full font-bold uppercase tracking-wide border border-cyan-500/30">
                      Rec
                    </span>
                  )}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
              {activeMethodInfo.description}
            </p>
          </div>

          {/* ── Inputs Grid ── */}
          <div className={`grid ${isMobile ? 'grid-cols-1' : isKellyMode ? 'grid-cols-3' : 'grid-cols-2'} gap-4`}>
            {/* Bankroll */}
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                Starting Bankroll
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

            {/* Unit Size — only for flat betting */}
            {!isKellyMode && (
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                  Unit Size (% of Bankroll)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={unitPercentInput}
                    onChange={(e) => setUnitPercentInput(e.target.value)}
                    placeholder="1"
                    className="w-full px-4 py-3 pr-8 bg-gray-900 border border-gray-600 rounded-lg text-white text-lg font-mono placeholder-gray-600
                      focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-lg">%</span>
                </div>
              </div>
            )}

            {/* Odds */}
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                Average Odds (American)
              </label>
              <input
                type="text"
                inputMode="text"
                value={oddsInput}
                onChange={(e) => setOddsInput(e.target.value)}
                placeholder="-110"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white text-lg font-mono placeholder-gray-600
                  focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
            </div>

            {/* EV% */}
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                Edge / EV per Bet
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="text"
                  value={evPercentInput}
                  onChange={(e) => setEvPercentInput(e.target.value)}
                  placeholder="2"
                  className="w-full px-4 py-3 pr-8 bg-gray-900 border border-gray-600 rounded-lg text-white text-lg font-mono placeholder-gray-600
                    focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-lg">%</span>
              </div>
            </div>
          </div>

          {/* Number of Bets */}
          <div className="border-t border-gray-700/50 pt-4">
            <label className="block text-xs text-gray-400 mb-2.5 font-medium">
              Number of Bets to Simulate
            </label>
            <div className="flex flex-wrap gap-2">
              {BET_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => { setNumBets(preset.value); setCustomBetsMode(false); }}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-colors ${
                    !customBetsMode && numBets === preset.value
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                      : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
              <button
                onClick={() => setCustomBetsMode(true)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-colors ${
                  customBetsMode
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                    : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                }`}
              >
                Custom
              </button>
            </div>
            {customBetsMode && (
              <input
                type="text"
                inputMode="numeric"
                value={customBetsInput}
                onChange={(e) => setCustomBetsInput(e.target.value)}
                placeholder="e.g. 3000"
                className="mt-3 w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white text-lg font-mono placeholder-gray-600
                  focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
            )}
          </div>

          {/* Derived stats preview */}
          {derivedWinProb !== null && bankroll !== null && (
            <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-[11px] text-gray-500 border-t border-gray-700/50 pt-3">
              <span>
                Win Rate: <span className="text-gray-300 font-mono font-medium">{(derivedWinProb * 100).toFixed(1)}%</span>
              </span>
              {!isKellyMode && unitPercent !== null && (
                <span>
                  Flat Unit: <span className="text-gray-300 font-mono font-medium">{fmtDollarPrecise(bankroll * (unitPercent / 100))}</span>
                </span>
              )}
              {isKellyMode && derivedKellyFraction !== null && (
                <>
                  <span>
                    Full Kelly: <span className="text-gray-300 font-mono font-medium">{(derivedKellyFraction * 100).toFixed(2)}%</span>
                  </span>
                  {stakingMethod === 'half_kelly' && (
                    <span>
                      Bet Size: <span className="text-cyan-400 font-mono font-medium">{(derivedKellyFraction * 50).toFixed(2)}%</span>
                      <span className="text-gray-600"> of bankroll/bet</span>
                    </span>
                  )}
                  {stakingMethod === 'quarter_kelly' && (
                    <span>
                      Bet Size: <span className="text-cyan-400 font-mono font-medium">{(derivedKellyFraction * 25).toFixed(2)}%</span>
                      <span className="text-gray-600"> of bankroll/bet</span>
                    </span>
                  )}
                  {stakingMethod === 'full_kelly' && (
                    <span>
                      Bet Size: <span className="text-cyan-400 font-mono font-medium">{(derivedKellyFraction * 100).toFixed(2)}%</span>
                      <span className="text-gray-600"> of bankroll/bet</span>
                    </span>
                  )}
                </>
              )}
              <span>
                Bets: <span className="text-gray-300 font-mono font-medium">{(activeBets ?? 0).toLocaleString()}</span>
              </span>
            </div>
          )}
        </div>

        {/* ── Simulate Button ── */}
        <div className="px-5 pb-5">
          <button
            onClick={handleSimulate}
            disabled={!canSimulate || isSimulating}
            className={`w-full py-4 rounded-xl font-bold text-base transition-all ${
              canSimulate && !isSimulating
                ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-gray-900 cursor-pointer shadow-lg shadow-cyan-500/25'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSimulating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Running 10,000 Simulations...
              </span>
            ) : simResult ? (
              'Re-Run Simulation'
            ) : (
              'Run Simulation'
            )}
          </button>
          {!canSimulate && (
            <p className="text-center text-xs text-gray-500 mt-2">
              {isKellyMode && evPercent !== null && evPercent <= 0
                ? 'Kelly requires a positive edge. Switch to Flat Betting to simulate negative EV.'
                : isKellyMode ? 'Enter bankroll, odds, and EV% to run.' : 'Fill in all fields above to run the simulation.'}
            </p>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* RESULTS                                                              */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {simResult && !isSimulating && (
        <div className="mt-6 space-y-5">

          {/* ── Method + Strategy Tag ── */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-3 py-1.5 uppercase tracking-wide">
              {activeMethodInfo.label}
            </span>
            <span className="text-xs text-gray-500">
              {(activeBets ?? 0).toLocaleString()} bets at {oddsInput} odds with {evPercentInput}% edge
            </span>
          </div>

          {/* ── Chart ── */}
          <div className="bg-gray-800/80 border border-gray-700 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="px-6 pt-6 pb-3 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Bankroll Over Time</h3>
              <span className="text-[11px] text-gray-400 uppercase tracking-wide font-bold bg-gray-900/60 px-3 py-1.5 rounded-lg">
                10,000 Simulations
              </span>
            </div>

            {/* Legend */}
            <div className="px-6 pb-4 flex flex-wrap gap-x-6 gap-y-1.5 text-[11px]">
              <span className="flex items-center gap-2">
                <span className="w-5 h-[3px] bg-gray-500/30 rounded-full inline-block" />
                <span className="text-gray-500">Individual Paths (50)</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-5 h-[4px] bg-emerald-300 rounded-full inline-block" style={{ boxShadow: '0 0 6px #6ee7b7' }} />
                <span className="text-gray-300">95th Percentile</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-5 h-[3px] bg-green-500/70 rounded-full inline-block" />
                <span className="text-gray-400">75th</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-5 h-[5px] bg-cyan-400 rounded-full inline-block" style={{ boxShadow: '0 0 8px #22d3ee' }} />
                <span className="text-gray-200 font-bold">Median</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-5 h-[3px] bg-amber-400/70 rounded-full inline-block" />
                <span className="text-gray-400">25th</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-5 h-[4px] bg-red-400 rounded-full inline-block" style={{ boxShadow: '0 0 6px #f87171' }} />
                <span className="text-gray-300">5th Percentile</span>
              </span>
            </div>

            <div className={`px-2 pb-5 ${isMobile ? 'h-80' : 'h-[500px]'}`}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={simResult.chartData} margin={{ top: 10, right: 20, left: 20, bottom: 15 }}>
                  <defs>
                    <linearGradient id="bandGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.06} />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" strokeOpacity={0.6} />
                  <XAxis
                    dataKey="bet"
                    stroke="#4B5563"
                    tick={{ fill: '#9CA3AF', fontSize: 12, fontFamily: 'ui-monospace, monospace' }}
                    tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k` : String(v)}
                    axisLine={{ stroke: '#374151' }}
                    label={{ value: 'Bet #', position: 'insideBottom', offset: -8, fill: '#6B7280', fontSize: 12, fontWeight: 600 }}
                  />
                  <YAxis
                    stroke="#4B5563"
                    tick={{ fill: '#9CA3AF', fontSize: 12, fontFamily: 'ui-monospace, monospace' }}
                    tickFormatter={(v: number) => {
                      if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
                      if (v >= 1000) return `$${(v / 1000).toFixed(0)}k`;
                      return `$${v}`;
                    }}
                    domain={yDomain}
                    axisLine={{ stroke: '#374151' }}
                  />
                  <Tooltip content={<SimTooltip />} />

                  <ReferenceLine
                    y={bankroll ?? 0}
                    stroke="#9CA3AF"
                    strokeDasharray="6 4"
                    strokeWidth={1.5}
                    label={{
                      value: 'Break Even',
                      position: 'right',
                      fill: '#9CA3AF',
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  />

                  {/* ── Spray: 50 individual simulation paths (rendered first = behind) ── */}
                  {sprayKeys.map((key) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke="#6B7280"
                      strokeWidth={0.7}
                      strokeOpacity={1}
                      dot={false}
                      activeDot={false}
                      isAnimationActive={false}
                      connectNulls={false}
                    />
                  ))}

                  {/* ── Shaded confidence band (p25 to p75) ── */}
                  <Area dataKey="p75" stroke="none" fill="url(#bandGradient)" isAnimationActive={false} activeDot={false} />
                  <Area dataKey="p25" stroke="none" fill="#111827" fillOpacity={0.85} isAnimationActive={false} activeDot={false} />

                  {/* ── Bold Percentile lines (rendered last = on top) ── */}
                  <Line type="monotone" dataKey="p95" stroke="#6ee7b7" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#6ee7b7', stroke: '#111827', strokeWidth: 2 }} isAnimationActive={false} />
                  <Line type="monotone" dataKey="p75" stroke="#22c55e" strokeWidth={2} strokeOpacity={0.7} dot={false} activeDot={{ r: 4, fill: '#22c55e', stroke: '#111827', strokeWidth: 2 }} isAnimationActive={false} />
                  <Line type="monotone" dataKey="p50" stroke="#22d3ee" strokeWidth={4} dot={false} activeDot={{ r: 6, fill: '#22d3ee', stroke: '#111827', strokeWidth: 2 }} isAnimationActive={false} />
                  <Line type="monotone" dataKey="p25" stroke="#f59e0b" strokeWidth={2} strokeOpacity={0.7} dot={false} activeDot={{ r: 4, fill: '#f59e0b', stroke: '#111827', strokeWidth: 2 }} isAnimationActive={false} />
                  <Line type="monotone" dataKey="p5" stroke="#f87171" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#f87171', stroke: '#111827', strokeWidth: 2 }} isAnimationActive={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Stats Cards ── */}
          <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-3 lg:grid-cols-6'} gap-3`}>
            <StatCard
              label="Bust Rate"
              value={`${simResult.bustRate.toFixed(1)}%`}
              sub={`${Math.round(simResult.bustRate * NUM_SIMULATIONS / 100).toLocaleString()} of 10k`}
              color={simResult.bustRate > 20 ? 'red' : simResult.bustRate > 5 ? 'amber' : 'green'}
            />
            <StatCard
              label="Median Ending"
              value={fmtDollar(simResult.medianFinal)}
              sub={`${simResult.medianFinal >= (bankroll ?? 0) ? '+' : ''}${fmtDollar(simResult.medianFinal - (bankroll ?? 0))}`}
              color={simResult.medianFinal >= (bankroll ?? 0) ? 'cyan' : 'red'}
            />
            <StatCard
              label="Expected Profit"
              value={`${simResult.expectedProfit >= 0 ? '+' : ''}${fmtDollar(simResult.expectedProfit)}`}
              sub={isKellyMode ? 'Median-based' : `${evPercent}% x ${activeBets?.toLocaleString()}`}
              color="green"
            />
            <StatCard
              label="Worst (5th)"
              value={fmtDollar(simResult.worstCase)}
              sub="95% do better"
              color={simResult.worstCase >= (bankroll ?? 0) ? 'green' : 'red'}
            />
            <StatCard
              label="Best (95th)"
              value={fmtDollar(simResult.bestCase)}
              sub="Top 5% outcome"
              color="green"
            />
            <StatCard
              label="Max Drawdown"
              value={`-${simResult.maxDrawdownPct95.toFixed(1)}%`}
              sub={`-${fmtDollar(simResult.maxDrawdown95)} from peak`}
              color="amber"
            />
          </div>

          {/* ── Key Insight Bar ── */}
          <div className="bg-gray-900/80 border border-gray-700/60 rounded-xl px-5 py-4">
            <p className="text-sm text-gray-300 leading-relaxed text-center">
              Even with a <span className="text-cyan-400 font-bold">{evPercent}% edge</span> using{' '}
              <span className="text-cyan-400 font-bold">{activeMethodInfo.label}</span>,{' '}
              <span className="text-amber-400 font-bold">{simResult.lostMoneyRate.toFixed(1)}%</span> of 
              simulations lost money after <span className="text-gray-100 font-semibold">{activeBets?.toLocaleString()}</span> bets.
            </p>
          </div>

          {/* ── Variance Insights ── */}
          <div className="bg-gray-800/80 border border-gray-700 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="p-5 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">Variance Insights</h3>

              {/* Bust risk alerts */}
              {simResult.bustRate > 20 && (
                <div className="bg-red-950/30 border border-red-800/40 rounded-xl p-4">
                  <p className="text-sm font-bold text-red-400 mb-1">High Bust Risk</p>
                  <p className="text-xs text-red-400/70 leading-relaxed">
                    A {simResult.bustRate.toFixed(1)}% bust rate is dangerously high.
                    {isKellyMode
                      ? ' Full Kelly is known for extreme variance — try Half or Quarter Kelly for a much safer ride with similar long-term growth.'
                      : ` Consider reducing your unit size from ${unitPercent}% to ${((unitPercent ?? 1) / 2).toFixed(1)}% to dramatically cut risk of ruin.`
                    }
                  </p>
                </div>
              )}

              {simResult.bustRate > 5 && simResult.bustRate <= 20 && (
                <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-4">
                  <p className="text-sm font-bold text-amber-400 mb-1">Moderate Bust Risk</p>
                  <p className="text-xs text-amber-400/70 leading-relaxed">
                    Roughly 1 in {Math.round(100 / simResult.bustRate)} bettors with your exact edge would go broke over {activeBets?.toLocaleString()} bets.
                    {isKellyMode && stakingMethod === 'full_kelly'
                      ? ' Half Kelly captures ~75% of the growth rate with far less variance.'
                      : ' Consider whether you can tolerate this level of risk.'
                    }
                  </p>
                </div>
              )}

              {simResult.bustRate > 0 && simResult.bustRate <= 5 && (
                <div className="bg-green-950/30 border border-green-800/40 rounded-xl p-4">
                  <p className="text-sm font-bold text-green-400 mb-1">Low Bust Risk</p>
                  <p className="text-xs text-green-400/70 leading-relaxed">
                    {simResult.bustRate.toFixed(1)}% bust rate — your sizing is solid. Stay disciplined and let the edge compound.
                  </p>
                </div>
              )}

              {simResult.bustRate === 0 && (
                <div className="bg-green-950/30 border border-green-800/40 rounded-xl p-4">
                  <p className="text-sm font-bold text-green-400 mb-1">Excellent Bankroll Safety</p>
                  <p className="text-xs text-green-400/70 leading-relaxed">
                    Zero busts in 10,000 simulations. Your risk of ruin is negligible.
                    {isKellyMode ? ' Kelly sizing naturally prevents bust by shrinking bets as your bankroll drops.' : ''}
                  </p>
                </div>
              )}

              {/* Kelly-specific insight */}
              {isKellyMode && derivedKellyFraction !== null && (
                <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-4">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide font-bold mb-2">Kelly Staking Insight</p>
                  <div className="text-xs text-gray-400 leading-relaxed space-y-1.5">
                    <p>
                      Full Kelly fraction: <span className="text-cyan-400 font-mono font-semibold">{(derivedKellyFraction * 100).toFixed(2)}%</span> of bankroll per bet.
                      {stakingMethod === 'half_kelly' && <> You&apos;re using <span className="text-cyan-400 font-semibold">Half Kelly ({(derivedKellyFraction * 50).toFixed(2)}%)</span> — the industry standard.</>}
                      {stakingMethod === 'quarter_kelly' && <> You&apos;re using <span className="text-cyan-400 font-semibold">Quarter Kelly ({(derivedKellyFraction * 25).toFixed(2)}%)</span> — maximum safety.</>}
                      {stakingMethod === 'full_kelly' && <> Full Kelly maximizes growth but produces extreme swings.</>}
                    </p>
                    <p>
                      With Kelly, your bets <span className="text-gray-300 font-medium">scale with your bankroll</span> — 
                      as you win, bets grow; as you lose, bets shrink. This makes true bust nearly impossible but 
                      means early losses hurt less and late winning streaks compound more.
                    </p>
                  </div>
                </div>
              )}

              {/* Educational block */}
              <div className="bg-gray-900/40 rounded-xl p-4 border border-gray-700/40">
                <p className="text-[10px] text-gray-500 uppercase tracking-wide font-bold mb-2">Understanding Variance</p>
                <div className="space-y-2 text-[11px] text-gray-400 leading-relaxed">
                  <p>
                    <span className="text-gray-300 font-medium">Variance is the cost of doing business.</span> Even 
                    the sharpest bettors experience brutal losing streaks. What separates winners from losers isn&apos;t avoiding variance — 
                    it&apos;s surviving it.
                  </p>
                  <p>
                    The <span className="text-cyan-400 font-medium">median line</span> shows your most likely path. 
                    The <span className="text-red-400 font-medium">5th percentile</span> shows a truly unlucky run. 
                    The spread between them is why bankroll management matters more than your edge.
                  </p>
                  <p>
                    <span className="text-gray-300 font-medium">Key takeaway:</span> If you can&apos;t stomach the worst-case 
                    scenario on this chart, change your staking method or reduce your unit size until you can. The goal 
                    isn&apos;t to maximize profit — it&apos;s to stay in the game long enough for your edge to play out.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Branding */}
      <ToolBranding className="mt-6" />
    </div>
  );
}

// ── Stat Card ──

function StatCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: 'green' | 'red' | 'amber' | 'cyan' }) {
  const colorMap: Record<string, string> = {
    green: 'text-green-400',
    red: 'text-red-400',
    amber: 'text-amber-400',
    cyan: 'text-cyan-400',
  };
  const borderMap: Record<string, string> = {
    green: 'border-green-800/20',
    red: 'border-red-800/20',
    amber: 'border-amber-800/20',
    cyan: 'border-cyan-800/20',
  };

  return (
    <div className={`bg-gray-800/80 border ${borderMap[color]} rounded-xl p-3.5 backdrop-blur-sm`}>
      <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mb-1 truncate">{label}</p>
      <p className={`text-xl font-bold font-mono ${colorMap[color]} truncate`}>{value}</p>
      <p className="text-[10px] text-gray-500 mt-0.5 truncate">{sub}</p>
    </div>
  );
}
