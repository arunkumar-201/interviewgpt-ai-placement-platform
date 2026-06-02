import { Router } from 'express';
import { healthRouter, API_PREFIX } from './health.routes.js';
import { authRouter } from './auth.routes.js';
import { adminRouter } from './admin.routes.js';
import { generalRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.use(healthRouter);
router.use(generalRateLimiter);
router.use('/auth', authRouter);
router.use('/admin', adminRouter);

export function createApiRouter(): Router {
  const apiRouter = Router();
  apiRouter.use(router);
  return apiRouter;
}

export { API_PREFIX };
