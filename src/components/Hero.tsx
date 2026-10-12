import React from 'react';
import { Search, Sparkles, Sliders, ShieldCheck, DollarSign, Mic } from 'lucide-react';
import heroBannerImg from '../assets/images/linktain_hero_banner_1791815746422.jpg';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectAction: (targetId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  setSearchQuery,
  onSelectAction,
}) => {
  return (
    <section id="overview" className="relative pt-12 pb-16 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headline, Value Proposition, Search */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-400 uppercase tracking-widest">
              <span>Official Publisher Documentation</span>
              <span aria-hidden="true">·</span>
              <span>Updated for 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight text-balance">
              The Complete Playbook for Link Monetization & Gate Optimization
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Turn your destination URLs, private channels, and digital downloads into predictable revenue streams. Master step gate architecture, pass pricing models, and privacy-first fraud protection on Linktain.
            </p>

            {/* Guide Interactive Search Bar */}
            <div className="relative max-w-xl">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search guide (e.g. step count, payouts, salted IP, bypass pass, Telegram)..."
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Quick-Jump Section Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                onClick={() => onSelectAction('gate-simulator')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-800/90 hover:bg-slate-700 hover:text-white rounded-lg border border-slate-700/60 transition-colors cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                <span>Gate Simulator</span>
              </button>
              <button
                onClick={() => onSelectAction('calculator')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-800/90 hover:bg-slate-700 hover:text-white rounded-lg border border-slate-700/60 transition-colors cursor-pointer"
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Earnings Calculator</span>
              </button>
              <button
                onClick={() => onSelectAction('ai-strategist')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-800/90 hover:bg-slate-700 hover:text-white rounded-lg border border-slate-700/60 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Gemini Gate Advisor</span>
              </button>
              <button
                onClick={() => onSelectAction('voice-transcribe')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-800/90 hover:bg-slate-700 hover:text-white rounded-lg border border-slate-700/60 transition-colors cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5 text-amber-400" />
                <span>Transcribe Memo</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset with Fallback */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group">
              <img
                src={heroBannerImg}
                alt="Linktain Publisher Operations Dashboard"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover aspect-video group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-xs text-slate-300 flex items-center justify-between">
                <span className="font-medium text-white">Live Creator Console Overview</span>
                <span className="text-slate-400">High-Converting Gating Engine</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Item Quantitative Rigor Strip */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <p className="text-2xl lg:text-3xl font-extrabold text-white font-mono tabular-nums">
              $18.40
            </p>
            <p className="text-xs text-slate-400 font-medium">Average 2-Step Gate RPM</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl lg:text-3xl font-extrabold text-white font-mono tabular-nums">
              99.8%
            </p>
            <p className="text-xs text-slate-400 font-medium">Salted IP Anti-Fraud Rate</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl lg:text-3xl font-extrabold text-white font-mono tabular-nums">
              24-48h
            </p>
            <p className="text-xs text-slate-400 font-medium">Bi-Weekly Payout Dispatch</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl lg:text-3xl font-extrabold text-white font-mono tabular-nums">
              Zero
            </p>
            <p className="text-xs text-slate-400 font-medium">Chargeback Risk on Passes</p>
          </div>
        </div>
      </div>
    </section>
  );
};
