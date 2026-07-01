// src/config/db.js
// MongoDB connection using Mongoose.
// Connects once at startup and reuses the connection across the app.

import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

/**
 * Connect to MongoDB Atlas via Mongoose.
 * Returns the mongoose connection object.
 */
export async function connectDb() {
  if (!env.MONGODB_URI) {
    logger.error('❌ MONGODB_URI is not set in .env. Cannot connect to database.');
    process.exit(1);
  }

  try {
    mongoose.set('strictQuery', true);

    await mongoose.connect(env.MONGODB_URI, {
      dbName: env.DB_NAME,
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
    });

    logger.success(`🍃 MongoDB connected → ${env.DB_NAME}`);
    logger.info(`   Host: ${mongoose.connection.host}`);
  } catch (err) {
    logger.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }

  // Log on disconnection
  mongoose.connection.on('disconnected', () => {
    logger.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
  });

  mongoose.connection.on('reconnected', () => {
    logger.success('🔄 MongoDB reconnected.');
  });

  return mongoose.connection;
}
