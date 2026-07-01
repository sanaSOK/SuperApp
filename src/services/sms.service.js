// src/services/sms.service.js
// SMS OTP delivery via Twilio.

import twilio from 'twilio';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

/**
 * Send an OTP code via SMS to the given phone number.
 * Falls back to console logging if Twilio is not configured.
 *
 * @param {string} phone - Normalized phone number (digits only, with country code)
 * @param {string} otp   - 6-digit OTP code
 */
export async function sendSMSOTP(phone, otp) {
  logger.info(`[SMS OTP] Sending to +${phone}`);

  if (!env.isTwilioConfigured) {
    logger.warn(`[SMS OTP] Twilio not configured. OTP for +${phone}: ${otp}`);
    return;
  }

  const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

  await client.messages.create({
    body: `e-Gov Secure Portal Verification Code: ${otp}. Valid for 5 minutes. Do not share.`,
    from: env.TWILIO_PHONE_NUMBER,
    to: `+${phone}`,
  });

  logger.success(`[SMS OTP] Sent to +${phone}`);
}
