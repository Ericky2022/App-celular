// app.js (Servidor Node.js com Express)
const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');


app.use(cors());
app.use(express.json());

const apiKey = 'sk-proj-xxxxxx'; // Chave API protegida no backend

app.post('/api/gerarReflexao', async (req, res) => {
  const { versiculo } = req.body;

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: `Por favor, forneça uma reflexão de três parágrafos sobre o seguinte versículo: ${versiculo}` }
      ],
      max_tokens: 300
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
