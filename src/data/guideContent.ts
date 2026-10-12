export interface FaqItem {
  id: string;
  category: 'general' | 'gates' | 'passes' | 'payouts' | 'security';
  question: string;
  answer: string;
}

export interface GateStepType {
  id: string;
  name: string;
  type: string;
  avgDuration: string;
  rpmContribution: string;
  completionRate: string;
  description: string;
  recommendation: string;
}

export interface TrafficTier {
  id: string;
  name: string;
  countries: string;
  baseCpm: number;
  multiplier: number;
}

export const TRAFFIC_TIERS: TrafficTier[] = [
  {
    id: 'tier1',
    name: 'Tier 1 (High Value)',
    countries: 'United States, United Kingdom, Canada, Australia, Germany',
    baseCpm: 24.5,
    multiplier: 1.0,
  },
  {
    id: 'tier2',
    name: 'Tier 2 (Moderate Value)',
    countries: 'France, Spain, Italy, Netherlands, Japan, South Korea',
    baseCpm: 15.2,
    multiplier: 0.65,
  },
  {
    id: 'tier3',
    name: 'Tier 3 (Emerging & Global)',
    countries: 'Brazil, India, Mexico, Philippines, Global Rest of World',
    baseCpm: 7.8,
    multiplier: 0.35,
  },
];

export const GATE_STEPS: GateStepType[] = [
  {
    id: 'search',
    name: 'Sponsored Topic Search',
    type: 'Search & Discovery',
    avgDuration: '5-8 sec',
    rpmContribution: '+$6.00 to $10.00',
    completionRate: '88%',
    description: 'Visitors view a relevant sponsored search recommendation or topic before proceeding to the link.',
    recommendation: 'Best for gaming guides, software downloads, and tech blogs.',
  },
  {
    id: 'article',
    name: 'Curated Article Engagement',
    type: 'Content Discovery',
    avgDuration: '10 sec',
    rpmContribution: '+$4.50 to $8.00',
    completionRate: '82%',
    description: 'A 10-second preview of related publisher content or sponsored articles with a countdown timer.',
    recommendation: 'Ideal as Step 1 in a 2-step balanced gate.',
  },
  {
    id: 'app_install',
    name: 'App / Software Discovery',
    type: 'CPA / App Promotion',
    avgDuration: 'Variable',
    rpmContribution: '+$12.00 to $28.00',
    completionRate: '54%',
    description: 'Optional task where users discover verified mobile apps, desktop utilities, or extensions.',
    recommendation: 'Highest payout per conversion; recommend pairing with a direct pass alternative.',
  },
  {
    id: 'survey',
    name: 'Quick Consumer Survey',
    type: 'Interactive CPA',
    avgDuration: '15-30 sec',
    rpmContribution: '+$8.00 to $18.00',
    completionRate: '61%',
    description: 'Short multi-question brand survey matched to the visitor geographic region.',
    recommendation: 'Great for high-intent traffic such as exclusive templates and asset libraries.',
  },
];

export const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'general',
    question: 'What is Linktain and how does it monetize links?',
    answer:
      'Linktain is a modern monetization gateway. When you wrap any destination URL, file download, or private community link (like Discord or Telegram) with Linktain, visitors complete short sponsored tasks (such as viewing an article or searching a topic) or purchase a pass to gain access. Linktain shares the advertising and pass revenue directly with you.',
  },
  {
    id: 'faq-2',
    category: 'gates',
    question: 'How many gate steps should I configure?',
    answer:
      'For the highest overall revenue, we recommend a 2-step gate configuration. A 1-step gate yields maximum completion (~88%) but lower total RPM (~$10-$14). A 2-step gate balances an 75-80% completion rate with a strong $18-$24 RPM. 4+ steps often cause excessive drop-off unless the gated asset is truly rare.',
  },
  {
    id: 'faq-3',
    category: 'passes',
    question: 'Can visitors bypass the ad tasks by paying?',
    answer:
      'Yes. Linktain allows creators to offer Direct Passes alongside or instead of ad tasks. You can price passes from $0.99 up to $29.99 (either one-time or auto-renewing subscriptions). Visitors who do not want to complete steps can unlock the content instantly with Apple Pay, Google Pay, or card, and you keep up to 90% of the pass value.',
  },
  {
    id: 'faq-4',
    category: 'security',
    question: 'Does Linktain store my visitors\' IP addresses?',
    answer:
      'No. Linktain is built with a strict privacy-first architecture. We never store raw visitor IP addresses in plaintext. Instead, incoming requests are passed through a cryptographic one-way salted hash function strictly used to prevent automated bot clicks and fraud. We respect user privacy while preserving network integrity.',
  },
  {
    id: 'faq-5',
    category: 'payouts',
    question: 'What are the payout methods and minimum withdrawal thresholds?',
    answer:
      'Payouts can be requested via PayPal (minimum $20), Cryptocurrency (USDT / USDC on TRC20 and ERC20, minimum $50), and Bank Wire Transfer (minimum $100). Payments are processed twice per month on the 15th and the final business day of the month.',
  },
  {
    id: 'faq-6',
    category: 'gates',
    question: 'Where can I share my Linktain links?',
    answer:
      'You can share your links across YouTube video descriptions, Telegram channels, Discord servers, X/Twitter, personal blogs, Reddit communities (where permitted by subreddit rules), and email newsletters. Always provide clear context so visitors know what content awaits them behind the gate.',
  },
  {
    id: 'faq-7',
    category: 'security',
    question: 'What traffic sources are prohibited on Linktain?',
    answer:
      'Prohibited traffic includes artificial bot traffic, automated click farms, traffic exchanges (PTC/autosurf), misleading URL cloaking, and linking to malicious content (malware, phishing, or illegal media). Accounts engaging in fraudulent traffic generation will be terminated and balances forfeited.',
  },
  {
    id: 'faq-8',
    category: 'passes',
    question: 'What is the chargeback policy on Creator Passes?',
    answer:
      'Linktain handles all payment fraud screening and merchant processing fees. Verified digital unlocks are covered under digital goods terms, protecting publishers from frivolous chargebacks.',
  },
];

export const BEST_PRACTICE_TIPS = [
  {
    title: 'Set High-Intent Expectation',
    text: 'Briefly explain in your post or description: "Click the link and complete the quick 10-second unlock to get the file." Transparency cuts bounce rates by 35%.',
  },
  {
    title: 'Pair High-Value Assets with Hybrid Gates',
    text: 'For valuable items (e.g. presets, scripts, curated databases), offer both 2 ad steps for free users AND a $1.99 direct pass. Up to 8% of users gladly pay to skip.',
  },
  {
    title: 'Optimize for Mobile Traffic',
    text: 'Over 65% of Linktain traffic is mobile. Linktain gates automatically adapt with tap-friendly responsive buttons and ultra-fast lightweight scripts.',
  },
  {
    title: 'Monitor Drop-off in Analytics',
    text: 'If your completion rate dips below 60%, lower your gate step count by 1 or switch from app discovery tasks to quick topic search tasks.',
  },
];
