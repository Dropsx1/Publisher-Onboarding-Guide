import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Lightbulb,
  CheckCircle,
  Percent,
  Layers,
  Tag,
  Loader2,
} from 'lucide-react';

interface AnalysisResult {
  strategyTitle: string;
  recommendedModel: string;
  recommendedStepCount: number;
  stepTypes: string[];
  recommendedPassPrice: string;
  estimatedRpm: string;
  conversionRate: string;
  rationale: string;
  optimizationTips: string[];
  complianceWarnings: string[];
}

export const AiGateAnalyzer: React.FC = () => {
  const [destinationType, setDestinationType] = useState('Telegram VIP Channel & Signals');
  const [destinationUrl, setDestinationUrl] = useState('https://t.me/crypto_alpha_vip');
  const [targetNiche, setTargetNiche] = useState('Finance & Trading');
  const [trafficSource, setTrafficSource] = useState('YouTube & Twitter/X');
  const [monthlyClicks, setMonthlyClicks] = useState('45,000');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/gemini/analyze-gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinationType,
          destinationUrl,
          targetNiche,
          trafficSource,
          monthlyClicks,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to complete analysis');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to analyze gate configuration with Gemini.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPreset = (
    type: string,
    url: string,
    niche: string,
    source: string,
    clicks: string
  ) => {
    setDestinationType(type);
    setDestinationUrl(url);
    setTargetNiche(niche);
    setTrafficSource(source);
    setMonthlyClicks(clicks);
  };

  return (
    <section id="ai-strategist" className="py-16 border-t border-slate-700/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl space-y-3 mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini Intelligence Engine</span>
            <span aria-hidden="true">·</span>
            <span>Link Architecture Advisor</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight text-balance">
            AI Gate Strategy & Monetization Architect
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Not sure whether to use 1 step, 3 steps, or a creator pass? Input your content niche and traffic profile. Gemini analyzes audience behavior to design the highest-earning gate setup.
          </p>
        </div>

        {/* Presets */}
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Quick Presets:</span>
          <button
            type="button"
            onClick={() =>
              handleApplyPreset(
                'Telegram VIP Community',
                'https://t.me/pro_signals_vault',
                'Finance & Crypto',
                'YouTube Video Descriptions',
                '60,000'
              )
            }
            className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors cursor-pointer"
          >
            Telegram VIP Channel
          </button>
          <button
            type="button"
            onClick={() =>
              handleApplyPreset(
                'Software / Game Mod Download',
                'https://download.vault/mod_v4.zip',
                'Gaming & Utility',
                'Discord & Reddit',
                '120,000'
              )
            }
            className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors cursor-pointer"
          >
            Game Mod / Utility File
          </button>
          <button
            type="button"
            onClick={() =>
              handleApplyPreset(
                'Creator Digital Template (Notion/Presets)',
                'https://notion.so/creative-os-template',
                'Productivity & Design',
                'TikTok Bio & Instagram',
                '25,000'
              )
            }
            className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors cursor-pointer"
          >
            Notion / Design Asset
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form */}
          <form
            onSubmit={handleAnalyze}
            className="lg:col-span-5 bg-slate-900/90 border border-slate-700 rounded-2xl p-6 sm:p-7 space-y-4 shadow-xl"
          >
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Publisher Resource Details</span>
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Destination Content Category
              </label>
              <input
                type="text"
                value={destinationType}
                onChange={(e) => setDestinationType(e.target.value)}
                placeholder="e.g. Private Telegram, File Download, Preset Pack"
                required
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Destination URL or Link Title
              </label>
              <input
                type="text"
                value={destinationUrl}
                onChange={(e) => setDestinationUrl(e.target.value)}
                placeholder="https://..."
                required
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-purple-300 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Target Niche
                </label>
                <input
                  type="text"
                  value={targetNiche}
                  onChange={(e) => setTargetNiche(e.target.value)}
                  placeholder="e.g. Gaming, Finance"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Monthly Clicks
                </label>
                <input
                  type="text"
                  value={monthlyClicks}
                  onChange={(e) => setMonthlyClicks(e.target.value)}
                  placeholder="e.g. 50,000"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Primary Traffic Source
              </label>
              <input
                type="text"
                value={trafficSource}
                onChange={(e) => setTrafficSource(e.target.value)}
                placeholder="e.g. YouTube descriptions, Telegram, TikTok"
                required
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Link Strategy...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Gemini Strategy Analysis</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Results Output */}
          <div className="lg:col-span-7">
            {error && (
              <div className="p-4 bg-red-950/40 border border-red-800 rounded-xl text-xs text-red-300 mb-4">
                {error}
              </div>
            )}

            {!result && !loading && (
              <div className="bg-slate-900/60 border border-dashed border-slate-700 rounded-2xl p-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400 mx-auto flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">
                  Awaiting Publisher Specifications
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Submit your destination link details on the left, or click any preset to generate an intelligent gating strategy.
                </p>
              </div>
            )}

            {result && (
              <div className="bg-slate-900/90 border border-purple-500/30 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl animate-fadeIn">
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                    Recommended Architecture
                  </span>
                  <h4 className="text-xl sm:text-2xl font-extrabold text-white">
                    {result.strategyTitle}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    {result.rationale}
                  </p>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-700 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase">Optimal Steps</span>
                    <p className="text-base font-bold text-white font-mono">
                      {result.recommendedStepCount} Steps
                    </p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-700 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase">Pass Price</span>
                    <p className="text-base font-bold text-amber-400 font-mono">
                      {result.recommendedPassPrice}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-700 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase">Estimated RPM</span>
                    <p className="text-base font-bold text-emerald-400 font-mono">
                      {result.estimatedRpm}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-700 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase">Unlock Rate</span>
                    <p className="text-base font-bold text-indigo-400 font-mono">
                      {result.conversionRate}
                    </p>
                  </div>
                </div>

                {/* Steps Recommended */}
                <div className="space-y-2 pt-2 border-t border-slate-700">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Recommended Task Progression</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.stepTypes.map((step, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-indigo-950/40 border border-indigo-800/80 text-indigo-300 rounded text-xs"
                      >
                        Step {idx + 1}: {step}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tactical Tips */}
                <div className="space-y-2 pt-2 border-t border-slate-700">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    <span>High-Retention Optimization Tactics</span>
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {result.optimizationTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Compliance Warnings */}
                {result.complianceWarnings.length > 0 && (
                  <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-700 space-y-1.5 text-xs">
                    <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Linktain Policy & Safety Safeguards</span>
                    </span>
                    <ul className="space-y-1 text-slate-400 text-[11px]">
                      {result.complianceWarnings.map((w, idx) => (
                        <li key={idx}>· {w}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
