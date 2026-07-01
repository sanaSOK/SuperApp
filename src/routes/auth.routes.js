// src/routes/auth.routes.js
import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.middleware.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { register, login, me, forgotPassword, resetPassword } from '../controllers/auth.controller.js';

const router = Router();

// POST /api/auth/register
router.post('/register',
  body('identifier').notEmpty().withMessage('Email or phone number is required.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  validate,
  register
);

// POST /api/auth/login
router.post('/login',
  body('identifier').notEmpty().withMessage('Email or phone number is required.'),
  body('password').notEmpty().withMessage('Password is required.'),
  validate,
  login
);

// GET /api/auth/me  (protected)
router.get('/me', requireAuth, me);

// POST /api/auth/forgot-password
router.post('/forgot-password',
  body('identifier').notEmpty().withMessage('Email or phone number is required.'),
  validate,
  forgotPassword
);

// POST /api/auth/reset-password
router.post('/reset-password',
  body('identifier').notEmpty().withMessage('Identifier is required.'),
  body('code').isLength({ min: 6, max: 6 }).withMessage('OTP code must be 6 digits.'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters.'),
  validate,
  resetPassword
);

export default router;
