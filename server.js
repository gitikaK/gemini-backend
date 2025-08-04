const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Use environment variable

app.use(cors());
app.use(bodyParser.json());

app.post('/chat', async (req, res) => {
    const { message, description } = req.body;

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: `User_message: ${message}. Reply naturally and if needed use: ${description}. Reply like Gitika Kasyap would talk.`
                            }
                        ]
                    }
                ]
            }
        );

        const reply = response.data.candidates[0].content.parts[0].text;
        res.json({ reply });
    } catch (err) {
        console.error(err);
        res.status(500).json({ reply: "Oops! Something went wrong." });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
