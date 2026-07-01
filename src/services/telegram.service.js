// src/services/telegram.service.js
// Telegram OTP delivery and phone-link management using MongoDB persistence.

import TelegramBot from 'node-telegram-bot-api';
import { TelegramLink } from '../models/TelegramLink.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

let bot = null;

/**
 * Initialize the Telegram bot (called once at app startup).
 */
export function initTelegramBot() {
  if (!env.isTelegramConfigured) {
    logger.warn('⚠️  TELEGRAM_BOT_TOKEN not set. Telegram OTP will log to console only.');
    return;
  }

  try {
    bot = new TelegramBot(env.TELEGRAM_BOT_TOKEN, { polling: true });
    logger.success('🤖 Telegram Bot initialized and polling.');

    // /start command — prompt contact share
    bot.onText(/\/start/, (msg) => {
      bot.sendMessage(
        msg.chat.id,
        '🏛️ *Welcome to the e-Gov Portal Verification Bot!*\n\nClick the button below to link your Telegram account with your phone number.',
        {
          parse_mode: 'Markdown',
          reply_markup: {
            keyboard: [[{ text: '📞 Share Contact', request_contact: true }]],
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        }
      );
    });

    // Contact share — upsert phone → chatId into MongoDB
    bot.on('contact', async (msg) => {
      const chatId = String(msg.chat.id);
      if (msg.contact?.phone_number) {
        const phone = msg.contact.phone_number.replace(/\D/g, '');
        await saveTelegramLink(phone, chatId);
        bot.sendMessage(
          chatId,
          '✅ *Account successfully linked!*\n\nYou will receive OTP codes here when accessing e-Gov services.',
          { parse_mode: 'Markdown', reply_markup: { remove_keyboard: true } }
        );
        logger.success(`🔗 Telegram linked: chatId=${chatId} → phone=${phone}`);
      } else {
        bot.sendMessage(chatId, '❌ Failed to link. Please share your official phone number contact.');
      }
    });
  } catch (err) {
    logger.error('Failed to initialize Telegram Bot:', err.message);
  }
}

/**
 * Upsert a phone → chatId mapping into MongoDB.
 */
async function saveTelegramLink(phone, chatId) {
  await TelegramLink.findOneAndUpdate(
    { phone },
    { chatId },
    { upsert: true, new: true }
  );
}

/**
 * Get the Telegram chatId linked to a phone number (from MongoDB).
 * @returns {Promise<string|null>}
 */
export async function getTelegramChatId(phone) {
  const link = await TelegramLink.findOne({ phone });
  return link?.chatId || null;
}

/**
 * Check if a phone number is linked to a Telegram account.
 */
export async function isTelegramLinked(phone) {
  const chatId = await getTelegramChatId(phone);
  return !!chatId;
}

/**
 * Send an OTP code via Telegram.
 */
export async function sendTelegramOTP(chatId, otp) {
  const message = `🏛️ *e-Gov Secure Verification*\n\nYour login OTP code is:\n\n*${otp}*\n\nDo not share this code. Expires in 5 minutes.`;

  if (bot) {
    await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    logger.success(`[TELEGRAM OTP] Sent to chatId=${chatId}`);
  } else {
    logger.warn(`[TELEGRAM OTP] Bot not running. OTP for chatId=${chatId}: ${otp}`);
  }
}
