const fetch = require('cross-fetch');

const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
let AccessCount = 0;

app.all('/*', function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Vary', 'Origin');
  next();
})
app.get('/metrics', async (req, res) => {
  let metrics = `MC_UUID_GET_AccessCount ${AccessCount}`;
  res.set('Content-Type', 'text/plain');
  res.send(metrics);
})
app.get('/mojang/:mcid', async (req, res) => {
  AccessCount++;
  const { mcid } = req.params;
  try {
    const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${mcid}`);
    if (!response.ok) {
      throw new Error('Failed to fetch data from Mojang API');
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
