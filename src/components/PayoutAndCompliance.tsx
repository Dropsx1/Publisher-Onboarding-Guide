import React from 'react';
import {
  CreditCard,
  ShieldCheck,
  Calendar,
  Lock,
  CheckCircle,
  XCircle,
  HelpCircle,
  Coins,
  Building,
} from 'lucide-react';
import securityImg from '../assets/images/linktain_security_compliance_1791815778002.jpg';

export const PayoutAndCompliance: React.FC = () => {
  return (
    <section id="payouts" className="py-16 border-t border-slate-700/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl space-y-3 mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <span>Finance & Infrastructure</span>
            <span aria-hidden="true">·</span>
            <span>Policy Guidelines</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight text-balance">
            Payout Architecture, Salted IP Privacy & Safety Rules
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Linktain operates on transparent, timely financial disbursements combined with zero-raw-IP privacy standards for both creators and visitors.
          </p>
        </div>

        {/* 3 Payment Rails Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Rail 1: PayPal */}
          <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">PayPal Disbursement</h3>
              <p className="text-xs text-slate-400 mt-1">
                Fast digital wallet payout ideal for emerging creators and international publishers.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-700/80 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Minimum Threshold:</span>
                <span className="font-mono font-bold text-white">$20.00 USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Processing Fee:</span>
                <span className="font-mono text-emerald-400 font-semibold">$0 Linktain Fee</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Dispatch Window:</span>
                <span className="text-slate-300">Bi-Weekly Batch</span>
              </div>
            </div>
          </div>

          {/* Rail 2: Crypto USDT / USDC */}
          <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">USDT / USDC Crypto</h3>
              <p className="text-xs text-slate-400 mt-1">
                Direct on-chain stablecoin transfer supported across TRC20 and ERC20 networks.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-700/80 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Minimum Threshold:</span>
                <span className="font-mono font-bold text-white">$50.00 USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Supported Networks:</span>
                <span className="text-slate-300 font-mono">TRC-20, ERC-20</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Settlement:</span>
                <span className="text-slate-300">Within 24 Hours</span>
              </div>
            </div>
          </div>

          {/* Rail 3: Bank Wire Transfer */}
          <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Direct Bank Wire</h3>
              <p className="text-xs text-slate-400 mt-1">
                Direct SWIFT or domestic ACH deposit for high-volume publishing agencies and top creators.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-700/80 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Minimum Threshold:</span>
                <span className="font-mono font-bold text-white">$100.00 USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Currency:</span>
                <span className="text-slate-300">USD / EUR / GBP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Audit Status:</span>
                <span className="text-slate-300">Priority Processing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Salted IP Privacy Deep Dive with Generated Visual */}
        <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-6 sm:p-8 mb-16 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5" />
                <span>Zero-Raw-IP Privacy Policy</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
                How Linktain Protects Visitor Privacy via Cryptographic Salted IP Hashing
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Unlike legacy ad networks that log and track visitor browsing history and raw IP addresses, Linktain is engineered around visitor privacy.
              </p>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">One-Way Salted Hash:</span> Incoming visitor IP addresses are immediately run through a private cryptographic salt before being discarded from memory.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Anti-Fraud Validation:</span> The hashed token prevents automated click-farming without ever storing who the user is or their physical location.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">No Tracking Cookies:</span> Linktain does not deploy behavioral profiling cookies or cross-site tracking pixels.
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-xl overflow-hidden border border-slate-700 shadow-xl bg-slate-950">
                <img
                  src={securityImg}
                  alt="Linktain Salted IP Cryptographic Network Visual"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover aspect-4/3"
                />
                <div className="p-3 bg-slate-950 text-[11px] text-slate-400 flex justify-between">
                  <span>Cryptographic Hashing Pipeline</span>
                  <span className="text-cyan-400 font-mono">SHA-256 + Salt</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Traffic Compliance Standards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Permitted Traffic */}
          <div className="bg-slate-900/60 border border-emerald-900/30 rounded-2xl p-6 space-y-4">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Approved Publisher Traffic</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Genuine human clicks from YouTube descriptions, community tabs, and channel links.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Telegram channels, Discord server resource rooms, and Patreon member announcements.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Personal blogs, editorial reviews, gaming asset repositories, and tutorial downloads.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Social media bios (TikTok, Instagram, X/Twitter, Reddit with context).</span>
              </li>
            </ul>
          </div>

          {/* Prohibited Traffic */}
          <div className="bg-slate-900/60 border border-red-900/30 rounded-2xl p-6 space-y-4">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-400" />
              <span>Strictly Prohibited Practices</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-red-400">✕</span>
                <span>Automated bots, headless browsers, macro click scripts, or emulation software.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">✕</span>
                <span>Paid-to-click (PTC), autosurf networks, iframe auto-reloads, or hidden popup traffic.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">✕</span>
                <span>Malware, trojans, phishing destination targets, or copyright infringement.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">✕</span>
                <span>Incentivized fake completion rewards (violating advertiser merchant integrity).</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
