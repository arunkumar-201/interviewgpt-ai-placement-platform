import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { createApiRouter, API_PREFIX } from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.get('/', (_req, res) => {
    res.json({
      success: true,
      data: {
        name: 'InterviewGPT API',
        version: '1.0.0',
        docs: `${API_PREFIX}/health`,
      },
    });
  });

  app.use(API_PREFIX, createApiRouter());

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
