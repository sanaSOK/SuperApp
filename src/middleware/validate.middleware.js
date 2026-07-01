// src/middleware/validate.middleware.js
// Request validation middleware using express-validator.

import { validationResult } from 'express-validator';
import { failure } from '../utils/response.js';

/**
 * Runs after express-validator check() chains.
 * Returns a 422 with all validation errors if any are present.
 */
export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const first = errors.array()[0];
    return failure(res, 'validation_error', first.msg, 422);
  }
  next();
}
