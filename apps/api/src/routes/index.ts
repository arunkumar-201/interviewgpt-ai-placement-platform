import { Router } from 'express';
import { healthRouter, API_PREFIX } from './health.routes.js';

const router = Router();

router.use(healthRouter);

export function createApiRouter(): Router {
  const apiRouter = Router();
  apiRouter.use(router);
  return apiRouter;
}

export { API_PREFIX };
