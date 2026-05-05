const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');

async function callClaude(apiKey, text, url) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 512,
      system: 'Eres un experto en analizar webs B2B. Devuelve SOLO JSON valido sin markdown.',
      messages: [{
        role: 'user',
        content: `Analiza este texto extraido de la web ${url} y devuelve:
- propuestaDeValor: resumen conciso (max 300 chars) de QUE venden y A QUIEN
- casosDeExito: ejemplos de resultados/clientes/casos si los hay (max 300 chars), o cadena vacia si no hay

Texto de la web:
${text.slice(0, 3000)}

Devuelve SOLO: {"propuestaDeValor":"...","casosDeExito":"..."}`,
      }],
    }),
  });
  const data = await response.json();
  const raw = (data.content?.find(b => b.type === 'text')?.text || '').replace(/```json|```/g, '').trim();
  return JSON.parse(raw);
}

router.post('/', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.json({ propuestaDeValor: '', casosDeExito: '' });

  const apiKey = process.env.ANTHROPIC_API_KEY;

  try {
    // Fetch the page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      },
      signal: AbortSignal.timeout(12000),
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove noise
    $('script, style, nav, footer, header, iframe, noscript, svg, img, [class*="cookie"], [class*="Cookie"], [id*="cookie"]').remove();

    // Extract all visible text
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();

    if (!bodyText || bodyText.length < 50) {
      return res.json({ propuestaDeValor: '', casosDeExito: '' });
    }

    // If Claude API key available, use AI extraction
    if (apiKey) {
      try {
        const result = await callClaude(apiKey, bodyText, url);
        return res.json(result);
      } catch {
        // Fall through to basic extraction
      }
    }

    // Basic fallback extraction (no Claude)
    const metaDesc = $('meta[name="description"]').attr('content') || '';
    const h1 = $('h1').first().text().trim();
    const propuestaDeValor = [metaDesc, h1].filter(Boolean).join('. ').slice(0, 300);
    return res.json({ propuestaDeValor, casosDeExito: '' });

  } catch (error) {
    console.error('Scrape error:', error.message);
    return res.json({ propuestaDeValor: '', casosDeExito: '' });
  }
});

module.exports = router;
