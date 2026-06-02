import { Router } from 'express';
import { Role } from '@prisma/client';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/requireRole.js';

export const adminRouter = Router();

adminRouter.get(
  '/ping',
  authenticate,
  requireRole(Role.ADMIN),
  (_req, res) => {
    res.json({
      success: true,
      data: { message: 'Admin access granted' },
    });
  },
);
