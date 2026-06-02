import { Router } from 'express';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '@interviewgpt/shared';
import { authController } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

export const authRouter = Router();

authRouter.post('/logout', authController.logout);
authRouter.post('/refresh', authController.refresh);

authRouter.use(authRateLimiter);

authRouter.post('/register', validate(registerSchema), authController.register);
authRouter.post('/login', validate(loginSchema), authController.login);
authRouter.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
authRouter.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

authRouter.get('/me', authenticate, authController.me);

authRouter.get('/google', authController.googleAuth);
authRouter.get('/google/callback', authController.googleCallback);
