import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Search, Layers, Zap, DollarSign, Shield } from 'lucide-react';
import { FAQS, FaqItem } from '../data/guideContent';

interface KnowledgeBaseProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory?: string;
  setSelectedCategory?: (cat: string) => void;
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory: controlledCategory,
  setSelectedCategory: setControlledCategory,
}) => {
  const [internalCategory, setInternalCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>('faq-1');

  const selectedCategory = controlledCategory !== undefined ? controlledCategory : internalCategory;
  const setSelectedCategory = setControlledCategory || setInternalCategory;

  const categories = [
    { id: 'all', label: 'All FAQs' },
    { id: 'general', label: 'Getting Started' },
    { id: 'gates', label: 'Gate Steps' },
    { id: 'passes', label: 'Creator Passes' },
    { id: 'payouts', label: 'Payouts & Cashout' },
    { id: 'security', label: 'Salted IP & Security' },
  ];

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory =
      selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-16 border-t border-slate-700/80 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-3 mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Knowledge Base</span>
            <span aria-hidden="true">·</span>
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight text-balance">
            Publisher Answers & Documentation Archive
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Everything you need to know about link wrapping, ad task rotations, creator pass setup, and revenue disbursement.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="max-w-4xl space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/60 border border-slate-700 rounded-2xl text-slate-400 text-xs">
              <p>No matching questions found for &ldquo;{searchQuery}&rdquo;.</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-indigo-400 underline hover:text-indigo-300"
              >
                Clear search filter
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isExpanded = expandedId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-slate-900/80 border border-slate-700 rounded-xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-850 transition-colors"
                  >
                    <span className="text-sm font-bold text-white">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180 text-indigo-400' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-700/60">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
