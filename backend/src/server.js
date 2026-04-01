import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import planRoutes from './routes/plans.js';
import orderRoutes from './routes/orders.js';
import reviewRoutes from './routes/reviews.js';
import settingsRoutes from './routes/settings.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/api/health', (_, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/settings', settingsRoutes);

app.listen(PORT, () => console.log(`SyntaxHost API running on ${PORT}`));
