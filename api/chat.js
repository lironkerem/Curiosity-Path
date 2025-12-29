import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid message' });
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  const prompt = `You are a friendly chat assistant.\nUser: ${message}\nAssistant:`;

  try {
    const result = await model.generateContentStream(prompt);
    
    for await (const chunk of result.stream) {
      const text = chunk.text();
      res.write(text);
    }
    res.end();
  } catch (err) {
    console.error('chat error:', err);
    res.status(500).end('Error generating response');
  }
}