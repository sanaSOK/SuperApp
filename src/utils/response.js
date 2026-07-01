// src/utils/response.js
// Standardized JSON response helpers to keep controllers consistent.

/**
 * Send a success response.
 * @param {import('express').Response} res
 * @param {object} data  - Payload to include
 * @param {string} message
 * @param {number} status - HTTP status code (default 200)
 */
export function success(res, data = {}, message = 'Success', status = 200) {
  return res.status(status).json({
    success: true,
    message,
    ...data,
  });
}

/**
 * Send an error response.
 * @param {import('express').Response} res
 * @param {string} error   - Short error key (machine-readable)
 * @param {string} message - Human-readable error message
 * @param {number} status  - HTTP status code (default 400)
 */
export function failure(res, error, message, status = 400) {
  return res.status(status).json({
    success: false,
    error,
    message,
  });
}

/**
 * Send a 500 internal server error.
 */
export function serverError(res, err) {
  console.error('[INTERNAL ERROR]', err);
  return res.status(500).json({
    success: false,
    error: 'internal_server_error',
    message: 'An unexpected error occurred. Please try again later.',
  });
}
