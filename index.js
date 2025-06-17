// index.js
const express = require('express')
const axios = require('axios')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

app.post('/ask', async (req, res) => {
    const { prompt } = req.body

    // שימוש במודל חינמי דרך OpenRouter או Hugging Face
    const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
            model: 'mistralai/mistral-7b-instruct', // או אחר זמין
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

app.listen(3000, () => {
    console.log('Server running on port 3000')
})
