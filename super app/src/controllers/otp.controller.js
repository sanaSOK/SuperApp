// src/controllers/otp.controller.js
// Handles send-otp and verify-otp endpoints.

import { normalizeIdentifier, User } from '../models/User.js';
import { createOTP, verifyOTP } from '../services/otp.service.js';
import { sendEmailOTP } from '../services/email.service.js';
import { sendSMSOTP } from '../services/sms.service.js';
import { getTelegramChatId, sendTelegramOTP } from '../services/telegram.service.js';
import { signToken } from '../middleware/auth.middleware.js';
import { success, failure, serverError } from '../utils/response.js';

// ─── POST /api/otp/send ───────────────────────────────────────────────────────
export async function sendOtp(req, res) {
  try {
    const { type, identifier, phoneOption, purpose = 'login' } = req.body;
    const normalized = normalizeIdentifier(identifier);
    const channel = type === 'email' ? 'email' : (phoneOption === 'telegram' ? 'telegram' : 'sms');

    const otp = await createOTP(normalized, purpose, channel);

    if (type === 'email') {
      await sendEmailOTP(normalized, otp);
      return success(res, { channel: 'email' }, 'OTP sent to your email successfully!');
    }

    if (type === 'phone') {
      if (phoneOption === 'telegram') {
        const chatId = await getTelegramChatId(normalized);
        if (!chatId) {
          return failure(res, 'telegram_not_linked',
            'Your Telegram is not linked to this phone number yet. Please link it first or choose SMS.');
        }
        await sendTelegramOTP(chatId, otp);
        return success(res, { channel: 'telegram' }, 'OTP sent to your Telegram!');
      }

      // Default: SMS
      await sendSMSOTP(normalized, otp);
      return success(res, { channel: 'sms' }, 'OTP sent via SMS successfully!');
    }

    return failure(res, 'invalid_type', 'Invalid OTP type. Must be "email" or "phone".');
  } catch (err) {
    return serverError(res, err);
  }
}

// ─── POST /api/otp/verify ─────────────────────────────────────────────────────
export async function verifyOtp(req, res) {
  try {
    const { identifier, code, purpose = 'login' } = req.body;
    const normalized = normalizeIdentifier(identifier);

    const { valid, error } = await verifyOTP(normalized, code, purpose);
    if (!valid) return failure(res, 'otp_invalid', error);

    const user = await User.findOne({ identifier: normalized });
    if (!user) {
      return failure(res, 'user_not_found', 'Account not found. Please register first.');
    }

    const token = signToken(user._id.toString());
    return success(res, { token, user }, 'OTP verified successfully!');
  } catch (err) {
    return serverError(res, err);
  }
}
