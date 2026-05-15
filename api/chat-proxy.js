export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { model = 'openai' } = req.query;

  try {
    // Use Pollinations as free AI backend
    const messages = req.body.messages || [];

    // Build Pollinations URL
    const encodedMessages = encodeURIComponent(JSON.stringify(messages));
    const pollinationsUrl = `https://text.pollinations.ai/openai?model=${model}&messages=${encodedMessages}`;

    const response = await fetch(pollinationsUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/plain',
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'AI service error' });
    }

    const text = await response.text();
    return res.status(200).json({
      choices: [{
        message: {
          role: 'assistant',
          content: text
        }
      }]
    });
  } catch (error) {
    return res.status(500).json({ error: 'Chat proxy error: ' + error.message });
  }
}