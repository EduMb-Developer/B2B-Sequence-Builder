const ROLES = [
  { value: 'COO / Director de Operaciones', label: 'COO / Operaciones' },
  { value: 'CIO / Director de IT', label: 'CIO / IT' },
  { value: 'CTO / Director Técnico', label: 'CTO' },
  { value: 'CFO / Director Financiero', label: 'CFO' },
  { value: 'CEO / Dirección General', label: 'CEO' },
  { value: 'Director de Planta', label: 'Dir. de Planta' },
  { value: 'VP Sales / Director Comercial', label: 'VP Sales' },
  { value: 'Head of Marketing', label: 'Head of Marketing' },
  { value: 'Head of People / CHRO', label: 'Head of People' },
  { value: 'Director de Transformación e Innovación', label: 'Dir. Transformación' },
  { value: 'Director de Siniestros', label: 'Dir. Siniestros' },
  { value: 'Director de Innovación', label: 'Dir. Innovación' },
  { value: 'Chief Digital Officer', label: 'CDO' },
  { value: 'Principal / Founding Partner', label: 'Principal / Founder' },
];

const GEOS = ['España', 'LATAM', 'España + LATAM', 'Europa', 'USA / UK', 'Global'];

export default function Step2Target({ form, update, onNext, onBack }) {
  const toggleRole = (value) => {
    const roles = form.roles.includes(value)
      ? form.roles.filter(r => r !== value)
      : [...form.roles, value];
    update({ roles });
  };

  return (
    <>
      <div className="ey">Paso 2 de 4</div>
      <div className="pt">Perfil del decisor</div>
      <div className="ps">¿A quién va dirigida la secuencia?</div>

      <div className="fl">
        <label className="flb">Rol del decisor *</label>
        <div className="chips">
          {ROLES.map(r => (
            <div
              key={r.value}
              className={`chip ${form.roles.includes(r.value) ? 'on' : ''}`}
              onClick={() => toggleRole(r.value)}
            >
              {r.label}
            </div>
          ))}
        </div>
      </div>

      <div className="fl">
        <label className="flb">Otros roles (separados por coma)</label>
        <input
          type="text"
          value={form.customRoles || ''}
          onChange={e => update({ customRoles: e.target.value })}
          placeholder="ej. Director de Logística, Head of Supply Chain"
        />
        <div className="fh">Se combinarán con los roles seleccionados arriba.</div>
      </div>

      <div className="fl">
        <label className="flb">Sector / industria del prospect *</label>
        <input
          type="text"
          value={form.sector}
          onChange={e => update({ sector: e.target.value })}
          placeholder="ej. Alimentación, SaaS B2B, BPO, Aseguradoras, Proptech..."
        />
      </div>

      <div className="fl">
        <label className="flb">Mercado geográfico *</label>
        <div className="pills">
          {GEOS.map(g => (
            <div
              key={g}
              className={`pill ${form.geo === g ? 'on' : ''}`}
              onClick={() => update({ geo: g })}
            >
              {g}
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
