// src/models/Service.js
// Mongoose schema for the government service catalog.

import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,
    },
    color: {
      type: String,
      default: 'rgba(212,175,55,0.1)',
    },
    badge: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
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

// Text search index for search functionality
serviceSchema.index({ title: 'text', description: 'text', category: 'text' });

export const Service = mongoose.model('Service', serviceSchema);
