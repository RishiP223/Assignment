// api/groq.js (CommonJS - recommended)
const fetch = (...args) => import('node-fetch').then(m => m.default(...args));

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'POST');
    return res.end('Only POST allowed');
  }

  let payload = req.body;
  if (typeof payload === 'string') {
    try { payload = JSON.parse(payload); } catch (e) {}
  }

  const { prompt, maxTokens = 512, model = 'llama-3.3-70b-versatile' } = payload || {};

  if (!prompt) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: 'Missing prompt' }));
  }

  const GROQ_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_KEY) {
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: 'Server missing Groq key' }));
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_KEY}`
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_completion_tokens: maxTokens
      })
    });

    const data = await response.text();
    res.statusCode = response.status;
    res.setHeader('Content-Type', 'application/json');
    return res.end(data);
  } catch (err) {
    console.error('groq proxy error', err);
    res.statusCode = 502;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Groq call failed', details: String(err) }));
  }
};
