import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import { env, isGoogleOAuthEnabled } from '../config/env.js';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  OAUTH_STATE_COOKIE,
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
  oauthStateCookieOptions,
  clearAuthCookieOptions,
  clearRefreshCookieOptions,
  getAccessTokenMaxAgeMs,
  getRefreshTokenMaxAgeMs,
} from '../config/cookies.js';
import { getRefreshTokenFromRequest } from '../middleware/authenticate.js';

function setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
  res.cookie(ACCESS_TOKEN_COOKIE, accessToken, accessTokenCookieOptions(getAccessTokenMaxAgeMs()));
  res.cookie(
    REFRESH_TOKEN_COOKIE,
    refreshToken,
    refreshTokenCookieOptions(getRefreshTokenMaxAgeMs()),
  );
}

function clearAuthCookies(res: Response): void {
  res.cookie(ACCESS_TOKEN_COOKIE, '', clearAuthCookieOptions());
  res.cookie(REFRESH_TOKEN_COOKIE, '', clearRefreshCookieOptions());
}

function sendAuthResponse(res: Response, statusCode: number, tokens: Awaited<ReturnType<typeof authService.login>>): void {
  setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

  res.status(statusCode).json({
    success: true,
    data: {
      user: tokens.user,
      expiresIn: tokens.expiresIn,
    },
  });
}

export class AuthController {
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tokens = await authService.register(req.body);
      sendAuthResponse(res, 201, tokens);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tokens = await authService.login(req.body);
      sendAuthResponse(res, 200, tokens);
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshToken = getRefreshTokenFromRequest(req);
      await authService.logout(refreshToken);
      clearAuthCookies(res);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshToken = getRefreshTokenFromRequest(req);

      if (!refreshToken) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Refresh token required' },
        });
        return;
      }

      const tokens = await authService.refresh(refreshToken);
      sendAuthResponse(res, 200, tokens);
    } catch (error) {
      clearAuthCookies(res);
      next(error);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await authService.forgotPassword(req.body);
      res.json({
        success: true,
        data: {
          message: 'If an account exists with this email, a reset link has been sent.',
        },
      });
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await authService.resetPassword(req.body);
      res.json({
        success: true,
        data: { message: 'Password updated successfully' },
      });
    } catch (error) {
      next(error);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await authService.getMe(req.user!.id);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  googleAuth = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!isGoogleOAuthEnabled) {
        res.status(503).json({
          success: false,
          error: { code: 'SERVICE_UNAVAILABLE', message: 'Google OAuth is not configured' },
        });
        return;
      }

      const { url, state } = authService.getGoogleAuthUrl();
      await authService.storeOAuthState(state);

      res.cookie(OAUTH_STATE_COOKIE, state, oauthStateCookieOptions());
      res.redirect(url);
    } catch (error) {
      next(error);
    }
  };

  googleCallback = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { code, state, error } = req.query as {
        code?: string;
        state?: string;
        error?: string;
      };

      if (error || !code || !state) {
        res.redirect(`${env.FRONTEND_URL}/login?error=oauth_cancelled`);
        return;
      }

      const cookieState = req.cookies?.[OAUTH_STATE_COOKIE];

      if (!cookieState || cookieState !== state) {
        res.redirect(`${env.FRONTEND_URL}/login?error=oauth_state_invalid`);
        return;
      }

      res.clearCookie(OAUTH_STATE_COOKIE, { path: '/api/v1/auth' });

      const tokens = await authService.handleGoogleCallback(code, state);
      setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

      res.redirect(`${env.FRONTEND_URL}/auth/callback?success=true`);
    } catch (error) {
      console.error('[Google OAuth]', error);
      res.redirect(`${env.FRONTEND_URL}/login?error=oauth_failed`);
    }
  };
}

export const authController = new AuthController();
