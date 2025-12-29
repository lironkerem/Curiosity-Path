// API/chat.js
import { GoogleGenAI } from '@google/genai';
import { Transform } from 'stream';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = ai.models.getModel('gemini-2.5-flash');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid message' });
  }

  const controller = new AbortController();
  req.on('close', () => controller.abort());

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  const prompt = `You are a friendly chat assistant.\nUser: ${message}\nAssistant:`;

  try {
    const stream = await model.generateContentStream({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT',  threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
      ],
      signal: controller.signal
    });

    // minimal transform: strip chunk wrapper, forward text
    const transform = new Transform({
      objectMode: true,
      transform(chunk, _, cb) { cb(null, chunk.text || ''); }
    });

    stream.pipe(transform).pipe(res);
  } catch (err) {
    if (controller.signal.aborted) return;
    console.error('chat error:', err);
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Upstream error' });
    }
    res.end();
  }
}