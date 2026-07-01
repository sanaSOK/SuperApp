// src/index.js
// Main application entry point.
// Connects to MongoDB, then starts the Express server.

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { env } from './config/env.js';
import { connectDb } from './config/db.js';
import { logger } from './utils/logger.js';
import { initTelegramBot } from './services/telegram.service.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';

// ─── Route imports ────────────────────────────────────────────────────────────
import authRoutes         from './routes/auth.routes.js';
import otpRoutes          from './routes/otp.routes.js';
import userRoutes         from './routes/user.routes.js';
import servicesRoutes     from './routes/services.routes.js';
import announcementRoutes from './routes/announcements.routes.js';
import telegramRoutes     from './routes/telegram.routes.js';

// ─── App setup ───────────────────────────────────────────────────────────────
const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',  // Vite default
    'http://localhost:5174',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
  ],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/otp',           otpRoutes);
app.use('/api/users',         userRoutes);
app.use('/api/services',      servicesRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/telegram',      telegramRoutes);

// Health check — shows live DB connection status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'e-Gov Backend API',
    version: '2.0.0',
    database: 'MongoDB Atlas',
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// ─── Error handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Bootstrap: connect to MongoDB, then start server ────────────────────────
async function bootstrap() {
  await connectDb();
  initTelegramBot();

  app.listen(env.PORT, () => {
    logger.success(`\n🚀 e-Gov Backend API running on http://localhost:${env.PORT}`);
    logger.info(`   Environment : ${env.NODE_ENV}`);
    logger.info(`   Database    : MongoDB Atlas (${env.DB_NAME})`);
    logger.info(`   Email       : ${env.isEmailConfigured ? '✅ Configured' : '⚠️  Console fallback'}`);
    logger.info(`   SMS (Twilio): ${env.isTwilioConfigured ? '✅ Configured' : '⚠️  Console fallback'}`);
    logger.info(`   Telegram    : ${env.isTelegramConfigured ? '✅ Configured' : '⚠️  Console fallback'}`);
    logger.info('\n📡 Endpoints:');
    logger.info('   POST /api/auth/register        POST /api/auth/login');
    logger.info('   GET  /api/auth/me              POST /api/auth/forgot-password');
    logger.info('   POST /api/auth/reset-password  POST /api/otp/send');
    logger.info('   POST /api/otp/verify           GET  /api/users/profile');
    logger.info('   GET  /api/services             GET  /api/announcements');
    logger.info('   GET  /api/telegram/status/:phone');
    logger.info('   GET  /api/health\n');
  });
}

bootstrap().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
