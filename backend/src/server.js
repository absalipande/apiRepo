import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import geoRoutes from './routes/geoLocation.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};
app.use(cors(corsOptions));
app.set('trust proxy', true);

app.use('/api/auth', authRoutes);
app.use('/api', geoRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
