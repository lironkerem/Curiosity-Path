// api/tarot-vision.js
export default async function handler(req, res) {
  console.log('Handler started');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image } = req.body;
  if (!image || typeof image !== 'string') {
    console.error('Invalid image data');
    return res.status(400).json({ error: 'Missing or invalid image' });
  }
  if (image.length > 5_500_000) {
    return res.status(413).json({ error: 'Image too large' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error('Missing GROQ_API_KEY');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  console.log('Making Groq API request...');

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
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

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', response.status, errorText);
      return res.status(500).json({ error: `API error: ${response.status} - ${errorText}` });
    }

    const data = await response.json();
    console.log('Response received:', JSON.stringify(data).substring(0, 200));
    
    const text = data.choices?.[0]?.message?.content;

    if (!text) {
      console.error('No text in response:', data);
      return res.status(500).json({ error: 'No response from AI' });
    }

    console.log('Success - returning text');
    return res.status(200).json({ text });
  } catch (err) {
    console.error('Exception:', err.message, err.stack);
    return res.status(500).json({ error: `Interpretation failed: ${err.message}` });
  }
}