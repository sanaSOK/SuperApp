// src/models/User.js
// Mongoose schema and model for citizens/admin users.

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    // e.g. "GOV-2026-123"
    citizenId: {
      type: String,
      unique: true,
      default: () => `GOV-2026-${Math.floor(100 + Math.random() * 900)}`,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    // email or normalized phone number (digits only)
    identifier: {
      type: String,
      required: [true, 'Identifier is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // Never returned in queries by default
    },
    role: {
      type: String,
      enum: ['citizen', 'admin'],
      default: 'citizen',
    },
    tier: {
      type: String,
      enum: ['standard', 'gold', 'platinum'],
      default: 'standard',
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  }
);

export const User = mongoose.model('User', userSchema);

// ─── Helper utilities ─────────────────────────────────────────────────────────

/**
 * Normalize an identifier: lowercase emails, strip non-digits from phone numbers.
 */
export function normalizeIdentifier(identifier) {
  if (!identifier) return '';
  const trimmed = identifier.trim();
  return trimmed.includes('@')
    ? trimmed.toLowerCase()
    : trimmed.replace(/\D/g, '');
}
