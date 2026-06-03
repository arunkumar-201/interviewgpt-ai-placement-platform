import { Router } from 'express';
import {
  listProblemsQuerySchema,
  submitCodeSchema,
  runCodeSchema,
  runCodeWithSlugSchema,
  submitCodeWithSlugSchema,
} from '@interviewgpt/shared';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { dsaController } from '../controllers/dsa.controller.js';
import rateLimit from 'express-rate-limit';

const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 60,
  message: { success: false, error: { code: 'TOO_MANY_REQUESTS', message: 'Submission limit reached' } },
});

export const problemsRouter = Router();

problemsRouter.use(authenticate);

/** GET /api/v1/problems */
problemsRouter.get('/', validate(listProblemsQuerySchema, 'query'), dsaController.listProblems);

/** POST /api/v1/problems/run — slug in body */
problemsRouter.post('/run', submitLimiter, validate(runCodeWithSlugSchema), dsaController.runCodeByBody);

/** POST /api/v1/problems/submit — slug in body */
problemsRouter.post('/submit', submitLimiter, validate(submitCodeWithSlugSchema), dsaController.submitCodeByBody);

/** GET /api/v1/problems/:slug/submissions */
problemsRouter.get('/:slug/submissions', dsaController.getSubmissions);

/** POST /api/v1/problems/:slug/run */
problemsRouter.post('/:slug/run', submitLimiter, validate(runCodeSchema), dsaController.runCode);

/** POST /api/v1/problems/:slug/submit */
problemsRouter.post('/:slug/submit', submitLimiter, validate(submitCodeSchema), dsaController.submitCode);

/** GET /api/v1/problems/:slug */
problemsRouter.get('/:slug', dsaController.getProblem);

/** @deprecated Legacy prefix — maps /api/v1/dsa/problems/* → same handlers */
export const dsaRouter = Router();
dsaRouter.use('/problems', problemsRouter);
