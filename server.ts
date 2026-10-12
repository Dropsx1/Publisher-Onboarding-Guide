import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { FunctionDeclaration, GenerateContentParameters, GenerateContentResponse, GoogleGenAI, Type } from '@google/genai';

dotenv.config({ quiet: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Support larger audio payloads for microphone recording transcription
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Initialize GoogleGenAI client on the server
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ---- Resilient Gemini calls: retry transient errors, then fall back through models ----
const FALLBACK_CHAINS = {
  normal: ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'],
  fast: ['gemini-3.1-flash-lite', 'gemini-3.5-flash-lite', 'gemini-2.5-flash-lite', 'gemini-2.5-flash'],
  transcribe: ['gemini-3.5-transcribe', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'],
};
const MAX_ATTEMPTS = 3;
const BACKOFF_MS = [1000, 2000, 4000];

class AllModelsFailedError extends Error {
  constructor(public lastError: unknown, public tried: string[]) {
    super('All Gemini models failed');
  }
}

function isTransientError(err: any): boolean {
  const status = Number(err?.status ?? err?.code ?? err?.error?.code);
  if ([429, 500, 502, 503, 504].includes(status)) return true;
  const msg = String(err?.message ?? err ?? '');
  return /UNAVAILABLE|RESOURCE_EXHAUSTED|INTERNAL|high demand|overloaded|\b(429|500|502|503|504)\b|fetch failed|ECONNRESET|ETIMEDOUT/i.test(msg);
}

function isModelUnusableError(err: any): boolean {
  const status = Number(err?.status ?? err?.code ?? err?.error?.code);
  if (status === 404) return true;
  return /NOT_FOUND|is not found|not supported|does not support/i.test(String(err?.message ?? ''));
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function generateWithFallback(
  models: string[],
  params: Omit<GenerateContentParameters, 'model'>,
  label: string,
): Promise<{ response: GenerateContentResponse; model: string }> {
  let lastError: unknown;
  const tried: string[] = [];
  for (const model of models) {
    tried.push(model);
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const response = await ai.models.generateContent({ ...params, model });
        console.log(`[gemini] ${label} served by ${model} (attempt ${attempt})`);
        return { response, model };
      } catch (err: any) {
        lastError = err;
        const transient = isTransientError(err);
        console.warn(`[gemini] ${label} ${model} attempt ${attempt}/${MAX_ATTEMPTS} failed${transient ? ' (transient)' : ''}: ${String(err?.message ?? err).slice(0, 200)}`);
        if (!transient) break; // non-transient: skip remaining retries, try next model
        if (attempt < MAX_ATTEMPTS) await sleep(BACKOFF_MS[attempt - 1] + Math.floor(Math.random() * 250));
      }
    }
    if (lastError && !isTransientError(lastError) && !isModelUnusableError(lastError)) {
      // Request-level error (e.g. bad input) - other models won't help
      throw lastError;
    }
  }
  throw new AllModelsFailedError(lastError, tried);
}

function sendGeminiError(res: Response, error: any, fallbackMsg: string) {
  if (error instanceof AllModelsFailedError) {
    res.status(503).json({
      error: 'Our AI assistant is temporarily busy due to high demand. Please try again in a minute.',
      retryable: true,
    });
    return;
  }
  res.status(500).json({ error: error?.message || fallbackMsg });
}

// Health check for Railway / uptime monitors
app.get('/healthz', (_req, res) => {
  res.json({ ok: true, ai: Boolean(process.env.GEMINI_API_KEY) });
});

// Fail fast with a clear message instead of hanging when the AI key is missing
app.use('/api/gemini', (_req, res, next) => {
  if (!process.env.GEMINI_API_KEY) {
    res.status(503).json({ error: 'AI features are not configured on this deployment (GEMINI_API_KEY missing).' });
    return;
  }
  next();
});

/**
 * Tool Declarations for Linktain Co-pilot Action Execution
 */
const copilotTools: FunctionDeclaration[] = [
  {
    name: 'navigate_to_section',
    description: "Scroll the user's viewport directly to a specific section of the Linktain Publisher Guide.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        sectionId: {
          type: Type.STRING,
          description: "Target section ID: 'overview', 'gate-models', 'calculator', 'ai-strategist', 'voice-transcribe', 'chat-assistant', 'payouts', 'faq'",
        },
        reason: {
          type: Type.STRING,
          description: 'Short explanation of why we navigated here',
        },
      },
      required: ['sectionId'],
    },
  },
  {
    name: 'update_calculator',
    description: "Adjust the interactive Earnings & RPM Calculator parameters on the user's screen in real-time.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        monthlyClicks: {
          type: Type.NUMBER,
          description: 'Monthly clicks to gated links (5000 to 500000)',
        },
        tierId: {
          type: Type.STRING,
          description: "Audience geographic tier: 'tier1' (US/UK/CA/AU/DE), 'tier2' (EU/JP/KR), 'tier3' (Global/Emerging)",
        },
        gateConfig: {
          type: Type.STRING,
          description: "Gating architecture: '1step', '2step', '3step', 'hybrid', or 'pass_only'",
        },
        passPrice: {
          type: Type.NUMBER,
          description: 'Price per creator pass in USD (e.g. 0.99, 1.49, 1.99, 2.99, 4.99)',
        },
        passConversionPct: {
          type: Type.NUMBER,
          description: 'Percentage of visitors who buy pass (1.0 to 15.0)',
        },
      },
    },
  },
  {
    name: 'configure_gate_simulator',
    description: "Update the live interactive Gate Simulator preview on the user's screen.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        stepMode: {
          type: Type.NUMBER,
          description: 'Number of sponsored steps: 1, 2, or 3',
        },
        allowPass: {
          type: Type.BOOLEAN,
          description: 'Whether to enable direct Creator Pass bypass',
        },
        passPrice: {
          type: Type.STRING,
          description: "Pass price string e.g. '0.99', '1.49', '2.99', '4.99'",
        },
        destinationUrl: {
          type: Type.STRING,
          description: 'Target destination resource URL',
        },
      },
    },
  },
  {
    name: 'filter_knowledge_base',
    description: 'Filter and search the Publisher Knowledge Base & FAQ.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        category: {
          type: Type.STRING,
          description: "FAQ category: 'all', 'general', 'gates', 'passes', 'payouts', 'security'",
        },
        searchQuery: {
          type: Type.STRING,
          description: 'Keyword search query to filter FAQ questions and guide content',
        },
      },
    },
  },
  {
    name: 'open_support_ticket',
    description: 'Open the Linktain Publisher Desk support modal with prefilled details.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        subject: {
          type: Type.STRING,
          description: "Inquiry topic: 'Integration & Gate Setup', 'VIP High-Volume Traffic Tier', 'Custom Creator Pass Pricing', 'Payout & Bank Wire Verification', or 'Other Question'",
        },
        draftMessage: {
          type: Type.STRING,
          description: 'Draft message explaining the publisher inquiry or request',
        },
      },
    },
  },
  {
    name: 'populate_gate_analyzer',
    description: 'Prefill the AI Gate Strategy & Monetization Architect form with publisher data.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        destinationType: {
          type: Type.STRING,
          description: "e.g. 'Telegram VIP Channel & Signals', 'Software / Game Mod Download', 'Design Preset Pack'",
        },
        destinationUrl: {
          type: Type.STRING,
          description: "Target URL e.g. 'https://t.me/pro_signals'",
        },
        targetNiche: {
          type: Type.STRING,
          description: "Content niche e.g. 'Finance & Trading', 'Gaming & Mods', 'Design & Templates'",
        },
        trafficSource: {
          type: Type.STRING,
          description: "Primary traffic source e.g. 'YouTube Descriptions', 'Discord Server', 'TikTok Bio'",
        },
        monthlyClicks: {
          type: Type.STRING,
          description: "Estimated monthly click count e.g. '50,000'",
        },
      },
    },
  },
  {
    name: 'trigger_app_notification',
    description: 'Trigger a visible status banner or toast message in the applet.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        title: {
          type: Type.STRING,
          description: 'Notification title',
        },
        message: {
          type: Type.STRING,
          description: 'Notification detail message',
        },
        type: {
          type: Type.STRING,
          description: "'success', 'info', or 'warning'",
        },
      },
      required: ['title', 'message'],
    },
  },
];

/**
 * 1. Multi-turn Co-pilot Chat Endpoint with Tool Calling & Context Injection
 */
app.post('/api/gemini/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, history = [], fastMode = false, context = {} } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const modelChain = fastMode ? FALLBACK_CHAINS.fast : FALLBACK_CHAINS.normal;

    // Format chat contents from history
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      for (const item of history) {
        if (item && item.text && (item.role === 'user' || item.role === 'model')) {
          contents.push({
            role: item.role,
            parts: [{ text: item.text }],
          });
        }
      }
    }

    // Append the current user message
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    // Build context-aware situational prompt block
    const contextPrompt = `
CURRENT APPLICATION STATE & USER VIEWPORT:
- Current Page Section: "${context.currentSection || 'overview'}" (${context.sectionTitle || 'Overview'})
- Active Calculator State: ${JSON.stringify(context.calculator || { monthlyClicks: 65000, tier: 'Tier 1', gateConfig: 'hybrid' })}
- Active Gate Simulator Preview: ${JSON.stringify(context.gateSimulator || { stepMode: 2, allowPass: true, passPrice: '1.49' })}
- Active FAQ Filters: Category="${context.faqFilter?.category || 'all'}", SearchQuery="${context.faqFilter?.searchQuery || ''}"
- Gate Strategy Form: ${JSON.stringify(context.aiAnalyzer || {})}
`;

    const systemInstruction = `You are the official Linktain Publisher Co-pilot & Revenue Optimization Lead.
Your mission: Act as an expert, context-aware co-pilot helping creators and publishers maximize monetization on every link, configure high-converting gates, calculate earnings forecasts, test visitor unlock flows, and ensure compliance.

${contextPrompt}

ACTION EXECUTION CAPABILITIES:
You have direct tool calling access to execute real actions in the user's interface:
- navigate_to_section: Scroll the user to any section when they ask or when relevant.
- update_calculator: Adjust the live calculator sliders (monthly clicks, tier, gate config, pass price).
- configure_gate_simulator: Change the live gate sandbox (step count, pass bypass, pass price, target link).
- filter_knowledge_base: Filter FAQs by category or search term.
- open_support_ticket: Open the publisher support desk modal with prefilled data.
- populate_gate_analyzer: Pre-fill the AI Gate Strategy Advisor with tailored parameters.
- trigger_app_notification: Display a confirmation toast/notification.

When a user asks you to modify numbers, test a gate, look up FAQs, navigate, or contact support, ALWAYS call the corresponding tool!

RICH UI RESPONSE FORMAT:
When presenting estimates, comparisons, metrics, or recommendations, enrich your response using these native UI blocks:

1. Metric Cards Grid:
:::metric-grid
[{"label": "Projected RPM", "value": "$22.50", "detail": "Tier 1 Blended"}, {"label": "Monthly Volume", "value": "120,000", "detail": "Clicks/mo"}, {"label": "Est. Monthly Net", "value": "$2,160.00", "detail": "Ad + Pass Rev"}, {"label": "Unlock Rate", "value": "78%", "detail": "Completion"}]
:::

2. Summary / Comparison Table:
:::summary-table
{"title": "Gate Strategy Comparison", "headers": ["Model", "Steps", "Avg RPM", "Completion", "Best For"], "rows": [["1-Step Fast", "1", "$12.00 - $16.00", "88%", "Casual downloads"], ["2-Step Optimal", "2", "$18.00 - $24.00", "78%", "Gaming & software"], ["Hybrid Gate", "2 + Pass", "$22.00 - $30.00", "82%", "Telegram VIP & Courses"]]}
:::

3. Actionable Buttons:
:::action-buttons
[{"label": "Apply to Calculator", "action": "calculator", "params": {"monthlyClicks": 100000, "gateConfig": "hybrid"}}, {"label": "Test in Simulator", "action": "simulator", "params": {"stepMode": 2, "allowPass": true}}]
:::

Always pair rich UI blocks with concise, encouraging, and actionable guidance.`;

    const { response, model: servedModel } = await generateWithFallback(modelChain, {
      contents,
      config: {
        systemInstruction,
        tools: [{ functionDeclarations: copilotTools }],
        temperature: 0.7,
      },
    }, `chat(${fastMode ? 'fast' : 'normal'})`);

    const toolCalls: Array<{ name: string; args: any; id?: string }> = [];
    if (response.functionCalls && Array.isArray(response.functionCalls)) {
      for (const call of response.functionCalls) {
        toolCalls.push({
          name: call.name || '',
          args: call.args || {},
          id: call.id,
        });
      }
    }

    let replyText = response.text || '';
    if (!replyText.trim() && toolCalls.length > 0) {
      // Synthesize descriptive action confirmation if text was omitted
      const actionNames = toolCalls.map((t) => t.name.replace(/_/g, ' ')).join(', ');
      replyText = `I have executed the requested action: **${actionNames}**.`;
    }

    res.json({
      reply: replyText || 'I have processed your request.',
      toolCalls,
      model: servedModel,
    });
  } catch (error: any) {
    console.error('Error in /api/gemini/chat:', error);
    sendGeminiError(res, error, 'Failed to process chat query with Gemini.');
  }
});

/**
 * 2. Audio Transcription Endpoint
 * Uses gemini-3.5-transcribe to convert user voice audio to text
 */
app.post('/api/gemini/transcribe', async (req: Request, res: Response): Promise<void> => {
  try {
    const { audioBase64, mimeType = 'audio/webm' } = req.body;

    if (!audioBase64 || typeof audioBase64 !== 'string') {
      res.status(400).json({ error: 'Audio data is required' });
      return;
    }

    // Clean data URI prefix if present
    const base64Data = audioBase64.replace(/^data:[a-zA-Z0-9/]+;base64,/, '');

    const audioPart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Data,
      },
    };

    const { response } = await generateWithFallback(FALLBACK_CHAINS.transcribe, {
      contents: {
        parts: [
          audioPart,
          {
            text: 'Transcribe this voice audio accurately into clear English text. Do not add metadata or preamble, output only the transcribed words.',
          },
        ],
      },
    }, 'transcribe');

    const transcript = response.text ? response.text.trim() : '';
    res.json({ transcript });
  } catch (error: any) {
    console.error('Error in /api/gemini/transcribe:', error);
    sendGeminiError(res, error, 'Failed to transcribe audio.');
  }
});

/**
 * 3. Gate Strategy Analyzer Endpoint
 * Analyzes link destination, traffic geography, and content type to provide tailored recommendations
 */
app.post('/api/gemini/analyze-gate', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      destinationType,
      destinationUrl,
      targetNiche,
      trafficSource,
      monthlyClicks,
    } = req.body;

    const prompt = `Analyze this content and publisher scenario for Linktain:
- Destination Type: ${destinationType || 'Digital Download / Link'}
- Destination Target: ${destinationUrl || 'https://example.com/asset'}
- Niche: ${targetNiche || 'Gaming / Software'}
- Traffic Source: ${trafficSource || 'YouTube & Discord'}
- Estimated Monthly Clicks: ${monthlyClicks || '25,000'}

Provide tailored publisher configuration recommendations including the ideal gate model (Ad Steps, Direct Pass, or Hybrid), optimal number of steps, pass pricing, estimated RPM range, retention tactics, and compliance rules.`;

    const { response } = await generateWithFallback(FALLBACK_CHAINS.normal, {
      contents: prompt,
      config: {
        systemInstruction: 'You are Linktain Chief Optimization Architect. Respond strictly with structured JSON matching the requested schema.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strategyTitle: {
              type: Type.STRING,
              description: 'Short headline of recommended gating architecture',
            },
            recommendedModel: {
              type: Type.STRING,
              description: 'e.g. Hybrid Gate (1-2 Steps + $1.99 Pass) or Ad Steps',
            },
            recommendedStepCount: {
              type: Type.INTEGER,
              description: 'Optimal number of task steps (1 to 4)',
            },
            stepTypes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Recommended task step types',
            },
            recommendedPassPrice: {
              type: Type.STRING,
              description: 'Recommended pass price e.g. $1.49',
            },
            estimatedRpm: {
              type: Type.STRING,
              description: 'Estimated RPM range e.g. $14.50 - $22.00',
            },
            conversionRate: {
              type: Type.STRING,
              description: 'Estimated unlock completion rate e.g. 72%',
            },
            rationale: {
              type: Type.STRING,
              description: 'Why this strategy maximizes publisher revenue',
            },
            optimizationTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Key tactical tips for higher CTR and lower bounce',
            },
            complianceWarnings: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Important compliance guidelines',
            },
          },
          required: [
            'strategyTitle',
            'recommendedModel',
            'recommendedStepCount',
            'stepTypes',
            'recommendedPassPrice',
            'estimatedRpm',
            'conversionRate',
            'rationale',
            'optimizationTips',
            'complianceWarnings',
          ],
        },
      },
    }, 'analyze-gate');

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/gemini/analyze-gate:', error);
    sendGeminiError(res, error, 'Failed to analyze gate configuration.');
  }
});

// Setup Vite middlewares for development, or static files for production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Linktain Publisher Guide server running on port ${PORT} (prod=${isProd})`);
  });
}

startServer();
