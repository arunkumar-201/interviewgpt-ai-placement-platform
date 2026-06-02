import rateLimit from 'express-rate-limit';
import { TooManyRequestsError } from '../errors/app.error.js';

export const generalRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { code: 'TOO_MANY_REQUESTS', message: 'Too many requests' } },
  handler: (_req, _res, next) => {
    next(new TooManyRequestsError());
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  message: { success: false, error: { code: 'TOO_MANY_REQUESTS', message: 'Too many auth attempts' } },
  handler: (_req, _res, next) => {
    next(new TooManyRequestsError('Too many authentication attempts. Try again later.'));
  },
});
