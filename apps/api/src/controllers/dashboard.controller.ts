import { Request, Response, NextFunction } from 'express';
import { dashboardService } from '../services/dashboard.service.js';

export class DashboardController {
  getDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await dashboardService.getDashboard(req.user!.id);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };
}

export const dashboardController = new DashboardController();
