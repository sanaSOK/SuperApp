// src/controllers/announcements.controller.js
// Government announcements endpoints.

import { Announcement } from '../models/Announcement.js';
import { success, failure, serverError } from '../utils/response.js';

// ─── GET /api/announcements?category=Finance ──────────────────────────────────
export async function getAllAnnouncements(req, res) {
  try {
    const { category } = req.query;
    const query = { isActive: true };
    if (category && category !== 'All') query.category = category;

    const announcements = await Announcement.find(query).sort({ publishedAt: -1 });
    const categories = await Announcement.distinct('category', { isActive: true });

    return success(res, { announcements, categories, total: announcements.length });
  } catch (err) {
    return serverError(res, err);
  }
}

// ─── GET /api/announcements/:id ───────────────────────────────────────────────
export async function getAnnouncementById(req, res) {
  try {
    const ann = await Announcement.findOne({ _id: req.params.id, isActive: true });
    if (!ann) return failure(res, 'not_found', 'Announcement not found.', 404);
    return success(res, { announcement: ann });
  } catch (err) {
    return serverError(res, err);
  }
}

// ─── POST /api/announcements  (admin only) ────────────────────────────────────
export async function createAnnouncement(req, res) {
  try {
    const { title, summary, category, priority, isNew } = req.body;
    const ann = await Announcement.create({ title, summary, category, priority, isNew });
    return success(res, { announcement: ann }, 'Announcement published.', 201);
  } catch (err) {
    return serverError(res, err);
  }
}

// ─── DELETE /api/announcements/:id  (admin only) ─────────────────────────────
export async function deleteAnnouncement(req, res) {
  try {
    await Announcement.findByIdAndUpdate(req.params.id, { isActive: false });
    return success(res, {}, 'Announcement removed.');
  } catch (err) {
    return serverError(res, err);
  }
}
