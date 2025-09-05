
import { useState } from 'react';
import { Link } from 'react-router-dom';


function CopyIcon({ copied }) {
	return (
		<svg
			width="22"
			height="22"
			viewBox="0 0 24 24"
			fill="none"
			style={{ cursor: 'pointer', marginLeft: 8, verticalAlign: 'middle' }}
		>
			<rect x="9" y="9" width="13" height="13" rx="2" stroke={copied ? '#00c853' : '#007bff'} strokeWidth="2" />
			<rect x="2" y="2" width="13" height="13" rx="2" stroke={copied ? '#00c853' : '#007bff'} strokeWidth="2" fill={copied ? '#b9f6ca' : 'none'} />
		</svg>
	);
}

export default function Index() {
	const [originalUrl, setOriginalUrl] = useState('');
	const [shortlink, setShortlink] = useState('');
	const [error, setError] = useState('');
	const [copied, setCopied] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setShortlink('');
		try {
			const res = await fetch('/shortlinks/api/shortlink', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ original_url: originalUrl }),
				credentials: 'include'
			});
			const data = await res.json();
			if (res.ok) {
				setShortlink(`/shortlinks/${data.short_code}`);
			} else {
				setError(data.error?.[0]?.message || 'Error al crear el shortlink');
			}
		} catch {
			setError('No se pudo conectar al servidor');
		}
	};

	const handleCopy = () => {
		if (shortlink) {
			navigator.clipboard.writeText(shortlink);
			setCopied(true);
			setTimeout(() => setCopied(false), 1200);
		}
	};

		 return (
			 <>
				<div style={{ minHeight: '100vh', width: '100vw', background: 'linear-gradient(135deg, #007bff 0%, #00c6ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					 <div style={{ maxWidth: 420, width: '100%', background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: 32, margin: 'auto' }}>
						 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
							 <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M17 7h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2m-10 0H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2m1 5h8" stroke="#007bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
							 <h1 style={{ marginLeft: 12, fontSize: 28, fontWeight: 700, color: '#007bff', letterSpacing: 1 }}>Shortlinks</h1>
						 </div>
						 <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
							 <label htmlFor="url" style={{ fontWeight: 500, color: '#333', fontSize: 16 }}>URL original</label>
							 <input
								 id="url"
								 type="text"
								 value={originalUrl}
								 onChange={e => setOriginalUrl(e.target.value)}
								 placeholder="Pega aquí tu URL larga"
								 style={{ padding: '12px 14px', fontSize: 16, borderRadius: 8, border: '1px solid #d1d5db', outline: 'none', transition: 'border 0.2s', marginBottom: 8 }}
								 required
							 />
							 <button type="submit" style={{ padding: '12px 0', fontSize: 17, borderRadius: 8, background: 'linear-gradient(90deg, #007bff 0%, #00c6ff 100%)', color: '#fff', border: 'none', fontWeight: 600, letterSpacing: 1, boxShadow: '0 2px 8px #007bff33', cursor: 'pointer', marginTop: 8 }}>
								 Acortar URL
							 </button>
						 </form>
						 {shortlink && (
							 <div style={{ marginTop: 32, textAlign: 'center', background: '#f1f5fb', padding: 18, borderRadius: 8, boxShadow: '0 2px 8px #007bff22', position: 'relative' }}>
								 <strong style={{ color: '#007bff', fontSize: 16 }}>Tu Shortlink:</strong>
								 <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
									...existing code...
									<Link to={shortlink} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', fontWeight: 600, fontSize: 18, wordBreak: 'break-all', textDecoration: 'underline' }}>{shortlink}</Link>
									 <span onClick={handleCopy} title="Copiar" style={{ display: 'inline-flex', alignItems: 'center' }}>
										 <CopyIcon copied={copied} />
									 </span>
								 </div>
								 {copied && (
									 <span style={{ position: 'absolute', top: 8, right: 18, background: '#00c853', color: '#fff', padding: '2px 10px', borderRadius: 8, fontSize: 13, fontWeight: 500 }}>¡Copiado!</span>
								 )}
							 </div>
						 )}
						 {error && (
							 <div style={{ marginTop: 24, color: '#d32f2f', textAlign: 'center', fontWeight: 500, fontSize: 15 }}>
								 {error}
							 </div>
						 )}
					 </div>
				 </div>
			 </>
		 );
}
