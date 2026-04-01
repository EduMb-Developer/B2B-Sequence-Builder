const CHANNELS = [
  { value: 'LinkedIn', label: 'LinkedIn' },
  { value: 'Email', label: 'Email en frío' },
  { value: 'Llamada', label: 'Llamada telefónica' },
];

const TONES = [
  { value: 'directo y consultivo', label: 'Directo y consultivo' },
  { value: 'cercano y conversacional', label: 'Cercano y conversacional' },
  { value: 'formal y técnico', label: 'Formal y técnico' },
  { value: 'challenger que provoca reflexión', label: 'Challenger' },
];

const DURATIONS = [
  { value: '10 días con 5 touchpoints', label: '10 días · 5 pasos' },
  { value: '21 días con 7 touchpoints', label: '21 días · 7 pasos' },
  { value: '30 días con 9 touchpoints', label: '30 días · 9 pasos' },
];

export default function Step3Channels({ form, update, onNext, onBack }) {
  const toggleChannel = (value) => {
    const ch = form.ch.includes(value)
      ? form.ch.filter(c => c !== value)
      : [...form.ch, value];
    update({ ch });
  };

  return (
    <>
      <div className="ey">Paso 3 de 4</div>
      <div className="pt">Canales y tono</div>
      <div className="ps">Define cómo va a operar la secuencia.</div>

      <div className="fl">
        <label className="flb">Canales *</label>
        <div className="chips">
          {CHANNELS.map(c => (
            <div
              key={c.value}
              className={`chip acc ${form.ch.includes(c.value) ? 'on' : ''}`}
              onClick={() => toggleChannel(c.value)}
            >
              {c.label}
            </div>
          ))}
        </div>
      </div>

      <div className="fl">
        <label className="flb">Tono *</label>
        <div className="pills">
          {TONES.map(t => (
            <div
              key={t.value}
              className={`pill ${form.tono === t.value ? 'on' : ''}`}
              onClick={() => update({ tono: t.value })}
            >
              {t.label}
            </div>
          ))}
        </div>
      </div>

      <div className="fl">
        <label className="flb">Duración</label>
        <div className="pills">
          {DURATIONS.map(d => (
            <div
              key={d.value}
              className={`pill ${form.dur === d.value ? 'on' : ''}`}
              onClick={() => update({ dur: d.value })}
            >
              {d.label}
            </div>
          ))}
        </div>
      </div>

      <div className="br">
        <button className="btn btn-g" onClick={onBack}>← Atrás</button>
        <button className="btn btn-p" onClick={onNext}>Continuar →</button>
      </div>
    </>
  );
}
