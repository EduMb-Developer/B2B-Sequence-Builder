const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');

router.post('/', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.json({ propuestaDeValor: '', casosDeExito: '' });

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SequenceBuilder/1.0)' },
      signal: AbortSignal.timeout(10000),
    });
    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove scripts, styles, navs, footers
    $('script, style, nav, footer, header, iframe, noscript').remove();

    // Extract value proposition
    let propuestaDeValor = '';
    const metaDesc = $('meta[name="description"]').attr('content') || '';
    const h1Text = $('h1').first().text().trim();
    const heroText = $('.hero, .banner, [class*="hero"], [class*="banner"], [id*="hero"]').first().text().trim();

    // Look for "about" / "what we do" sections
    const aboutKeywords = /soluci[oó]n|qu[eé]\s+hacemos|value\s+prop|what\s+we\s+do|about\s+us|sobre\s+nosotros|nuestra\s+propuesta|who\s+we\s+are/i;
    let aboutText = '';
    $('section, div, article').each((_, el) => {
      const text = $(el).text().trim();
      if (aboutKeywords.test(text) && text.length > 30 && text.length < 2000) {
        aboutText = text.replace(/\s+/g, ' ').slice(0, 500);
        return false;
      }
    });

    propuestaDeValor = aboutText || [metaDesc, h1Text, heroText].filter(Boolean).join('. ').slice(0, 500);

    // Extract case studies / testimonials
    let casosDeExito = '';
    const caseKeywords = /caso[s]?\s+de\s+[eé]xito|case\s+stud|testimonial|cliente[s]?|resultado[s]?|result[s]?|success\s+stor/i;
    $('section, div, article').each((_, el) => {
      const text = $(el).text().trim();
      if (caseKeywords.test(text) && text.length > 30 && text.length < 2000) {
        casosDeExito = text.replace(/\s+/g, ' ').slice(0, 500);
        return false;
      }
    });

    res.json({ propuestaDeValor, casosDeExito });
  } catch (error) {
    res.json({ propuestaDeValor: '', casosDeExito: '' });
  }
});

module.exports = router;
