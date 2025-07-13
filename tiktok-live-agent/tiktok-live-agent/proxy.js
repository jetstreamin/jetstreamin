// ==========================
// Jetstreamin Proxy (DAG-Secure)
// ==========================
const express = require('express');
const crypto = require('crypto');
const app = express();
const PORT = 3030;
const API_KEY = process.env.OPENAI_API_KEY || 'sk-REPLACE_ME';

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    status: "Jetstreamin Proxy Live",
    apiKeyEntropy: API_KEY.length,
    timestamp: Date.now()
  });
});

app.post('/chat', async (req, res) => {
  const fetch = (await import('node-fetch')).default;
  const payload = JSON.stringify(req.body);
  const dagId = crypto.createHash('sha3-512').update(payload).digest('hex');
  console.log(`[JETSTREAMIN][DAG-ID] ${dagId}`);

  const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'X-Jetstreamin-DAG-ID': dagId
    },
    body: payload
  });

  res.setHeader('X-Jetstreamin-DAG-ID', dagId);
  res.setHeader('Content-Type', 'application/json');
  openaiRes.body.pipe(res);
});

app.listen(PORT, () => {
  console.log(`[JETSTREAMIN] Secure DAG Proxy running on http://localhost:${PORT}`);
});