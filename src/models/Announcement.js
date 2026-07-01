// src/models/Announcement.js
// Mongoose schema for government announcements.

import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    summary: {
      type: String,
      required: [true, 'Summary is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,
    },
    priority: {
      type: String,
      enum: ['urgent', 'info', null],
      default: null,
    },
    isNew: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
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

export const Announcement = mongoose.model('Announcement', announcementSchema);
