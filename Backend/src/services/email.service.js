// src/services/email.service.js
// Email OTP delivery via Nodemailer / Gmail SMTP.

import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

/**
 * Send an OTP code to the given email address.
 * Falls back to console logging if Gmail is not configured.
 *
 * @param {string} email - Recipient email address
 * @param {string} otp   - 6-digit OTP code
 */
export async function sendEmailOTP(email, otp) {
  logger.info(`[EMAIL OTP] Sending to ${email}`);

  if (!env.isEmailConfigured) {
    logger.warn(`[EMAIL OTP] Gmail not configured. OTP for ${email}: ${otp}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"e-Gov Secure Services" <${env.EMAIL_USER}>`,
    to: email,
    subject: 'e-Gov Portal — Your Verification Code',
    html: buildEmailTemplate(otp),
  };

  await transporter.sendMail(mailOptions);
  logger.success(`[EMAIL OTP] Sent to ${email}`);
}

function buildEmailTemplate(otp) {
  return `
    <div style="font-family: 'Outfit', Arial, sans-serif; max-width: 600px; margin: 0 auto;
                border: 1px solid #d4af37; border-radius: 12px; overflow: hidden;
                background-color: #04090f; color: #ffffff;">
      <div style="background-color: #0a1628; padding: 24px; text-align: center;
                  border-bottom: 2px solid #d4af37;">
        <h1 style="color: #d4af37; margin: 0; font-size: 22px; letter-spacing: 1px;">
          🏛️ e-Gov Digital Portal
        </h1>
      </div>
      <div style="padding: 32px 24px; text-align: center;">
        <p style="font-size: 15px; color: #a0aec0; margin-bottom: 28px;">
          Use the code below to complete your request. It expires in <strong>5 minutes</strong>.
        </p>
        <div style="display: inline-block; background: linear-gradient(135deg, #ffd700 0%, #d4af37 100%);
                    color: #0a1628; font-size: 34px; font-weight: 900; padding: 14px 40px;
                    border-radius: 8px; letter-spacing: 6px;
                    box-shadow: 0 4px 16px rgba(212,175,55,0.35); margin-bottom: 28px;">
          ${otp}
        </div>
        <p style="font-size: 12px; color: #718096;">
          If you did not request this code, please ignore this email or contact support.
        </p>
      </div>
      <div style="background-color: #0a1628; padding: 12px; text-align: center;
                  font-size: 11px; color: #718096;">
        &copy; 2026 e-Gov Digital Services Portal. All rights reserved.
      </div>
    </div>
  `;
}
