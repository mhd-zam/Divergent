import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5001;

import promptRoutes from './routes/promptRoutes';

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api', promptRoutes);

app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});


const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});

server.on('error', (error) => {
    console.error('Server failed to start:', error);
});
