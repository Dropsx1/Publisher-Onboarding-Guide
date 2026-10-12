import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

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
 * 1. Multi-turn Chat Endpoint
 * Uses gemini-3.8-flash with role-based system instruction and full conversation history
 */
app.post('/api/gemini/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, history = [], fastMode = false } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const modelName = fastMode ? 'gemini-3.1-flash-lite' : 'gemini-3.8-flash';

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

    const systemInstruction = `You are the official Linktain Senior Publisher Strategist & Knowledge Assistant.
Linktain is a modern digital platform and ad network that enables creators, publishers, and developers to monetize their links, files, digital downloads, and private communities (like Telegram, Discord, Patreon, Notion, GitHub).
Key Linktain facts:
- How it works: Linktain places a high-converting, customizable intermediary "gate" in front of destination links.
- Monetization routes:
  1. Free Access with Sponsored Steps (CPM, CPA, search ads, app installs, short surveys).
  2. Direct Access Passes (one-time or auto-renewing subscriptions, creator keeps max revenue).
  3. Hybrid Gate (visitor can choose to complete 1-3 tasks or pay $0.99 - $9.99 for instant bypass).
- Privacy & Anti-Fraud: Linktain never stores raw visitor IP addresses; it utilizes a secure, one-way salted IP hash for bot detection, ensuring creator and user privacy.
- Payouts: Minimum $20 via PayPal, $50 via Crypto (USDT/USDC), and $100 via Bank Wire. Regular payouts run bi-weekly (15th and end of month).
- Best practices: Step counts between 1 and 3 yield optimal retention and RPM. Direct clear instructions to users reduce drop-off.
Provide concise, actionable, helpful, and technically sound advice for creators seeking to optimize their link monetization. Format with clear bullet points where helpful.`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      reply: response.text || 'I apologize, but I could not generate a response at this time.',
    });
  } catch (error: any) {
    console.error('Error in /api/gemini/chat:', error);
    res.status(500).json({
      error: error?.message || 'Failed to process chat query with Gemini.',
    });
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

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          audioPart,
          {
            text: 'Transcribe this voice audio accurately into clear English text. Do not add metadata or preamble, output only the transcribed words.',
          },
        ],
      },
    });

    const transcript = response.text ? response.text.trim() : '';
    res.json({ transcript });
  } catch (error: any) {
    console.error('Error in /api/gemini/transcribe:', error);
    res.status(500).json({
      error: error?.message || 'Failed to transcribe audio with gemini-3.5-transcribe.',
    });
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

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
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
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/gemini/analyze-gate:', error);
    res.status(500).json({
      error: error?.message || 'Failed to analyze gate configuration.',
    });
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
