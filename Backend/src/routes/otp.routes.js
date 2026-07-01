// src/routes/otp.routes.js
import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.middleware.js';
import { sendOtp, verifyOtp } from '../controllers/otp.controller.js';

const router = Router();

// POST /api/otp/send
router.post('/send',
  body('identifier').notEmpty().withMessage('Identifier is required.'),
  body('type').isIn(['email', 'phone']).withMessage('Type must be "email" or "phone".'),
  validate,
  sendOtp
);

// POST /api/otp/verify
router.post('/verify',
  body('identifier').notEmpty().withMessage('Identifier is required.'),
  body('code').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits.'),
  validate,
  verifyOtp
);

export default router;
