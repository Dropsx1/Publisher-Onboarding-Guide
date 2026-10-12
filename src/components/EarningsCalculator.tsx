import React, { useState, useId } from 'react';
import { DollarSign, TrendingUp, Calendar, CreditCard, Sparkles } from 'lucide-react';
import earningsImg from '../assets/images/linktain_creator_earnings_1791815768516.jpg';
import { TRAFFIC_TIERS } from '../data/guideContent';

export const EarningsCalculator: React.FC = () => {
  const clicksInputId = useId();
  const [monthlyClicks, setMonthlyClicks] = useState<number>(65000);
  const [selectedTierId, setSelectedTierId] = useState<string>('tier1');
  const [gateConfig, setGateConfig] = useState<'1step' | '2step' | '3step' | 'hybrid' | 'pass_only'>('hybrid');
  const [passPrice, setPassPrice] = useState<number>(1.99);
  const [passConversionPct, setPassConversionPct] = useState<number>(4.5); // % of visitors who buy pass

  const selectedTier = TRAFFIC_TIERS.find((t) => t.id === selectedTierId) || TRAFFIC_TIERS[0];

  // RPM and completion multipliers
  let baseRpm = selectedTier.baseCpm;
  let completionRate = 0.85;

  if (gateConfig === '1step') {
    baseRpm = selectedTier.baseCpm * 0.7;
    completionRate = 0.88;
  } else if (gateConfig === '2step') {
    baseRpm = selectedTier.baseCpm * 1.15;
    completionRate = 0.78;
  } else if (gateConfig === '3step') {
    baseRpm = selectedTier.baseCpm * 1.55;
    completionRate = 0.65;
  } else if (gateConfig === 'hybrid') {
    baseRpm = selectedTier.baseCpm * 1.15;
    completionRate = 0.78;
  } else if (gateConfig === 'pass_only') {
    baseRpm = 0;
    completionRate = 0;
  }

  // Calculate ad revenue
  const nonPassClicks = gateConfig === 'hybrid'
    ? monthlyClicks * (1 - passConversionPct / 100)
    : gateConfig === 'pass_only'
    ? 0
    : monthlyClicks;

  const successfulAdUnlocks = Math.round(nonPassClicks * completionRate);
  const monthlyAdEarnings = (successfulAdUnlocks / 1000) * baseRpm;

  // Calculate pass revenue (90% creator revenue share on passes)
  const passBuyers =
    gateConfig === 'hybrid' || gateConfig === 'pass_only'
      ? Math.round(monthlyClicks * (passConversionPct / 100))
      : 0;

  const monthlyPassEarnings = passBuyers * passPrice * 0.9;
  const totalMonthlyEarnings = monthlyAdEarnings + monthlyPassEarnings;
  const annualizedEarnings = totalMonthlyEarnings * 12;
  const effectiveRpm = monthlyClicks > 0 ? (totalMonthlyEarnings / monthlyClicks) * 1000 : 0;

  const recommendedRail =
    totalMonthlyEarnings >= 500
      ? 'Bank Wire Transfer (Zero intermediary fee)'
      : totalMonthlyEarnings >= 50
      ? 'USDT / USDC Crypto (Fastest clearing, $50 min)'
      : 'PayPal (Direct digital transfer, $20 min)';

  return (
    <section id="calculator" className="py-16 border-t border-slate-700/80 bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3 mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <span>Financial Modeling</span>
            <span aria-hidden="true">·</span>
            <span>Real-Time Estimation Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight text-balance">
            Interactive Publisher Earnings & RPM Calculator
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Estimate your monthly income on Linktain based on monthly click volume, audience geography, and chosen gating architecture.
          </p>
        </div>

        {/* Main Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs Column */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-7 shadow-xl">
            {/* 1. Monthly Traffic Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor={clicksInputId} className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Monthly Clicks to Gated Links
                </label>
                <span className="text-base font-extrabold font-mono text-emerald-400 tabular-nums">
                  {monthlyClicks.toLocaleString()} clicks/mo
                </span>
              </div>

              <input
                id={clicksInputId}
                type="range"
                min={5000}
                max={500000}
                step={5000}
                value={monthlyClicks}
                onChange={(e) => setMonthlyClicks(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-800 rounded-xl appearance-none cursor-pointer accent-emerald-500"
              />

              <div className="flex justify-between items-center gap-2 pt-1">
                {[10000, 50000, 100000, 250000, 500000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setMonthlyClicks(preset)}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded border transition-colors cursor-pointer ${
                      monthlyClicks === preset
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    {(preset / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Geographic Traffic Tier */}
            <div className="space-y-2.5 pt-4 border-t border-slate-700">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Audience Geographic Tier
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {TRAFFIC_TIERS.map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedTierId(tier.id)}
                    className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                      selectedTierId === tier.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <p className="text-xs font-bold text-white">{tier.name}</p>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                      {tier.countries}
                    </p>
                    <p className="text-xs font-mono font-semibold text-emerald-400 mt-2">
                      ${tier.baseCpm.toFixed(2)} Base
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Gate Architecture Model */}
            <div className="space-y-2.5 pt-4 border-t border-slate-700">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Gating Architecture
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: '1step', label: '1 Step Only', desc: 'Max completion' },
                  { id: '2step', label: '2 Steps Ad', desc: 'Standard balance' },
                  { id: '3step', label: '3 Steps Ad', desc: 'Max ad density' },
                  { id: 'hybrid', label: 'Hybrid (2 Steps + Pass)', desc: 'Best overall yield' },
                  { id: 'pass_only', label: 'Direct Pass Only', desc: 'Zero ads, paid gate' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setGateConfig(item.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      gateConfig === item.id
                        ? 'bg-emerald-600/20 border-emerald-500 text-white'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <p className="text-xs font-bold text-white">{item.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Pass Configuration (if applicable) */}
            {(gateConfig === 'hybrid' || gateConfig === 'pass_only') && (
              <div className="p-4 bg-slate-950/70 border border-slate-700 rounded-xl space-y-4 pt-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Creator Pass Parameters</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">
                      Pass Price per Unlock:
                    </label>
                    <div className="flex items-center gap-2">
                      {[0.99, 1.99, 3.49, 4.99].map((p) => (
                        <button
                          key={p}
                          onClick={() => setPassPrice(p)}
                          className={`px-2.5 py-1 text-xs font-mono rounded border cursor-pointer ${
                            passPrice === p
                              ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                              : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                          }`}
                        >
                          ${p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-[11px] text-slate-400 mb-1">
                      <span>Pass Buyer Rate:</span>
                      <span className="font-mono text-white font-bold">{passConversionPct}%</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={15}
                      step={0.5}
                      value={passConversionPct}
                      onChange={(e) => setPassConversionPct(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-xl appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Forecast Output Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Main Result Card */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest font-semibold text-indigo-400">
                  Projected Monthly Net Revenue
                </span>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-mono tabular-nums">
                  ${totalMonthlyEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                  <span>Effective Blended RPM:</span>
                  <span className="font-mono font-bold text-emerald-400 tabular-nums">
                    ${effectiveRpm.toFixed(2)}
                  </span>
                  <span>/ 1k clicks</span>
                </div>
              </div>

              {/* Breakdown Matrix */}
              <div className="pt-4 border-t border-slate-700/80 space-y-3 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Ad Tasks Revenue:</span>
                  <span className="font-mono font-semibold text-white tabular-nums">
                    ${monthlyAdEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Creator Pass Revenue (90% cut):</span>
                  <span className="font-mono font-semibold text-amber-400 tabular-nums">
                    ${monthlyPassEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Annualized Run Rate (12 mo):</span>
                  <span className="font-mono font-bold text-emerald-400 tabular-nums">
                    ${annualizedEarnings.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/yr
                  </span>
                </div>
              </div>

              {/* Recommended Payout Rail */}
              <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-700 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                  <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Recommended Payout Channel</span>
                </div>
                <p className="text-xs font-medium text-emerald-400">
                  {recommendedRail}
                </p>
                <p className="text-[11px] text-slate-400">
                  Dispatched twice monthly (15th and end of month) with zero platform deduction.
                </p>
              </div>
            </div>

            {/* Dashboard Visual Thumbnail Card */}
            <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 shadow-lg">
              <img
                src={earningsImg}
                alt="Linktain Publisher Revenue Analytics Visual"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover aspect-video"
              />
              <div className="p-4 flex items-center justify-between text-xs text-slate-400">
                <span className="font-medium text-slate-200">Real-Time Payout Gateway</span>
                <span>Automated Bi-Weekly Batch</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
