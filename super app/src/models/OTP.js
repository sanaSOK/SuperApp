// src/models/OTP.js
// Mongoose schema for OTP codes. Uses MongoDB TTL index for auto-expiry.

import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: ['login', 'verify', 'reset'],
      default: 'login',
    },
    channel: {
      type: String,
      enum: ['email', 'sms', 'telegram'],
      default: 'email',
    },
    used: {
      type: Boolean,
      default: false,
    },
    // TTL index: MongoDB auto-deletes documents 5 minutes after expiresAt
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL: delete when expiresAt is reached
    },
  },
  { timestamps: true }
);

export const OTP = mongoose.model('OTP', otpSchema);
