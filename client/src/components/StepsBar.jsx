const LABELS = ['Cliente', 'Target', 'Canales', 'Revisar', 'Secuencia'];

export default function StepsBar({ current }) {
  return (
    <div className="steps">
      {LABELS.map((label, i) => (
        <div key={i} className={`sdot ${i === current ? 'act' : i < current ? 'done' : ''}`}>
          <div className="sc">{i < 4 ? i + 1 : '✓'}</div>
          <div className="sl">{label}</div>
        </div>
      ))}
    </div>
  );
}
