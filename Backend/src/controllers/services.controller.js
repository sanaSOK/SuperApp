// src/controllers/services.controller.js
// Government services catalog endpoints.

import { Service } from '../models/Service.js';
import { success, failure, serverError } from '../utils/response.js';

// ─── GET /api/services?category=Health&q=search ───────────────────────────────
export async function getAllServices(req, res) {
  try {
    const { category, q } = req.query;
    let query = { isActive: true };

    let services;
    if (q) {
      // Full-text search via MongoDB text index
      services = await Service.find(
        { ...query, $text: { $search: q } },
        { score: { $meta: 'textScore' } }
      ).sort({ score: { $meta: 'textScore' } });
    } else {
      if (category && category !== 'All') query.category = category;
      services = await Service.find(query).sort({ title: 1 });
    }

    const categories = await Service.distinct('category', { isActive: true });
    return success(res, { services, categories, total: services.length });
  } catch (err) {
    return serverError(res, err);
  }
}

// ─── GET /api/services/:id ────────────────────────────────────────────────────
export async function getServiceById(req, res) {
  try {
    const service = await Service.findOne({ _id: req.params.id, isActive: true });
    if (!service) return failure(res, 'not_found', 'Service not found.', 404);
    return success(res, { service });
  } catch (err) {
    return serverError(res, err);
  }
}
