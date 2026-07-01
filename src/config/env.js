// src/config/env.js
// Validates and exports all environment variables in one place.

import dotenv from 'dotenv';
dotenv.config();

export const env = {
  // Server
  PORT: parseInt(process.env.PORT || '3001', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',

  // MongoDB
  MONGODB_URI: process.env.MONGODB_URI || '',
  DB_NAME: process.env.DB_NAME || 'egov_portal',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_change_in_production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // Email (Nodemailer / Gmail)
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASS: process.env.EMAIL_PASS || '',
  get isEmailConfigured() {
    return !!(this.EMAIL_USER && this.EMAIL_PASS &&
              this.EMAIL_USER !== 'your-email@gmail.com');
  },

  // Telegram
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '',
  get isTelegramConfigured() {
    return !!(this.TELEGRAM_BOT_TOKEN &&
              this.TELEGRAM_BOT_TOKEN !== 'your-telegram-bot-token-here');
  },

  // Twilio
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || '',
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || '',
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER || '',
  get isTwilioConfigured() {
    return !!(this.TWILIO_ACCOUNT_SID && this.TWILIO_AUTH_TOKEN &&
              this.TWILIO_ACCOUNT_SID !== 'your-twilio-sid-here');
  },
};
