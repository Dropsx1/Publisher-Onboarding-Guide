/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { GateSimulator } from './components/GateSimulator';
import { EarningsCalculator } from './components/EarningsCalculator';
import { AiGateAnalyzer } from './components/AiGateAnalyzer';
import { VoiceTranscriber } from './components/VoiceTranscriber';
import { AiChatbot } from './components/AiChatbot';
import { PayoutAndCompliance } from './components/PayoutAndCompliance';
import { KnowledgeBase } from './components/KnowledgeBase';
import { ContactModal } from './components/ContactModal';
import { Footer } from './components/Footer';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('overview');
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [externalChatPrompt, setExternalChatPrompt] = useState('');

  // Track active section via IntersectionObserver for navbar highlighting
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'gate-models', 'calculator', 'ai-strategist', 'voice-transcribe', 'chat-assistant', 'payouts', 'faq'];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleJumpToAction = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchFromTranscript = (text: string) => {
    setSearchQuery(text);
    const faqEl = document.getElementById('faq');
    if (faqEl) {
      faqEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSendTranscriptToChat = (text: string) => {
    setExternalChatPrompt(text);
    const chatEl = document.getElementById('chat-assistant');
    if (chatEl) {
      chatEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar
        onOpenSupport={() => setSupportModalOpen(true)}
        activeSection={activeSection}
      />

      <main className="flex-1">
        <Hero
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSelectAction={handleJumpToAction}
        />

        <GateSimulator />

        <EarningsCalculator />

        <AiGateAnalyzer />

        <VoiceTranscriber
          onSearchTranscript={handleSearchFromTranscript}
          onSendToChat={handleSendTranscriptToChat}
        />

        <AiChatbot
          externalPrompt={externalChatPrompt}
          onClearExternalPrompt={() => setExternalChatPrompt('')}
        />

        <PayoutAndCompliance />

        <KnowledgeBase
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </main>

      <Footer onOpenSupport={() => setSupportModalOpen(true)} />

      <ContactModal
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
      />
    </div>
  );
}
