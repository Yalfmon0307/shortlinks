import { z } from 'zod';

export const createShortcutSchema = z.object({
	original_url: z.string()
		.max(2048, { message: 'La URL es demasiado larga (máx 2048 caracteres)' })
		.trim()
		.refine(val => /^https?:\/\/.+\..+/.test(val), { message: 'Debe ser una URL válida' }),
});
