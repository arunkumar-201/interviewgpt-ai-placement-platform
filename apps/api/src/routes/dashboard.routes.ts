import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { dashboardController } from '../controllers/dashboard.controller.js';

export const dashboardRouter = Router();

dashboardRouter.get('/', authenticate, dashboardController.getDashboard);
