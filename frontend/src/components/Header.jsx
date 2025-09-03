import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';


export default function Header() {
  const { user, loading, logout } = useUser();

  return (
    <header style={{ width: '100%', background: '#007bff', padding: '16px 0', boxShadow: '0 2px 8px #007bff22' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M17 7h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2m-10 0H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2m1 5h8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span style={{ marginLeft: 10, fontWeight: 700, fontSize: 22, color: '#fff', letterSpacing: 1 }}>Shortlinks</span>
        </div>
        <div>
          {!loading && user ? (
            <>
              <Link to="/panel" style={{ background: '#fff', color: '#007bff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer', boxShadow: '0 2px 8px #007bff22', textDecoration: 'none', marginRight: 12 }}>Panel de usuario</Link>
              <button onClick={logout} style={{ background: '#fff', color: '#d32f2f', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer', boxShadow: '0 2px 8px #d32f2f22', textDecoration: 'none' }}>Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ marginRight: 12, background: '#fff', color: '#007bff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer', boxShadow: '0 2px 8px #007bff22', textDecoration: 'none' }}>Iniciar sesión</Link>
              <Link to="/register" style={{ background: '#fff', color: '#007bff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer', boxShadow: '0 2px 8px #007bff22', textDecoration: 'none' }}>Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
