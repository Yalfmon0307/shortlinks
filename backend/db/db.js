import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
	user: process.env.PGUSER,
	host: process.env.PGHOST,
	database: process.env.PGDATABASE,
	password: process.env.PGPASSWORD,
	port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
});

pool.connect()
	.then(() => console.log('Conexión a PostgreSQL exitosa'))
	.catch((err) => console.error('Error de conexión a PostgreSQL:', err));

export default pool;
