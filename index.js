// index.js
require('dotenv').config();
const express = require('express')
const axios = require('axios')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

app.post('/ask', async (req, res) => {
    const { prompt } = req.body
    console.log(`Bearer TEST!!!`);
    console.log(`Bearer ${process.env.OPENROUTER_API_KEY}`);
    const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
            model: 'mistralai/mistral-7b-instruct',
            messages: [{ role: 'user', content: prompt }]
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json'
            }
        }
    )
    const content = response.data.choices[0].message.content
    res.json({ response: content })
})

app.listen(3005, () => {
    console.log('Server running on port 3005')
})
