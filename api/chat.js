import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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

  try {
    const stream = await groq.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model: "llama-3.3-70b-versatile",
      stream: true,
    });

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || '';
      if (text) res.write(text);
    }
    res.end();
  } catch (err) {
    console.error('chat error:', err);
    res.status(500).end('Error generating response');
  }
}