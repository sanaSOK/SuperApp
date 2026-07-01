// src/middleware/auth.middleware.js
// JWT verification middleware — protects private routes.

import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { failure } from '../utils/response.js';

/**
 * requireAuth — blocks unauthenticated requests.
 * Attaches the sanitized user object to req.user.
 */
export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return failure(res, 'unauthorized', 'Authentication token required.', 401);
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(payload.sub);

    if (!user) {
      return failure(res, 'user_not_found', 'User account no longer exists.', 401);
    }

    req.user = user; // toJSON() will strip the password automatically
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return failure(res, 'token_expired', 'Session expired. Please log in again.', 401);
    }
    return failure(res, 'invalid_token', 'Invalid authentication token.', 401);
  }
}

/**
 * requireAdmin — checks that the user has the admin role.
 */
export async function requireAdmin(req, res, next) {
  await requireAuth(req, res, () => {
    if (req.user?.role !== 'admin') {
      return failure(res, 'forbidden', 'Admin access required.', 403);
    }
    next();
  });
}

/**
 * Generate a signed JWT for a user ID.
 */
export function signToken(userId) {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}
