import { useState, useCallback } from 'react';
import Topbar from './components/Topbar';
import StepsBar from './components/StepsBar';
import Step1Client from './components/Step1Client';
import Step2Target from './components/Step2Target';
import Step3Channels from './components/Step3Channels';
import Step4Review from './components/Step4Review';
import SequenceOutput from './components/SequenceOutput';

const INITIAL_STATE = {
  name: '', url: '', prop: '', cases: '',
  roles: [], customRoles: '', sector: '', geo: '',
  ch: [], tono: '', dur: '21 días con 7 touchpoints',
};

export default function App() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL_STATE);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = useCallback((fields) => {
    setForm(prev => ({ ...prev, ...fields }));
  }, []);

  const goTo = useCallback((n) => {
    setStep(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const validate = (p) => {
    if (p === 0) {
      if (!form.name || !form.prop) { alert('Completa el nombre y la propuesta de valor.'); return false; }
    }
    if (p === 1) {
      const allRoles = [...form.roles];
      if (form.customRoles.trim()) {
        form.customRoles.split(',').map(r => r.trim()).filter(Boolean).forEach(r => allRoles.push(r));
      }
      if (!allRoles.length || !form.sector || !form.geo) {
        alert('Selecciona al menos un rol, el sector y el mercado.');
        return false;
      }
    }
    if (p === 2) {
      if (!form.ch.length || !form.tono) { alert('Selecciona canales y tono.'); return false; }
    }
    return true;
  };

  const next = (to) => {
    if (!validate(to - 1)) return;
    goTo(to);
  };

  const getAllRoles = () => {
    const roles = [...form.roles];
    if (form.customRoles.trim()) {
      form.customRoles.split(',').map(r => r.trim()).filter(Boolean).forEach(r => {
        if (!roles.includes(r)) roles.push(r);
      });
    }
    return roles;
  };

  const generate = async () => {
    goTo(4);
    setLoading(true);
    setError('');
    setResult(null);

    const allRoles = getAllRoles();
    const n = form.dur.includes('5') ? 5 : form.dur.includes('9') ? 9 : 7;
    const days = { 5: '1,3,7,12,18', 7: '1,3,5,8,11,14,21', 9: '1,3,5,8,11,14,18,24,30' };

    const prompt = `Genera una secuencia outbound B2B con exactamente ${n} touchpoints.

CLIENTE: ${form.name}
PROPUESTA: ${form.prop}
CASOS: ${form.cases || 'Sin casos reales. Usa hipotesis creibles y cuantificadas.'}
DECISOR: ${allRoles.join(', ')}
SECTOR: ${form.sector}
MERCADO: ${form.geo}
CANALES: ${form.ch.join(', ')}
TONO: ${form.tono}
DIAS: ${days[n]}

Buenas practicas Apollo (obligatorio):
- Asuntos de 3-5 palabras maximo
- Emails de maximo 5-7 lineas
- Sin presentacion corporativa
- Una sola pregunta al final de cada email
- Primer LinkedIn = solo conexion, cero pitch
- Ultimo paso = break-up email con puerta abierta
- Cada paso ataca angulo distinto del mismo dolor

Devuelve SOLO JSON valido sin markdown:
{"steps":[{"day":"Dia 1","channel":"LinkedIn","title":"titulo","subject":"","body":"texto","objetivo":"objetivo","note":""}],"branches":[{"cond":"condicion","action":"accion"}]}

channel: solo LinkedIn Email o Llamada. subject: solo para Email. note: vacio si no aplica. 4 branches obligatorios. Usa \\n para saltos de linea.`;

    try {
      const resp = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          system: 'Eres experto en outbound B2B. Devuelve SOLO JSON valido sin markdown ni texto extra. Usa \\n para saltos de linea en strings.',
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      const d = await resp.json();
      const raw = (d.content?.find(b => b.type === 'text')?.text || '').replace(/```json|```/g, '').trim();
      setResult(JSON.parse(raw));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const exportDocx = async () => {
    const allRoles = getAllRoles();
    try {
      const resp = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: form.name,
          roles: allRoles,
          sector: form.sector,
          geo: form.geo,
          channels: form.ch,
          tone: form.tono,
          duration: form.dur,
          steps: result.steps,
          branches: result.branches,
        }),
      });
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `secuencia-${form.name.replace(/\s+/g, '-').toLowerCase()}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Error al exportar: ' + e.message);
    }
  };

  const resetAll = () => {
    setForm(INITIAL_STATE);
    setResult(null);
    setError('');
    setLoading(false);
    goTo(0);
  };

  return (
    <div className="wrap">
      <Topbar />
      <StepsBar current={step} />

      <div className={`pg ${step === 0 ? 'on' : ''}`}>
        <Step1Client form={form} update={update} onNext={() => next(1)} />
      </div>
      <div className={`pg ${step === 1 ? 'on' : ''}`}>
        <Step2Target form={form} update={update} onNext={() => next(2)} onBack={() => goTo(0)} />
      </div>
      <div className={`pg ${step === 2 ? 'on' : ''}`}>
        <Step3Channels form={form} update={update} onNext={() => next(3)} onBack={() => goTo(1)} />
      </div>
      <div className={`pg ${step === 3 ? 'on' : ''}`}>
        <Step4Review form={form} getAllRoles={getAllRoles} onGenerate={generate} onBack={() => goTo(2)} />
      </div>
      <div className={`pg ${step === 4 ? 'on' : ''}`}>
        <SequenceOutput
          form={form}
          getAllRoles={getAllRoles}
          result={result}
          loading={loading}
          error={error}
          onRetry={generate}
          onBack={() => goTo(3)}
          onReset={resetAll}
          onExport={exportDocx}
        />
      </div>
    </div>
  );
}
