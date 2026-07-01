// src/models/TelegramLink.js
// Mongoose schema that maps phone numbers to Telegram chat IDs.

import mongoose from 'mongoose';

const telegramLinkSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    chatId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const TelegramLink = mongoose.model('TelegramLink', telegramLinkSchema);
