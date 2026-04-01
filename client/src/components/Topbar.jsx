import { useAuth } from '../context/AuthContext';

export default function Topbar() {
  const { user, signOut } = useAuth();

  const name = user?.user_metadata?.full_name || user?.email || '';
  const avatar = user?.user_metadata?.avatar_url;

  return (
    <header className="topbar">
      <div className="brand">
        <div className="bmark">HF</div>
        <div className="bname">Human<em>funnel</em></div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {avatar && (
          <img
            src={avatar}
            alt=""
            style={{ width: 28, height: 28, borderRadius: '50%' }}
          />
        )}
        <span style={{ fontSize: 13, color: 'var(--ink3)' }}>{name}</span>
        <button
          onClick={signOut}
          className="btn btn-g btn-sm"
          style={{ padding: '5px 12px', fontSize: 11 }}
        >
          Salir
        </button>
      </div>
    </header>
  );
}
