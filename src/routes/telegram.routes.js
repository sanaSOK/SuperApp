// src/routes/telegram.routes.js
import { Router } from 'express';
import { getTelegramStatus } from '../controllers/telegram.controller.js';

const router = Router();

// GET /api/telegram/status/:phone
router.get('/status/:phone', getTelegramStatus);

export default router;
