import { Request, Response, NextFunction } from 'express';
import { dsaService } from '../services/dsa.service.js';
import type { ListProblemsQuery, RunCodeInput, SubmitCodeInput } from '@interviewgpt/shared';

export class DsaController {
  listProblems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query as unknown as ListProblemsQuery;
      const data = await dsaService.listProblems(req.user!.id, query);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  getProblem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await dsaService.getProblemBySlug(req.params.slug, req.user!.id);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  runCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await dsaService.runCodeBySlug(req.user!.id, req.params.slug, req.body as RunCodeInput);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  submitCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await dsaService.submitCodeBySlug(
        req.user!.id,
        req.params.slug,
        req.body as SubmitCodeInput,
      );
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  runCodeByBody = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { slug, ...body } = req.body as RunCodeInput & { slug: string };
      const data = await dsaService.runCodeBySlug(req.user!.id, slug, body);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  submitCodeByBody = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { slug, ...body } = req.body as SubmitCodeInput & { slug: string };
      const data = await dsaService.submitCodeBySlug(req.user!.id, slug, body);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  getSubmissions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await dsaService.getSubmissionsBySlug(req.user!.id, req.params.slug);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };
}

export const dsaController = new DsaController();
