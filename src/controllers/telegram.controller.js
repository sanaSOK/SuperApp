// src/controllers/telegram.controller.js
// Telegram link status endpoint.

import { isTelegramLinked } from '../services/telegram.service.js';
import { normalizeIdentifier } from '../models/User.js';
import { success, serverError } from '../utils/response.js';

// ─── GET /api/telegram/status/:phone ─────────────────────────────────────────
export async function getTelegramStatus(req, res) {
  try {
    const phone = normalizeIdentifier(req.params.phone);
    const isLinked = await isTelegramLinked(phone);
    return success(res, { isLinked, phone });
  } catch (err) {
    return serverError(res, err);
  }
}
