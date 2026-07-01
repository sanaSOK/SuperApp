// src/routes/services.routes.js
import { Router } from 'express';
import { getAllServices, getServiceById } from '../controllers/services.controller.js';

const router = Router();

// GET /api/services?category=Health&q=search
router.get('/', getAllServices);

// GET /api/services/:id
router.get('/:id', getServiceById);

export default router;
