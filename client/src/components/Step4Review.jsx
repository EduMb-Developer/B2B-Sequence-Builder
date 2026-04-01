export default function Step4Review({ form, getAllRoles, onGenerate, onBack }) {
  const allRoles = getAllRoles();
  const rows = [
    ['Cliente', form.name],
    ['Propuesta', form.prop.length > 110 ? form.prop.slice(0, 110) + '…' : form.prop],
    ['Decisores', allRoles.join(', ')],
    ['Sector', form.sector],
    ['Mercado', form.geo],
    ['Canales', form.ch.join(' + ')],
    ['Tono', form.tono],
    ['Duración', form.dur],
  ];

  return (
    <>
      <div className="ey">Paso 4 de 4</div>
      <div className="pt">Revisar y generar</div>
      <div className="ps">Confirma la configuración antes de generar.</div>

      <div className="rcard">
        {rows.map(([k, v]) => (
          <div className="rv" key={k}>
            <div className="rk">{k}</div>
            <div>{v}</div>
          </div>
        ))}
      </div>

      <div className="br">
        <button className="btn btn-g" onClick={onBack}>← Atrás</button>
        <button className="btn btn-p" onClick={onGenerate}>Generar secuencia →</button>
      </div>
    </>
  );
}
