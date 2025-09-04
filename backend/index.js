import cors from 'cors';
import router from './router/router.js';
import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 3002;


app.use(cors({
	origin: 'http://localhost:5173',
	credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/', router);

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
