import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const res = await fetch('/shortlinks/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Registro exitoso');
        setTimeout(() => navigate('/login'), 1200);
      } else {
        setMessage(data.error || 'Error al registrar');
      }
    } catch {
      setMessage('No se pudo conectar al servidor');
    }
    setLoading(false);
  };

  return (
  <div style={{ minHeight: '100vh', width: '100vw', background: 'linear-gradient(135deg, #007bff 0%, #00c6ff 100%)', display: 'flex', flexDirection: 'column' }}>
  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw' }}>
        <div style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', minWidth: 320, width: '100%', maxWidth: 400 }}>
          <h2 style={{ color: '#007bff', fontWeight: 700, marginBottom: 24, textAlign: 'center' }}>Registrarse</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <input type="text" placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} required style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 15 }} />
            <input type="email" placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 15 }} />
            <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 15 }} />
            <button type="submit" disabled={loading} style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 0', fontWeight: 600, fontSize: 16, marginTop: 8, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>
          {message && <div style={{ marginTop: 18, color: message.includes('exitoso') ? '#00c853' : '#d32f2f', fontWeight: 500, textAlign: 'center' }}>{message}</div>}
        </div>
      </div>
    </div>
  );
}
