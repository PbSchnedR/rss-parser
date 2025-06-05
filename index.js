const express = require('express');
const cors = require('cors');
const { XMLParser } = require('fast-xml-parser');

const app = express();
const PORT = 4000;

app.use(cors());

app.get('/rss', async (req, res) => {
  const feedUrl = req.query.url;
  if (!feedUrl) {
    return res.status(400).json({ error: 'Paramètre ?url manquant' });
  }

  try {
    const response = await fetch(feedUrl);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const xmlData = await response.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_"
    });
    const jsonData = parser.parse(xmlData);

    res.json(jsonData);
  } catch (error) {
    console.error('Erreur RSS:', error.message);
    res.status(500).json({ error: 'Erreur lors de la récupération du flux RSS.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
