// src/controllers/auth.controller.js
// Handles registration, login, forgot password, reset password, and /me.

import bcrypt from 'bcryptjs';
import { User, normalizeIdentifier } from '../models/User.js';
import { signToken } from '../middleware/auth.middleware.js';
import { createOTP, verifyOTP } from '../services/otp.service.js';
import { sendEmailOTP } from '../services/email.service.js';
import { sendSMSOTP } from '../services/sms.service.js';
import { getTelegramChatId, sendTelegramOTP } from '../services/telegram.service.js';
import { success, failure, serverError } from '../utils/response.js';

// ─── POST /api/auth/register ──────────────────────────────────────────────────
export async function register(req, res) {
  try {
    const { identifier, password, name } = req.body;
    const normalized = normalizeIdentifier(identifier);

    const exists = await User.findOne({ identifier: normalized });
    if (exists) {
      return failure(res, 'account_exists', 'An account with this email or phone already exists. Please log in.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const isEmail = normalized.includes('@');
    const displayName = name || (isEmail ? normalized.split('@')[0] : 'Citizen');

    const user = await User.create({
      identifier: normalized,
      password: hashedPassword,
      name: displayName,
    });

    const token = signToken(user._id.toString());
    return success(res, { token, user }, 'Account created successfully!', 201);
  } catch (err) {
    if (err.code === 11000) {
      return failure(res, 'account_exists', 'An account with this email or phone already exists.');
    }
    return serverError(res, err);
  }
}

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
export async function login(req, res) {
  try {
    const { identifier, password } = req.body;
    const normalized = normalizeIdentifier(identifier);

    // Must explicitly select password since it's hidden by default
    const user = await User.findOne({ identifier: normalized }).select('+password');

    if (!user) {
      return failure(res, 'account_not_found', 'Account not found. Please click Sign Up to register first.');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return failure(res, 'wrong_password', 'Incorrect password. Click Forgot Password to reset using OTP.');
    }

    const token = signToken(user._id.toString());
    // Remove password from response
    const userObj = user.toJSON();
    return success(res, { token, user: userObj }, 'Logged in successfully!');
  } catch (err) {
    return serverError(res, err);
  }
}

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
export function me(req, res) {
  return success(res, { user: req.user }, 'User profile retrieved.');
}

// ─── POST /api/auth/forgot-password ──────────────────────────────────────────
export async function forgotPassword(req, res) {
  try {
    const { identifier, channel = 'email' } = req.body;
    const normalized = normalizeIdentifier(identifier);

    const user = await User.findOne({ identifier: normalized });
    if (!user) {
      // Security: don't reveal whether account exists
      return success(res, {}, 'If an account exists, a reset code has been sent.');
    }

    const otp = await createOTP(normalized, 'reset', channel);

    if (channel === 'email' || normalized.includes('@')) {
      await sendEmailOTP(normalized, otp);
    } else if (channel === 'telegram') {
      const chatId = await getTelegramChatId(normalized);
      if (!chatId) {
        return failure(res, 'telegram_not_linked',
          'Telegram is not linked to this phone number. Please use SMS or link your Telegram first.');
      }
      await sendTelegramOTP(chatId, otp);
    } else {
      await sendSMSOTP(normalized, otp);
    }

    return success(res, { channel }, 'Password reset OTP sent successfully.');
  } catch (err) {
    return serverError(res, err);
  }
}

// ─── POST /api/auth/reset-password ───────────────────────────────────────────
export async function resetPassword(req, res) {
  try {
    const { identifier, code, newPassword } = req.body;
    const normalized = normalizeIdentifier(identifier);

    const { valid, error } = await verifyOTP(normalized, code, 'reset');
    if (!valid) return failure(res, 'otp_invalid', error);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await User.findOneAndUpdate(
      { identifier: normalized },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) return failure(res, 'user_not_found', 'Account not found.', 404);

    const token = signToken(user._id.toString());
    return success(res, { token, user }, 'Password reset successfully! Logging you in...');
  } catch (err) {
    return serverError(res, err);
  }
}
