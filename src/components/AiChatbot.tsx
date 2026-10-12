import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  Zap,
  Trash2,
  Copy,
  Check,
  Loader2,
  Wrench,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Table as TableIcon,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { parseRichMessage, RichMessageBlock } from '../utils/richMessageParser';

export interface AppContextState {
  currentSection: string;
  sectionTitle?: string;
  calculator?: {
    monthlyClicks: number;
    selectedTierId: string;
    gateConfig: string;
    passPrice: number;
    passConversionPct: number;
  };
  gateSimulator?: {
    stepMode: number;
    allowPass: boolean;
    passPrice: string;
    destinationUrl: string;
  };
  faqFilter?: {
    category: string;
    searchQuery: string;
  };
  aiAnalyzer?: {
    destinationType?: string;
    destinationUrl?: string;
    targetNiche?: string;
    trafficSource?: string;
  };
}

export interface ToolCallExecution {
  name: string;
  args: any;
  id?: string;
  executedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  toolCalls?: ToolCallExecution[];
}

interface AiChatbotProps {
  externalPrompt?: string;
  onClearExternalPrompt?: () => void;
  appContext?: AppContextState;
  onExecuteToolCall?: (name: string, args: any) => void;
  isFloatingDrawer?: boolean;
  onCloseDrawer?: () => void;
}

export const AiChatbot: React.FC<AiChatbotProps> = ({
  externalPrompt,
  onClearExternalPrompt,
  appContext,
  onExecuteToolCall,
  isFloatingDrawer = false,
  onCloseDrawer,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Hello! I am your Linktain Publisher Co-pilot. I can advise you on optimal gate architectures, compare RPM benchmarks, calculate earnings forecasts, or execute actions directly (such as adjusting the calculator, testing simulator gates, or filtering FAQs). How can I assist your publishing strategy today?`,
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fastMode, setFastMode] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Handle incoming voice prompt from VoiceTranscriber
  useEffect(() => {
    if (externalPrompt && externalPrompt.trim()) {
      handleSend(externalPrompt);
      if (onClearExternalPrompt) {
        onClearExternalPrompt();
      }
    }
  }, [externalPrompt]);

  // Dynamic Context-Sensitive Quick-Start Suggestion Chips
  const getContextChips = (): string[] => {
    const sec = appContext?.currentSection || 'overview';
    switch (sec) {
      case 'calculator':
        return [
          'Simulate 120k clicks in Tier 1 with Hybrid Gate',
          'Compare 1-step vs 2-step RPM in a table',
          'Set pass price to $2.99 in calculator',
          'Which payout channel is best for my volume?',
        ];
      case 'gate-models':
        return [
          'Configure simulator to 2 steps with $1.49 pass',
          'Why do 2-step gates outperform 1-step gates?',
          'Test a 1-step gate for high-conversion downloads',
          'Explain sponsored search vs CPA app discovery',
        ];
      case 'ai-strategist':
        return [
          'Analyze gating for a Telegram VIP signals channel',
          'Recommend setup for software & game mod downloads',
          'What pass price works best for Notion templates?',
          'How to prevent fraudulent bot clicks?',
        ];
      case 'payouts':
        return [
          'What is the minimum threshold for Crypto USDT?',
          'How does salted IP hashing protect visitor privacy?',
          'Open support ticket for bank wire setup',
          'When is the next bi-weekly payout dispatch?',
        ];
      case 'faq':
        return [
          'Filter FAQs to Creator Passes',
          'Filter FAQs to Salted IP Security',
          'What traffic sources are strictly prohibited?',
          'Navigate to the Earnings Calculator',
        ];
      default:
        return [
          'Recommend optimal gate setup for Telegram VIP',
          'Simulate earnings for 50,000 monthly clicks',
          'Configure simulator to 2 steps with pass',
          'Explain Linktain salted IP privacy policy',
        ];
    }
  };

  const handleSend = async (textToSend?: string) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Build history for multi-turn chat (excluding the initial greeting)
      const historyPayload = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          history: historyPayload,
          fastMode,
          context: appContext || {},
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to receive reply from Gemini');
      }

      const data = await res.json();

      // Execute tool calls returned by Gemini
      const executedToolCalls: ToolCallExecution[] = [];
      if (data.toolCalls && Array.isArray(data.toolCalls) && data.toolCalls.length > 0) {
        for (const tool of data.toolCalls) {
          executedToolCalls.push({
            name: tool.name,
            args: tool.args,
            id: tool.id,
            executedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });

          if (onExecuteToolCall) {
            onExecuteToolCall(tool.name, tool.args);
          }
        }
      }

      const modelMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: data.reply || 'Request processed.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        toolCalls: executedToolCalls.length > 0 ? executedToolCalls : undefined,
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (err: any) {
      console.error(err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: `Error connecting to Gemini: ${err?.message || 'Please check your connection and try again.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        text: `Hello! I am your Linktain Publisher Co-pilot. I can advise you on optimal gate architectures, compare RPM benchmarks, calculate earnings forecasts, or execute actions directly (such as adjusting the calculator, testing simulator gates, or filtering FAQs). How can I assist your publishing strategy today?`,
        timestamp: 'Just now',
      },
    ]);
  };

  // Render Rich UI components from parsed message blocks
  const renderMessageContent = (msg: ChatMessage) => {
    const blocks = parseRichMessage(msg.text);

    return (
      <div className="space-y-3.5">
        {/* Tool Call Action Receipt Badges */}
        {msg.toolCalls && msg.toolCalls.length > 0 && (
          <div className="space-y-2">
            {msg.toolCalls.map((tc, idx) => (
              <div
                key={idx}
                className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl space-y-1.5 text-xs text-emerald-200"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5 text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Action Executed: {tc.name.replace(/_/g, ' ')}</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">{tc.executedAt}</span>
                </div>
                {tc.args && Object.keys(tc.args).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {Object.entries(tc.args).map(([k, v]) => (
                      <span
                        key={k}
                        className="px-2 py-0.5 rounded bg-emerald-900/50 text-[11px] text-emerald-200 font-mono"
                      >
                        {k}: {String(v)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Parsed Rich UI Blocks */}
        {blocks.map((block, idx) => {
          if (block.type === 'metric-grid' && block.metrics) {
            return (
              <div key={idx} className="grid grid-cols-2 gap-2 my-2">
                {block.metrics.map((m, mIdx) => (
                  <div
                    key={mIdx}
                    className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-center space-y-0.5"
                  >
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">
                      {m.label}
                    </span>
                    <p className="text-base font-extrabold text-white font-mono tabular-nums">
                      {m.value}
                    </p>
                    {m.detail && (
                      <span className="text-[10px] text-indigo-400 block">{m.detail}</span>
                    )}
                  </div>
                ))}
              </div>
            );
          }

          if (block.type === 'summary-table' && block.table) {
            return (
              <div key={idx} className="my-2 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/90 p-2">
                {block.table.title && (
                  <p className="text-xs font-bold text-white px-2 py-1.5 flex items-center gap-1.5">
                    <TableIcon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{block.table.title}</span>
                  </p>
                )}
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      {block.table.headers.map((h, hIdx) => (
                        <th key={hIdx} className="px-2.5 py-1.5 font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 text-slate-200">
                    {block.table.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-900/60 transition-colors">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-2.5 py-1.5 font-mono">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }

          if (block.type === 'action-buttons' && block.buttons) {
            return (
              <div key={idx} className="flex flex-wrap gap-2 my-2">
                {block.buttons.map((btn, bIdx) => (
                  <button
                    key={bIdx}
                    onClick={() => {
                      if (onExecuteToolCall) {
                        if (btn.action === 'calculator') {
                          onExecuteToolCall('update_calculator', btn.params || {});
                          onExecuteToolCall('navigate_to_section', { sectionId: 'calculator' });
                        } else if (btn.action === 'simulator') {
                          onExecuteToolCall('configure_gate_simulator', btn.params || {});
                          onExecuteToolCall('navigate_to_section', { sectionId: 'gate-models' });
                        } else {
                          onExecuteToolCall(btn.action, btn.params || {});
                        }
                      }
                    }}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>{btn.label}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                ))}
              </div>
            );
          }

          // Plain text block
          return (
            <p key={idx} className="whitespace-pre-wrap leading-relaxed">
              {block.content}
            </p>
          );
        })}
      </div>
    );
  };

  const containerClasses = isFloatingDrawer
    ? 'flex flex-col h-full bg-slate-900'
    : 'bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[680px] max-w-4xl mx-auto';

  return (
    <section id={isFloatingDrawer ? undefined : 'chat-assistant'} className={isFloatingDrawer ? 'h-full' : 'py-16 border-t border-slate-800/80'}>
      {!isFloatingDrawer && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3 mb-10">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              <Bot className="w-3.5 h-3.5" />
              <span>Full-Stack Action Co-Pilot</span>
              <span aria-hidden="true">·</span>
              <span>Context-Aware Gemini</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight text-balance">
              Linktain Publisher Co-pilot & Action Assistant
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Equipped with live viewport awareness, tool execution capabilities, and tailored publisher intelligence. Ask questions, simulate traffic, configure gates, or execute actions directly.
            </p>
          </div>
        </div>
      )}

      {/* Main Chat Box */}
      <div className={containerClasses}>
        {/* Header */}
        <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-white">Linktain Publisher Co-pilot</p>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Action Ready
                </span>
              </div>
              <p className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span>Viewport: <span className="text-indigo-300 capitalize">{appContext?.currentSection || 'overview'}</span></span>
                <span aria-hidden="true">·</span>
                <span>{fastMode ? 'gemini-3.1-flash-lite' : 'gemini-3.8-flash'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Fast mode toggle */}
            <button
              onClick={() => setFastMode(!fastMode)}
              className={`px-2.5 py-1 text-xs rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                fastMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title="Toggle fast model vs standard reasoning"
            >
              <Zap className="w-3 h-3" />
              <span>{fastMode ? 'Fast' : 'Pro 3.8'}</span>
            </button>

            <button
              onClick={handleResetChat}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Reset conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {isFloatingDrawer && onCloseDrawer && (
              <button
                onClick={onCloseDrawer}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer text-xs"
                title="Close drawer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-900/60">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-2xl ${
                msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs ${
                  msg.role === 'user'
                    ? 'bg-slate-700 text-white'
                    : 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`group relative rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/70 rounded-tl-none shadow-md'
                }`}
              >
                {renderMessageContent(msg)}

                <div className="mt-2 pt-1 border-t border-slate-700/50 flex items-center justify-between gap-3 text-[10px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  {msg.role === 'model' && (
                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.text)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-white cursor-pointer inline-flex items-center gap-1"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 max-w-xl">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white shrink-0 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-800/90 rounded-2xl rounded-tl-none px-4 py-3 border border-slate-700/70 flex items-center gap-2.5 text-xs text-slate-300">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                <span>Linktain Co-pilot is analyzing context & executing actions...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Dynamic Context-Sensitive Quick-Start Suggestion Chips */}
        {!loading && (
          <div className="px-4 py-2 bg-slate-950/90 border-t border-slate-800 flex gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] uppercase font-bold text-indigo-400 self-center whitespace-nowrap pl-1">
              Suggested:
            </span>
            {getContextChips().map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 text-[11px] bg-slate-800/90 hover:bg-slate-750 text-slate-300 hover:text-white rounded-lg border border-slate-700 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask co-pilot or execute action (e.g. "Simulate 150k clicks in Tier 1")...`}
            disabled={loading}
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl transition-all cursor-pointer shrink-0 shadow-md shadow-indigo-600/30"
            aria-label="Send co-pilot prompt"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </section>
  );
};
