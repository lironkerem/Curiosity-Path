// api/tarot-vision.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image } = req.body;
  if (!image || typeof image !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid image' });
  }
  if (image.length > 5_500_000) {
    return res.status(413).json({ error: 'Image too large' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.2-11b-vision-preview',
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
                text: 'You are a tarot expert. Identify each tarot card visible in this image and provide a concise, empathetic reading. Use a heading for each card identified, then end with a short summary of the overall message.'
              }
            ]
          }
        ],
        max_tokens: 800,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Groq API error:', response.status, error);
      return res.status(500).json({ error: 'API request failed' });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

    if (!text) {
      return res.status(500).json({ error: 'No response from AI' });
    }

    console.log('tarot-vision: success');
    return res.status(200).json({ text });
  } catch (err) {
    console.error('tarot-vision error:', err);
    return res.status(500).json({ error: 'Interpretation failed' });
  }
}