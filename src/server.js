import express from 'express';
import dotenv from 'dotenv';
import securityMiddleware from './middlewares/security.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import walletRoutes from './routes/walletRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

securityMiddleware(app);

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/wallet', walletRoutes);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
