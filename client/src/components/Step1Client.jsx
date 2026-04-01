import { useState } from 'react';

export default function Step1Client({ form, update, onNext }) {
  const [scraping, setScraping] = useState(false);
  const [scrapeStatus, setScrapeStatus] = useState(''); // '' | 'loading' | 'success' | 'error'

  const handleScrape = async () => {
    const url = form.url?.trim();
    if (!url) return;
    setScraping(true);
    setScrapeStatus('loading');
    try {
      const resp = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await resp.json();
      if (data.propuestaDeValor || data.casosDeExito) {
        update({
          prop: data.propuestaDeValor || form.prop,
          cases: data.casosDeExito || form.cases,
        });
        setScrapeStatus('success');
      } else {
        setScrapeStatus('error');
      }
    } catch {
      setScrapeStatus('error');
    } finally {
      setScraping(false);
    }
  };

  return (
    <>
      <div className="ey">Paso 1 de 4</div>
      <div className="pt">Datos del cliente</div>
      <div className="ps">Información básica del cliente para el que construyes la secuencia.</div>

      <div className="fl">
        <label className="flb">Nombre del cliente / empresa *</label>
        <input type="text" value={form.name} onChange={e => update({ name: e.target.value })} placeholder="ej. Logixs" />
      </div>

      <div className="fl">
        <label className="flb">URL de la web del cliente</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={form.url || ''}
            onChange={e => update({ url: e.target.value })}
            onBlur={handleScrape}
            placeholder="https://www.ejemplo.com"
            style={{ flex: 1 }}
          />
          <button className="btn btn-o btn-sm" onClick={handleScrape} disabled={scraping}>
            {scraping ? 'Analizando...' : 'Analizar web'}
          </button>
        </div>
        {scrapeStatus === 'loading' && (
          <div className="scrape-status loading"><span className="scrape-spin"></span> Analizando web...</div>
        )}
        {scrapeStatus === 'success' && (
          <div className="scrape-status success">✓ Datos extraídos correctamente</div>
        )}
        {scrapeStatus === 'error' && (
          <div className="scrape-status error">No se pudo extraer información. Rellena manualmente.</div>
        )}
      </div>

      <div className="fl">
        <label className="flb">Propuesta de valor — ¿qué venden y a quién? *</label>
        <textarea
          value={form.prop}
          onChange={e => update({ prop: e.target.value })}
          placeholder="ej. Consultora de Agentic AI que conecta ERP, MES y sensores para automatizar decisiones críticas de planta en tiempo real."
        />
      </div>

      <div className="fl">
        <label className="flb">Casos de éxito o referencias (opcional)</label>
        <textarea
          value={form.cases}
          onChange={e => update({ cases: e.target.value })}
          style={{ minHeight: '72px' }}
          placeholder="ej. Redujeron el tiempo de detección de paradas de 90 a 5 minutos en una productora con tres plantas."
        />
        <div className="fh">Si no hay casos reales, déjalo vacío y la IA usará hipótesis creíbles.</div>
      </div>

      <div className="br">
        <button className="btn btn-p" onClick={onNext}>Continuar →</button>
      </div>
    </>
  );
}
