// src/routes/announcements.routes.js
import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.middleware.js';
import { requireAdmin } from '../middleware/auth.middleware.js';
import {
  getAllAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  deleteAnnouncement,
} from '../controllers/announcements.controller.js';

const router = Router();

// GET /api/announcements?category=Finance
router.get('/', getAllAnnouncements);

// GET /api/announcements/:id
router.get('/:id', getAnnouncementById);

// POST /api/announcements  (admin only)
router.post('/',
  requireAdmin,
  body('title').notEmpty().withMessage('Title is required.'),
  body('summary').notEmpty().withMessage('Summary is required.'),
  body('category').notEmpty().withMessage('Category is required.'),
  validate,
  createAnnouncement
);

// DELETE /api/announcements/:id  (admin only)
router.delete('/:id', requireAdmin, deleteAnnouncement);

export default router;
