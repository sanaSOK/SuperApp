// src/controllers/user.controller.js
// User profile and applications endpoints (all require JWT auth).

import { Application } from '../models/Application.js';
import { success, failure, serverError } from '../utils/response.js';

// ─── GET /api/users/profile ───────────────────────────────────────────────────
export async function getProfile(req, res) {
  try {
    const applications = await Application.find({ user: req.user._id })
      .populate('service', 'title icon category');

    return success(res, {
      user: req.user,
      stats: {
        applications: applications.length,
        documents: 8, // placeholder
        tier: req.user.tier || 'standard',
      },
    });
  } catch (err) {
    return serverError(res, err);
  }
}

// ─── GET /api/users/applications ─────────────────────────────────────────────
export async function getApplications(req, res) {
  try {
    const applications = await Application.find({ user: req.user._id })
      .populate('service', 'title icon category')
      .sort({ createdAt: -1 });

    return success(res, { applications });
  } catch (err) {
    return serverError(res, err);
  }
}

// ─── POST /api/users/applications ────────────────────────────────────────────
export async function createApplication(req, res) {
  try {
    const { serviceId } = req.body;
    if (!serviceId) return failure(res, 'missing_service', 'serviceId is required.');

    const application = await Application.create({
      user: req.user._id,
      service: serviceId,
    });

    const populated = await application.populate('service', 'title icon category');
    return success(res, { application: populated }, 'Application submitted successfully!', 201);
  } catch (err) {
    return serverError(res, err);
  }
}
