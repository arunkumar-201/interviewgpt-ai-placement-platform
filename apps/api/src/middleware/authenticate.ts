import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { tokenService } from '../services/token.service.js';
import { UnauthorizedError } from '../errors/app.error.js';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from '../config/cookies.js';

function extractAccessToken(req: Request): string | undefined {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  return req.cookies?.[ACCESS_TOKEN_COOKIE];
}

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = extractAccessToken(req);

    if (!token) {
      throw new UnauthorizedError('Authentication required');
    }

    const payload = tokenService.verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        emailVerified: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedError('Account not found or deactivated');
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
      emailVerified: user.emailVerified,
    };

    next();
  } catch (error) {
    next(error);
  }
}

export async function optionalAuthenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const token = extractAccessToken(req);

  if (!token) {
    next();
    return;
  }

  try {
    const payload = tokenService.verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        emailVerified: true,
        isActive: true,
      },
    });

    if (user?.isActive) {
      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
        emailVerified: user.emailVerified,
      };
    }
  } catch {
    // Ignore invalid tokens for optional auth
  }

  next();
}

export function getRefreshTokenFromRequest(req: Request): string | undefined {
  return req.cookies?.[REFRESH_TOKEN_COOKIE] ?? req.body?.refreshToken;
}
