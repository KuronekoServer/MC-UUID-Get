const fetch = require('cross-fetch');

const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.all('/*', function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Vary', 'Origin');
  next();
})
app.get('/mojang/:mcid', async (req, res) => {
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
