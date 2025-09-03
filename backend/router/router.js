import { Router } from 'express';
import { createShortlink, redirectShortlink, login, register, me, userShortlinks, logout } from '../controller/controller.js';


const router = Router();

// Ruta para cerrar sesión
router.post('/logout', logout);


// Ruta para crear un shortlink
router.post('/shortlink', createShortlink);

// Ruta para login y registro de usuario
router.post('/login', login);
router.post('/register', register);

// Ruta para obtener los shortlinks y estadísticas del usuario
router.get('/user/shortlinks', userShortlinks);


// Ruta para obtener datos del usuario autenticado
router.get('/me', me);

// Ruta para redirigir usando el short_code
router.get('/:short_code', redirectShortlink);

export default router;
