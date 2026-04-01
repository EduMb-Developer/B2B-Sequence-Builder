import { useState, useRef } from 'react';

function CopyBox({ label, text, id }) {
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(ref.current.innerText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="cbox">
      <div className="clbl">{label}</div>
      <div className="cbod" ref={ref} dangerouslySetInnerHTML={{ __html: escapeHtml(text) }} />
      <button className={`cpb ${copied ? 'ok' : ''}`} onClick={handleCopy}>
        {copied ? '✓' : 'Copiar'}
      </button>
    </div>
  );
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

function channelClass(ch) {
  if (ch === 'LinkedIn') return 'cb-li';
  if (ch === 'Email') return 'cb-em';
  return 'cb-tel';
}

export default function SequenceOutput({ form, getAllRoles, result, loading, error, onRetry, onBack, onReset, onExport }) {
  const allRoles = getAllRoles();
  const [allCopied, setAllCopied] = useState(false);
  const outRef = useRef(null);

  const copyAll = () => {
    navigator.clipboard.writeText(outRef.current?.innerText || '').then(() => {
      setAllCopied(true);
      setTimeout(() => setAllCopied(false), 2000);
    });
  };

  if (loading) {
    return (
      <>
        <div className="otop">
          <div className="otitle">Secuencia — {form.name}</div>
          <div className="ometa">{allRoles.join(' · ')} · {form.sector} · {form.geo} · {form.ch.join('+')}</div>
        </div>
        <div className="loading">
          <div className="spin"></div>
          <div className="lmsg">Generando secuencia personalizada...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="otop">
          <div className="otitle">Secuencia — {form.name}</div>
        </div>
        <div className="err">
          <strong>Error al generar la secuencia.</strong><br /><br />
          {error}<br /><br />
          <button className="btn btn-p btn-sm" onClick={onRetry} style={{ marginTop: '8px' }}>Reintentar</button>{' '}
          <button className="btn btn-g btn-sm" onClick={onBack} style={{ marginTop: '8px' }}>← Volver</button>
        </div>
      </>
    );
  }

  if (!result) return null;

  const steps = result.steps || [];
  const branches = result.branches || [];
  const n = steps.length;
  const c1 = n <= 5 ? 2 : 3;
  const c2 = n <= 5 ? 4 : n <= 7 ? 6 : 7;
  const blocks = [
    { label: 'Bloque 1 — Primer contacto', items: steps.slice(0, c1) },
    { label: 'Bloque 2 — Seguimiento', items: steps.slice(c1, c2) },
    { label: 'Bloque 3 — Cierre', items: steps.slice(c2) },
  ];

  return (
    <>
      <div className="otop">
        <div className="otitle">Secuencia — {form.name}</div>
        <div className="ometa">{allRoles.join(' · ')} · {form.sector} · {form.geo} · {form.ch.join('+')}</div>
      </div>

      <div className="tb">
        <button className="btn btn-p btn-sm" onClick={copyAll}>
          {allCopied ? '✓ Copiado' : 'Copiar todo'}
        </button>
        <button className="btn btn-o btn-sm" onClick={onExport}>Exportar .docx</button>
        <button className="btn btn-o btn-sm" onClick={() => window.print()}>Imprimir / PDF</button>
        <button className="btn btn-g btn-sm" onClick={onReset}>Nueva secuencia</button>
      </div>

      <div ref={outRef}>
        <div className="nb" style={{ marginBottom: '1.5rem' }}>
          <strong>Buenas prácticas Apollo aplicadas:</strong> asuntos 3–5 palabras · emails máx. 7 líneas · sin presentación corporativa · una pregunta al final
        </div>

        {blocks.map((block) => {
          if (!block.items.length) return null;
          return (
            <div key={block.label}>
              <div className="bhdr">{block.label}</div>
              {block.items.map((s, i) => (
                <div className="scard" key={i}>
                  <div className="shead">
                    <span className="dtag">{s.day}</span>
                    <span className={`cbadge ${channelClass(s.channel)}`}>{s.channel}</span>
                    <span className="stit">{s.title}</span>
                  </div>
                  {s.subject && <CopyBox label="Asunto" text={s.subject} />}
                  <CopyBox label="Copy" text={s.body} />
                  {s.note && <div className="nb">{s.note}</div>}
                  <div className="obj"><strong>Objetivo:</strong> {s.objetivo}</div>
                </div>
              ))}
            </div>
          );
        })}

        <div className="bhdr">Lógica de ramificación</div>
        <div className="bcard">
          {branches.map((b, i) => (
            <div className="brow" key={i}>
              <span className="bif">{b.cond} →</span> {b.action}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
