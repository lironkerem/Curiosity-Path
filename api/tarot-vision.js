// ============================================
// /api/tarot-vision.js
// Tarot card image analysis using Groq Vision API
// Identifies cards and provides readings
// ============================================

const MAX_IMAGE_SIZE = 5_500_000; // ~5.5MB in base64
const MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';
const MAX_TOKENS = 800;
const TEMPERATURE = 0.7;

const TAROT_PROMPT = 'You are a tarot expert. Identify each tarot card visible in this image and provide a concise, empathetic reading. Use a heading for each card identified, then end with a short summary of the overall message.';

/**
 * Validates base64 image data
 * @param {string} image - Base64 encoded image
 * @returns {Object|null} Error object if validation fails, null if valid
 */
function validateImage(image) {
  if (!image || typeof image !== 'string') {
    return { error: 'Missing or invalid image data' };
  }

  if (image.trim().length === 0) {
    return { error: 'Image data is empty' };
  }

  if (image.length > MAX_IMAGE_SIZE) {
    return { error: 'Image too large (max 5.5MB)' };
  }

  return null;
}

/**
 * Calls Groq Vision API for tarot card analysis
 * @param {string} apiKey - Groq API key
 * @param {string} image - Base64 encoded image
 * @returns {Promise<Object>} API response data
 */
async function analyzeTarotImage(apiKey, image) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${image}`
              }
            },
            {
              type: 'text',
              text: TAROT_PROMPT
            }
          ]
        }
      ],
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API returned status ${response.status}: ${errorText}`);
  }

  return await response.json();
}

/**
 * Main handler for tarot card vision analysis
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image } = req.body;

  // Validate image data
  const validationError = validateImage(image);
  if (validationError) {
    return res.status(400).json(validationError);
  }

  // Check API key configuration
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error('GROQ_API_KEY not configured');
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    // Analyze tarot image
    const data = await analyzeTarotImage(apiKey, image);
    
    // Extract text from response
    const text = data.choices?.[0]?.message?.content;

    if (!text) {
      console.error('No content in API response');
      return res.status(500).json({ error: 'No response from AI' });
    }

    return res.status(200).json({ text });

  } catch (error) {
    console.error('Tarot vision error:', error.message);
    return res.status(500).json({ 
      error: 'Failed to analyze tarot cards',
      message: error.message 
    });
  }
}