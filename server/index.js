require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const fetch = require('node-fetch');

const app = express();
const upload = multer({ dest: path.join(__dirname, 'uploads') });
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const PORT = process.env.PORT || 4000;

// In-memory store for verification codes (email -> { code, expires })
const codes = new Map();

// Nodemailer transport using Gmail (App Password)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

app.post('/api/send-code', async (req, res) => {
  const { email } = req.body || {};
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'Invalid email' });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 5 * 60 * 1000; // 5 minutes
  codes.set(email, { code, expires });

  // send email
  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Rosy Scan verification code',
      text: `Your Rosy Scan verification code is ${code}. It expires in 5 minutes.`,
    });
    res.json({ ok: true, message: 'Code sent' });
  } catch (err) {
    console.error('send mail error', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.post('/api/verify-code', (req, res) => {
  const { email, code } = req.body || {};
  if (!email || !code) return res.status(400).json({ error: 'Missing params' });

  const row = codes.get(email);
  if (!row) return res.status(400).json({ error: 'No code sent' });
  if (Date.now() > row.expires) return res.status(400).json({ error: 'Code expired' });
  if (row.code !== code) return res.status(400).json({ error: 'Invalid code' });

  codes.delete(email);
  const name = email.split('@')[0];
  const user = { email, name, points: 0, deposits: 0, badges: [] };
  res.json({ ok: true, user });
});

// Chat endpoint that proxies to a configured Gemini/OpenAI-compatible API
app.post('/api/chat', async (req, res) => {
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: 'Missing message' });

  const GEMINI_URL = process.env.GEMINI_API_URL;
  const GEMINI_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_URL || !GEMINI_KEY) {
    // fallback simulated reply
    return res.json({ reply: `Simulated reply: I can help you sort waste. For example, plastics and glass are recyclable, organic waste can be composted. Ask about a specific item.` });
  }

  try {
    const resp = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GEMINI_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: message }],
        max_tokens: 600,
      }),
    });
    const data = await resp.json();
    // best-effort extraction for OpenAI-style reply
    const reply = data?.choices?.[0]?.message?.content || data?.data?.[0]?.content || JSON.stringify(data);
    res.json({ reply });
  } catch (err) {
    console.error('chat proxy error', err);
    res.status(500).json({ error: 'Chat failed' });
  }
});

// Scan endpoint: accepts image upload and asks Gemini to classify
app.post('/api/scan', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No image' });

    // read file and convert to base64
    const buffer = fs.readFileSync(file.path);
    const b64 = buffer.toString('base64');

    const GEMINI_URL = process.env.GEMINI_API_URL;
    const GEMINI_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_URL || !GEMINI_KEY) {
      // fallback simple heuristic: random result for demo
      const types = [
        { type: 'organic', item: 'Vegetable scraps', guidance: 'Compost it. Collect in separate bin.' },
        { type: 'non-organic', item: 'Plastic bottle', guidance: 'Rinse and send to recycling center.' },
        { type: 'non-organic', item: 'Cardboard box', guidance: 'Flatten and recycle.' },
      ];
      const result = types[Math.floor(Math.random() * types.length)];
      // simple receipt detection heuristic: filename contains 'receipt' or 'bank'
      const isReceipt = /receipt|bank|trx|transfer/i.test(file.originalname);
      return res.json({ ...result, confidence: 85, isReceipt });
    }

    // If real GEMINI_URL is set, post the image as base64 inside a prompt
    const prompt = `Analyze the following image (base64). Determine if this image is a bank transaction receipt (yes/no). If yes, return {isReceipt:true, vendor, amount, date}. Regardless, classify the waste item shown (organic/non-organic), guess the item name, and provide guidance in short plain English.`;
    const body = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an assistant that can analyze an image (base64) and classify waste and detect receipts.' },
        { role: 'user', content: `${prompt}\nIMAGE_BASE64:${b64}` },
      ],
      max_tokens: 800,
    };

    const resp = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GEMINI_KEY}` },
      body: JSON.stringify(body),
    });
    const data = await resp.json();
    const reply = data?.choices?.[0]?.message?.content;

    // Try to parse JSON object from reply
    let parsed = null;
    try {
      const j = reply.match(/\{[\s\S]*\}/);
      if (j) parsed = JSON.parse(j[0]);
    } catch (e) {
      // ignore
    }

    // fallback if parsing fails
    const out = parsed || { isReceipt: false, type: 'non-organic', item: 'Unknown', guidance: reply || 'No guidance' };
    res.json({ ...out, confidence: 80 });
  } catch (err) {
    console.error('scan error', err);
    res.status(500).json({ error: 'Scan failed' });
  }
});

// Upload proof endpoint (accept receipt image) - verifies it's a receipt then awards points
app.post('/api/upload-proof', upload.single('image'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No image' });

  // for demo: check filename for keywords or rely on previous scan
  const isReceipt = /receipt|bank|transfer|bukti|trx/i.test(file.originalname);
  if (!isReceipt) {
    return res.json({ ok: false, message: 'Uploaded image is not recognized as a bank transaction receipt.' });
  }
  // award points
  res.json({ ok: true, points: 50, message: 'Proof accepted. +50 points' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
