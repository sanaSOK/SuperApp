// src/routes/user.routes.js
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { getProfile, getApplications, createApplication } from '../controllers/user.controller.js';

const router = Router();

// All user routes require authentication
router.use(requireAuth);

// GET /api/users/profile
router.get('/profile', getProfile);

// GET /api/users/applications
router.get('/applications', getApplications);

// POST /api/users/applications
router.post('/applications', createApplication);

export default router;
