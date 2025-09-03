// Controlador para cerrar sesión
export const logout = (req, res) => {
	res.clearCookie('token', {
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		path: '/',
	});
	return res.json({ message: 'Sesión cerrada correctamente' });
};

import bcrypt from 'bcryptjs';
import { generateToken, verifyToken } from '../helpers/token.js';
import pool from '../db/db.js';
import { createShortcutSchema } from '../helpers/linkSchema.js';

// Función para generar un código corto aleatorio
function generateShortCode(length = 6) {
	const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let code = '';
	for (let i = 0; i < length; i++) {
		code += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return code;
}

export const createShortlink = async (req, res) => {
			// Validar la petición
			const result = createShortcutSchema.safeParse(req.body);
			if (!result.success) {
				return res.status(400).json({ error: result.error.errors });
			}

			let { original_url } = result.data;
			original_url = original_url.replace(/[<>"'`]/g, '').trim();

			let short_code = generateShortCode();

			// Verificar que el short_code no exista ya
			let exists = true;
			while (exists) {
				const { rowCount } = await pool.query('SELECT 1 FROM shortlinks WHERE short_code = $1', [short_code]);
				if (rowCount === 0) exists = false;
				else short_code = generateShortCode();
			}

			// Obtener el user_id si el usuario está logueado
			let user_id = null;
			const token = req.cookies.token;
			console.log('[CREATE] Cookie token:', token);
			if (token) {
				const payload = verifyToken(token);
				console.log('[CREATE] Token payload:', payload);
				if (payload && payload.id) {
					user_id = payload.id;
				}
			}
			console.log('[CREATE] user_id:', user_id);
			console.log('[CREATE] short_code:', short_code, 'original_url:', original_url);

			// Guardar en la base de datos
			try {
				await pool.query(
					'INSERT INTO shortlinks (short_code, original_url, user_id) VALUES ($1, $2, $3)',
					[short_code, original_url, user_id]
				);
				console.log('[CREATE] Shortlink creado');
				return res.status(201).json({ short_code, original_url });
			} catch (err) {
				console.log('[CREATE] Error al crear shortlink:', err.message);
				return res.status(500).json({ error: 'Error al crear el shortlink', details: err.message });
			}
};

export const redirectShortlink = async (req, res) => {
		const { short_code } = req.params;
		try {
			// Buscar el shortlink y obtener su id y url
			const result = await pool.query(
				'SELECT id, original_url FROM shortlinks WHERE short_code = $1',
				[short_code]
			);
			if (result.rowCount === 0) {
				return res.status(404).send('Shortlink no encontrado');
			}
			const { id: shortlink_id, original_url } = result.rows[0];

			// Obtener la IP del visitante
			const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';

			// Registrar la visita
			await pool.query(
				'INSERT INTO visits (shortlink_id, ip) VALUES ($1, $2)',
				[shortlink_id, ip]
			);

			return res.redirect(original_url);
		} catch (err) {
			return res.status(500).send('Error al redirigir');
		}
};

// Registro de usuario
export const register = async (req, res) => {
	const { name, email, password } = req.body;
	if (!name || !email || !password) {
		return res.status(400).json({ error: 'Todos los campos son obligatorios' });
	}
	try {
		// Verificar si el usuario ya existe
		const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
		if (exists.rowCount > 0) {
			return res.status(400).json({ error: 'El correo ya está registrado' });
		}
		// Encriptar contraseña
		const hashed = await bcrypt.hash(password, 10);
		await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, hashed]);
		return res.status(201).json({ message: 'Registro exitoso' });
	} catch (err) {
		return res.status(500).json({ error: 'Error al registrar', details: err.message });
	}
};

// Obtener datos del usuario autenticado
export const me = async (req, res) => {
			const token = req.cookies.token;
		if (!token) {
			return res.status(401).json({ error: 'No autenticado' });
		}
			const payload = verifyToken(token);
		if (!payload) {
			return res.status(401).json({ error: 'Token inválido' });
		}
		try {
				res.set('Cache-Control', 'no-store');
				const result = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [payload.id]);
				if (result.rowCount === 0) {
					return res.status(404).json({ error: 'Usuario no encontrado' });
				}
				return res.json({ user: result.rows[0] });
		} catch (err) {
			return res.status(500).json({ error: 'Error al obtener usuario', details: err.message });
		}
};
export const login = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({ error: 'Correo y contraseña obligatorios' });
	}
	try {
		const result = await pool.query('SELECT id, password, name FROM users WHERE email = $1', [email]);
		if (result.rowCount === 0) {
			return res.status(400).json({ error: 'Credenciales incorrectas' });
		}
		const user = result.rows[0];
		const valid = await bcrypt.compare(password, user.password);
		if (!valid) {
			return res.status(400).json({ error: 'Credenciales incorrectas' });
		}
		// Generar token JWT
		const token = generateToken({ id: user.id, email, name: user.name });
		res.cookie('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
			sameSite: 'lax',
		});
		return res.status(200).json({ message: 'Inicio de sesión exitoso' });
	} catch (err) {
		return res.status(500).json({ error: 'Error al iniciar sesión', details: err.message });
	}
};

// Obtener todos los shortlinks del usuario autenticado con estadísticas
export const userShortlinks = async (req, res) => {
	const token = req.cookies.token;
	if (!token) return res.status(401).json({ error: 'No autenticado' });
	const payload = verifyToken(token);
	if (!payload) return res.status(401).json({ error: 'Token inválido' });
	try {
		// Obtener todos los shortlinks del usuario
		const linksResult = await pool.query(
			`SELECT s.id, s.short_code, s.original_url, s.created_at,
				(SELECT COUNT(*) FROM visits v WHERE v.shortlink_id = s.id) AS visit_count
			 FROM shortlinks s WHERE s.user_id = $1 ORDER BY s.created_at DESC`,
			[payload.id]
		);

		// Para cada shortlink, obtener sus visitas (ip y fecha)
		const shortlinks = await Promise.all(
			linksResult.rows.map(async (link) => {
				const visitsResult = await pool.query(
					'SELECT ip, visited_at FROM visits WHERE shortlink_id = $1 ORDER BY visited_at DESC',
					[link.id]
				);
				return {
					...link,
					visits: visitsResult.rows
				};
			})
		);
		return res.json({ shortlinks });
	} catch (err) {
		return res.status(500).json({ error: 'Error al obtener shortlinks', details: err.message });
	}
};