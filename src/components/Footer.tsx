import React from 'react';
import { ArrowUp } from 'lucide-react';

interface FooterProps {
  onOpenSupport: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSupport }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start justify-between">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <span className="font-extrabold text-xs">LT</span>
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Linktain Publisher Guide
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Empowering digital creators, developers, and online publishers with high-converting link gating architecture, privacy-first analytics, and seamless global disbursements.
            </p>
            <p className="text-[11px] text-slate-400 pt-1">
              Direct Contact: <a href="mailto:Andrew@linktain.com" className="text-indigo-400 hover:underline">Andrew@linktain.com</a>
            </p>
          </div>

          {/* Quick Nav Col */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Guide Sections
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a href="#overview" className="hover:text-white transition-colors">
                  Overview & Search
                </a>
              </li>
              <li>
                <a href="#gate-models" className="hover:text-white transition-colors">
                  Gate Models & Tasks
                </a>
              </li>
              <li>
                <a href="#calculator" className="hover:text-white transition-colors">
                  Earnings & RPM Calculator
                </a>
              </li>
              <li>
                <a href="#ai-strategist" className="hover:text-white transition-colors">
                  Gemini Gate Advisor
                </a>
              </li>
              <li>
                <a href="#payouts" className="hover:text-white transition-colors">
                  Payouts & Salted IP Privacy
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Legal / Desk Col */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Publisher Resources
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Need assistance with custom API link creation, Telegram bot webhook gating, or VIP revenue tiers?
            </p>
            <button
              onClick={onOpenSupport}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              Open Publisher Support Ticket
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} Linktain. All rights reserved. Built for publishers worldwide.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
