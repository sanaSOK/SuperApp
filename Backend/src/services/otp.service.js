// src/services/otp.service.js
// Core OTP business logic — generation, storage, and validation using MongoDB.

import { OTP } from '../models/OTP.js';
import { normalizeIdentifier } from '../models/User.js';

/**
 * Generate a cryptographically random 6-digit OTP code.
 */
export function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/**
 * Create and persist a new OTP for an identifier.
 * Any previous active OTPs for the same identifier+purpose are invalidated.
 *
 * @param {string} identifier - email or phone
 * @param {string} purpose    - 'login' | 'verify' | 'reset'
 * @param {string} channel    - 'email' | 'sms' | 'telegram'
 * @returns {Promise<string>} The generated 6-digit code
 */
export async function createOTP(identifier, purpose = 'login', channel = 'email') {
  const normalized = normalizeIdentifier(identifier);
  const code = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  // Invalidate all previous OTPs for this identifier+purpose
  await OTP.updateMany(
    { identifier: normalized, purpose, used: false },
    { $set: { used: true } }
  );

  await OTP.create({ identifier: normalized, code, purpose, channel, expiresAt });
  return code;
}

/**
 * Verify an OTP for an identifier+purpose.
 * Marks the OTP as used on success.
 *
 * @returns {Promise<{ valid: boolean, error?: string }>}
 */
export async function verifyOTP(identifier, code, purpose = 'login') {
  const normalized = normalizeIdentifier(identifier);

  const record = await OTP.findOne({
    identifier: normalized,
    purpose,
    used: false,
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });

  if (!record) {
    return { valid: false, error: 'No active OTP found. Please request a new code.' };
  }

  if (record.code !== String(code).trim()) {
    return { valid: false, error: 'Invalid OTP code. Please try again.' };
  }

  record.used = true;
  await record.save();

  return { valid: true };
}
