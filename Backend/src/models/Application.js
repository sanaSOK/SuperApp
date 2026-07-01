// src/models/Application.js
// Mongoose schema for citizen government service applications.

import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    // e.g. "APP-2026-4821"
    appId: {
      type: String,
      unique: true,
      default: () => `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    status: {
      type: String,
      enum: ['submitted', 'processing', 'approved', 'rejected'],
      default: 'submitted',
    },
    step: {
      type: Number,
      default: 1,
      min: 1,
    },
    totalSteps: {
      type: Number,
      default: 4,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Application = mongoose.model('Application', applicationSchema);
