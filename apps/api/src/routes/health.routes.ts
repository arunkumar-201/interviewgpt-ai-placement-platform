import { Router, Request, Response } from 'express';
import { API_PREFIX } from '@interviewgpt/shared';
import { prisma } from '../lib/prisma.js';
import { pingRedis } from '../lib/redis.js';
import { executionService } from '../services/execution.service.js';

const healthRouter = Router();

healthRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'interviewgpt-api',
    },
  });
});

healthRouter.get('/ready', async (_req: Request, res: Response) => {
  let dbStatus = 'disconnected';
  let redisStatus = 'disconnected';

  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch {
    dbStatus = 'disconnected';
  }

  redisStatus = (await pingRedis()) ? 'connected' : 'disconnected';

  const judge0 = await executionService.pingJudge0();

  const isReady = dbStatus === 'connected' && redisStatus === 'connected';

  res.status(200).json({
    success: true,
    data: {
      status: isReady ? 'ready' : 'not_ready',
      db: dbStatus,
      redis: redisStatus,
      judge0: judge0.ok ? 'connected' : 'disconnected',
      judge0Mode: judge0.mode,
      judge0Detail: judge0.detail,
      timestamp: new Date().toISOString(),
    },
  });
});

export { healthRouter, API_PREFIX };
