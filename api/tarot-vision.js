// api/tarot-vision.js
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = ai.models.getModel('gemini-pro-vision');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image } = req.body;
  if (!image || typeof image !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid image' });
  }
  if (image.length > 5_500_000) {          // ~4 MB ceiling
    return res.status(413).json({ error: 'Image too large' });
  }

  try {
    const response = await model.generateContent({
      contents: {
        parts: [
          { inlineData: { data: image, mimeType: 'image/jpeg' } },
          { text: 'Tarot expert: name each card and give a concise, empathetic reading. Use headings per card and end with a short summary.' }
        ]
      },
      generationConfig: { maxOutputTokens: 800 },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT',  threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
      ]
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
    const reason = response.candidates?.[0]?.finishReason;
    console.log(`tarot-vision: ${image.length} chars → ${reason}`);

    if (!text) {
      return res.status(500).json({ error: 'Blocked or empty response' });
    }
    return res.status(200).json({ text });
  } catch (err) {
    console.error('tarot-vision error:', err);
    return res.status(500).json({ error: 'Interpretation failed' });
  }
}