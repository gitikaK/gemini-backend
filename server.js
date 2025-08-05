const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Use environment variable or fallback key (temporary for local testing)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCMAllMYjQn_5istbOnn8sumVqsA88Q_cQ';

app.use(cors());
app.use(bodyParser.json());

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('✅ Gemini Backend is running!');
});

// ✅ Route matching frontend
app.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      }
    );

    const reply = response.data.candidates[0].content.parts[0].text;
    res.json({ reply });
  } catch (err) {
    console.error('Gemini error:', err.response?.data || err.message);
    res.status(500).json({ reply: "Oops! Something went wrong." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
