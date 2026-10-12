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
import { AiChatbot, AppContextState } from './components/AiChatbot';
import { PayoutAndCompliance } from './components/PayoutAndCompliance';
import { KnowledgeBase } from './components/KnowledgeBase';
import { ContactModal } from './components/ContactModal';
import { Footer } from './components/Footer';
import { Sparkles, X, CheckCircle, Info, AlertTriangle, ArrowRight } from 'lucide-react';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('overview');
  const [externalChatPrompt, setExternalChatPrompt] = useState('');

  // Floating Co-pilot Drawer State
  const [isCopilotDrawerOpen, setIsCopilotDrawerOpen] = useState(false);

  // App Central Controlled State
  const [calculatorState, setCalculatorState] = useState({
    monthlyClicks: 65000,
    selectedTierId: 'tier1',
    gateConfig: 'hybrid' as '1step' | '2step' | '3step' | 'hybrid' | 'pass_only',
    passPrice: 1.99,
    passConversionPct: 4.5,
  });

  const [simulatorState, setSimulatorState] = useState({
    stepMode: 2 as 1 | 2 | 3,
    allowPass: true,
    passPrice: '1.49',
    destinationUrl: 'https://linktain.com/verified-content-demo',
  });

  const [faqCategory, setFaqCategory] = useState('all');

  const [analyzerPreset, setAnalyzerPreset] = useState<{
    destinationType?: string;
    destinationUrl?: string;
    targetNiche?: string;
    trafficSource?: string;
    monthlyClicks?: string;
    timestamp?: number;
  }>({});

  const [supportModalData, setSupportModalData] = useState<{
    isOpen: boolean;
    initialSubject?: string;
    initialMessage?: string;
  }>({
    isOpen: false,
  });

  // App notification banner
  const [notification, setNotification] = useState<{
    title: string;
    message: string;
    type: 'success' | 'info' | 'warning';
    id: number;
  } | null>(null);

  const showNotification = (
    title: string,
    message: string,
    type: 'success' | 'info' | 'warning' = 'success'
  ) => {
    const id = Date.now();
    setNotification({ title, message, type, id });
    setTimeout(() => {
      setNotification((curr) => (curr?.id === id ? null : curr));
    }, 4500);
  };

  // Track active section via scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'overview',
        'gate-models',
        'calculator',
        'ai-strategist',
        'voice-transcribe',
        'chat-assistant',
        'payouts',
        'faq',
      ];
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
    } else {
      setIsCopilotDrawerOpen(true);
    }
  };

  // Co-pilot Tool Call Execution Handler
  const handleExecuteToolCall = (name: string, args: any) => {
    console.log(`Executing co-pilot tool: ${name}`, args);

    if (name === 'navigate_to_section') {
      const sectionId = args.sectionId;
      if (sectionId) {
        handleJumpToAction(sectionId);
        showNotification(
          'Navigated via Co-pilot',
          `Viewing section: ${sectionId.replace(/-/g, ' ')}`,
          'info'
        );
      }
    } else if (name === 'update_calculator') {
      setCalculatorState((prev) => ({
        ...prev,
        monthlyClicks: args.monthlyClicks !== undefined ? args.monthlyClicks : prev.monthlyClicks,
        selectedTierId: args.tierId !== undefined ? args.tierId : prev.selectedTierId,
        gateConfig: args.gateConfig !== undefined ? args.gateConfig : prev.gateConfig,
        passPrice: args.passPrice !== undefined ? args.passPrice : prev.passPrice,
        passConversionPct:
          args.passConversionPct !== undefined ? args.passConversionPct : prev.passConversionPct,
      }));
      showNotification(
        'Calculator Parameters Updated',
        `Co-pilot adjusted clicks & pricing models in real-time.`,
        'success'
      );
    } else if (name === 'configure_gate_simulator') {
      setSimulatorState((prev) => ({
        ...prev,
        stepMode: args.stepMode !== undefined ? args.stepMode : prev.stepMode,
        allowPass: args.allowPass !== undefined ? args.allowPass : prev.allowPass,
        passPrice: args.passPrice !== undefined ? args.passPrice : prev.passPrice,
        destinationUrl: args.destinationUrl !== undefined ? args.destinationUrl : prev.destinationUrl,
      }));
      showNotification(
        'Gate Simulator Configured',
        `Live sandbox updated to ${args.stepMode || simulatorState.stepMode} steps.`,
        'success'
      );
    } else if (name === 'filter_knowledge_base') {
      if (args.category !== undefined) setFaqCategory(args.category);
      if (args.searchQuery !== undefined) setSearchQuery(args.searchQuery);
      handleJumpToAction('faq');
      showNotification(
        'Knowledge Base Filtered',
        `Showing category: ${args.category || 'all'}`,
        'info'
      );
    } else if (name === 'open_support_ticket') {
      setSupportModalData({
        isOpen: true,
        initialSubject: args.subject || 'Integration & Gate Setup',
        initialMessage: args.draftMessage || '',
      });
      showNotification(
        'Support Desk Modal Opened',
        'Drafted inquiry is ready for review.',
        'info'
      );
    } else if (name === 'populate_gate_analyzer') {
      setAnalyzerPreset({
        destinationType: args.destinationType,
        destinationUrl: args.destinationUrl,
        targetNiche: args.targetNiche,
        trafficSource: args.trafficSource,
        monthlyClicks: args.monthlyClicks,
        timestamp: Date.now(),
      });
      handleJumpToAction('ai-strategist');
      showNotification(
        'Gate Advisor Form Populated',
        'Parameters transferred to Gemini Gate Advisor.',
        'success'
      );
    } else if (name === 'trigger_app_notification') {
      showNotification(args.title, args.message, args.type || 'info');
    }
  };

  // Situational App Context Payload for the Co-pilot
  const appContext: AppContextState = {
    currentSection: activeSection,
    sectionTitle: activeSection.replace(/-/g, ' ').toUpperCase(),
    calculator: {
      monthlyClicks: calculatorState.monthlyClicks,
      selectedTierId: calculatorState.selectedTierId,
      gateConfig: calculatorState.gateConfig,
      passPrice: calculatorState.passPrice,
      passConversionPct: calculatorState.passConversionPct,
    },
    gateSimulator: {
      stepMode: simulatorState.stepMode,
      allowPass: simulatorState.allowPass,
      passPrice: simulatorState.passPrice,
      destinationUrl: simulatorState.destinationUrl,
    },
    faqFilter: {
      category: faqCategory,
      searchQuery: searchQuery,
    },
    aiAnalyzer: {
      destinationType: analyzerPreset.destinationType,
      targetNiche: analyzerPreset.targetNiche,
      trafficSource: analyzerPreset.trafficSource,
    },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 max-w-sm w-full bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-2xl flex items-start gap-3 animate-fadeIn">
          {notification.type === 'success' && (
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          )}
          {notification.type === 'info' && (
            <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          )}
          {notification.type === 'warning' && (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 space-y-0.5">
            <p className="text-xs font-bold text-white">{notification.title}</p>
            <p className="text-[11px] text-slate-300">{notification.message}</p>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <Navbar
        onOpenSupport={() => setSupportModalData({ isOpen: true })}
        activeSection={activeSection}
      />

      <main className="flex-1">
        <Hero
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSelectAction={handleJumpToAction}
        />

        <GateSimulator
          stepMode={simulatorState.stepMode}
          setStepMode={(m) => setSimulatorState((s) => ({ ...s, stepMode: m }))}
          allowPass={simulatorState.allowPass}
          setAllowPass={(a) => setSimulatorState((s) => ({ ...s, allowPass: a }))}
          passPrice={simulatorState.passPrice}
          setPassPrice={(p) => setSimulatorState((s) => ({ ...s, passPrice: p }))}
          destinationUrl={simulatorState.destinationUrl}
          setDestinationUrl={(u) => setSimulatorState((s) => ({ ...s, destinationUrl: u }))}
        />

        <EarningsCalculator
          monthlyClicks={calculatorState.monthlyClicks}
          setMonthlyClicks={(c) => setCalculatorState((s) => ({ ...s, monthlyClicks: c }))}
          selectedTierId={calculatorState.selectedTierId}
          setSelectedTierId={(t) => setCalculatorState((s) => ({ ...s, selectedTierId: t }))}
          gateConfig={calculatorState.gateConfig}
          setGateConfig={(g) => setCalculatorState((s) => ({ ...s, gateConfig: g }))}
          passPrice={calculatorState.passPrice}
          setPassPrice={(p) => setCalculatorState((s) => ({ ...s, passPrice: p }))}
          passConversionPct={calculatorState.passConversionPct}
          setPassConversionPct={(pct) =>
            setCalculatorState((s) => ({ ...s, passConversionPct: pct }))
          }
        />

        <AiGateAnalyzer externalPreset={analyzerPreset} />

        <VoiceTranscriber
          onSearchTranscript={handleSearchFromTranscript}
          onSendToChat={handleSendTranscriptToChat}
        />

        {/* Embedded Full-Width Section Co-pilot */}
        <AiChatbot
          externalPrompt={externalChatPrompt}
          onClearExternalPrompt={() => setExternalChatPrompt('')}
          appContext={appContext}
          onExecuteToolCall={handleExecuteToolCall}
        />

        <PayoutAndCompliance />

        <KnowledgeBase
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={faqCategory}
          setSelectedCategory={setFaqCategory}
        />
      </main>

      <Footer onOpenSupport={() => setSupportModalData({ isOpen: true })} />

      <ContactModal
        isOpen={supportModalData.isOpen}
        onClose={() => setSupportModalData({ isOpen: false })}
        initialSubject={supportModalData.initialSubject}
        initialMessage={supportModalData.initialMessage}
      />

      {/* Persistent Floating Co-pilot Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsCopilotDrawerOpen(!isCopilotDrawerOpen)}
          className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-full shadow-2xl shadow-indigo-600/50 flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95 cursor-pointer border border-indigo-400/30"
          aria-label="Toggle Linktain Co-pilot Drawer"
        >
          <div className="relative">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <span>Co-pilot Assistant</span>
          <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded-full font-semibold">
            {activeSection}
          </span>
        </button>
      </div>

      {/* Floating Co-pilot Slide-Over Drawer */}
      {isCopilotDrawerOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-slideLeft">
          <AiChatbot
            isFloatingDrawer={true}
            onCloseDrawer={() => setIsCopilotDrawerOpen(false)}
            externalPrompt={externalChatPrompt}
            onClearExternalPrompt={() => setExternalChatPrompt('')}
            appContext={appContext}
            onExecuteToolCall={handleExecuteToolCall}
          />
        </div>
      )}
    </div>
  );
}
