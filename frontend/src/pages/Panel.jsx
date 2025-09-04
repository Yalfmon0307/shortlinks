import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext.jsx';
import { Link } from 'react-router-dom';

export default function Panel() {
	const { user } = useUser();
	const [shortlinks, setShortlinks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		async function fetchShortlinks() {
			setLoading(true);
			setError('');
			try {
				const res = await fetch('/shortlinks/api/user/shortlinks', {
					credentials: 'include',
				});
				const data = await res.json();
				if (res.ok) {
					setShortlinks(data.shortlinks);
				} else {
					setError(data.error || 'Error al cargar los enlaces');
				}
			} catch {
				setError('No se pudo conectar al servidor');
			}
			setLoading(false);
		}
		fetchShortlinks();
	}, []);

	if (!user) {
		return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #007bff 0%, #00c6ff 100%)' }}>
			<div style={{ background: '#fff', padding: 40, borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.10)', textAlign: 'center', color: '#d32f2f', fontWeight: 600 }}>
				Debes iniciar sesión para ver tu panel.
			</div>
		</div>;
	}

	return (
		<div style={{ minHeight: '100vh', width: '100vw', background: 'linear-gradient(135deg, #007bff 0%, #00c6ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
			<div style={{ maxWidth: 700, width: '100%', background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.10)', padding: 32, margin: '40px auto' }}>
							<div style={{ marginBottom: 18, textAlign: 'right' }}>
								<Link to="/" style={{ color: '#007bff', fontWeight: 600, textDecoration: 'underline', fontSize: 16 }}>← Volver al Home</Link>
							</div>
				<h2 style={{ color: '#007bff', fontWeight: 700, marginBottom: 24, textAlign: 'center' }}>Panel de usuario</h2>
				<div style={{ marginBottom: 24, textAlign: 'center', color: '#333', fontSize: 17 }}>
					<strong>Bienvenido, {user.name}</strong><br />
					<span style={{ color: '#555', fontSize: 15 }}>{user.email}</span>
				</div>
				{loading ? (
					<div style={{ textAlign: 'center', color: '#007bff', fontWeight: 500 }}>Cargando enlaces...</div>
				) : error ? (
					<div style={{ textAlign: 'center', color: '#d32f2f', fontWeight: 500 }}>{error}</div>
				) : shortlinks.length === 0 ? (
					<div style={{ textAlign: 'center', color: '#555', fontWeight: 500 }}>No has creado ningún shortlink aún.</div>
				) : (
					<table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
						<thead>
							<tr style={{ background: '#f1f5fb' }}>
								<th style={{ padding: '10px 6px', fontWeight: 600, color: '#007bff', fontSize: 15 }}>Shortlink</th>
								<th style={{ padding: '10px 6px', fontWeight: 600, color: '#007bff', fontSize: 15 }}>URL original</th>
								<th style={{ padding: '10px 6px', fontWeight: 600, color: '#007bff', fontSize: 15 }}>Fecha de creación</th>
								<th style={{ padding: '10px 6px', fontWeight: 600, color: '#007bff', fontSize: 15 }}>Visitas</th>
							</tr>
						</thead>
						<tbody>
							{shortlinks.map(link => (
								<tr key={link.id} style={{ borderBottom: '1px solid #eee' }}>
									<td style={{ padding: '8px 6px' }}>
										<Link to={`/${link.short_code}`} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', fontWeight: 600, textDecoration: 'underline' }}>{link.short_code}</Link>
									</td>
									<td style={{ padding: '8px 6px', wordBreak: 'break-all', color: '#333' }}>{link.original_url}</td>
									<td style={{ padding: '8px 6px', color: '#555', fontSize: 14 }}>{new Date(link.created_at).toLocaleString()}</td>
									<td style={{ padding: '8px 6px', color: '#007bff', fontWeight: 600 }}>
										{link.visit_count}
										{Array.isArray(link.visits) && link.visits.length > 0 && (
											<div style={{ marginTop: 6, fontSize: 13, color: '#333', background: '#f9f9f9', borderRadius: 6, padding: '6px 8px' }}>
												<strong>Visitas recientes:</strong>
												<ul style={{ margin: 0, paddingLeft: 16 }}>
													{link.visits.slice(0, 5).map((visit, idx) => (
														<li key={idx} style={{ marginBottom: 2 }}>
															IP: {visit.ip} <span style={{ color: '#888' }}>({new Date(visit.visited_at).toLocaleString()})</span>
														</li>
													))}
												</ul>
											</div>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
}
