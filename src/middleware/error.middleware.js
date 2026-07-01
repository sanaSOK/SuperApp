// src/middleware/error.middleware.js
// Global error handler — catches any unhandled errors and returns a clean JSON response.

import { logger } from '../utils/logger.js';

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  logger.error('Unhandled error:', err.message);

  // SQLite constraint violations
  if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    return res.status(400).json({
      success: false,
      error: 'duplicate_entry',
      message: 'This record already exists.',
    });
  }

  const status = err.status || err.statusCode || 500;
  const message = status < 500 ? err.message : 'An unexpected server error occurred.';

  return res.status(status).json({
    success: false,
    error: err.code || 'server_error',
    message,
  });
}

/**
 * Handle 404 — route not found.
 */
export function notFound(req, res) {
  return res.status(404).json({
    success: false,
    error: 'not_found',
    message: `Route ${req.method} ${req.path} not found.`,
  });
}
