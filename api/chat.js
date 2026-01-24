// ============================================
// /api/chat.js
// Streaming chat endpoint using Groq AI
// Provides spiritual guidance and assistance
// ============================================

import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are Aanandoham's spiritual AI assistant. You are an expert in Tarot Cards, Meditations, Reiki, Healing and Mindfulness. You provide guidance on spirituality, self-development, and personal growth with wisdom, compassion, and clarity. Keep responses thoughtful but concise.`;

const MODEL = "llama-3.3-70b-versatile";
const MAX_MESSAGE_LENGTH = 2000;

/**
 * Validates and sanitizes user message
 * @param {string} message - User input
 * @returns {Object|null} Error object if validation fails, null if valid
 */
function validateMessage(message) {
  if (!message || typeof message !== 'string') {
    return { error: 'Missing or invalid message' };
  }

  if (message.trim().length === 0) {
    return { error: 'Message cannot be empty' };
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return { error: `Message too long (max ${MAX_MESSAGE_LENGTH} characters)` };
  }

  return null;
}

/**
 * Main handler for streaming chat endpoint
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  // Validate message
  const validationError = validateMessage(message);
  if (validationError) {
    return res.status(400).json(validationError);
  }

  // Check API key configuration
  if (!process.env.GROQ_API_KEY) {
    console.error('GROQ_API_KEY not configured');
    return res.status(500).json({ error: 'API key not configured' });
  }

  // Set headers for streaming response
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const stream = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message.trim() }
      ],
      model: MODEL,
      stream: true,
    });

    // Stream response chunks to client
    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || '';
      if (text) {
        res.write(text);
      }
    }

    res.end();
  } catch (err) {
    console.error('Chat streaming error:', err.message);
    
    // Handle streaming error gracefully
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Error generating response' });
    }
    
    res.end();
  }
}