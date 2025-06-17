require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/ask', async (req, res) => {
    const { prompt } = req.body;
    console.log(`Bearer ${process.env.OPENROUTER_API_KEY}`);

    try {
        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'anthropic/claude-3-haiku',
                messages: [
                    {
                        role: 'user',
                        content: `
Extract shirt information from the following sentence.

Return a JSON object like this:
{
  "shirtsArr": [
    {
      "colorsShirt": [ "color1", "color2" ],
      "PriceShirt": 25.00
    }
  ]
}

Rules:
- Return ONLY valid JSON. DO NOT write anything else. NO explanations. NO greetings. Only the JSON object exactly as specified.

- If no shirt is mentioned, return: { "shirtsArr": [] }
- If a shirt has no color, use: "colorsShirt": []
- If a shirt has no price, omit the "PriceShirt" field.
- All colors should be lowercase.
- Price should be a number only (no $ or symbols).

Now analyze this sentence:
"${prompt}"
                        `
                    }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        const raw = response.data.choices[0].message.content;
        const match = raw.match(/{[\s\S]*}/); // Try to extract first JSON object from response

        if (match) {
            const extractedJson = JSON.parse(match[0]);

            res.json(extractedJson);
        } else {
            res.status(400).json({ error: 'No JSON found in response', raw });
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal error', detail: error.message });
    }
});

app.listen(3005, () => {
    console.log('Server running on port 3005');
});
