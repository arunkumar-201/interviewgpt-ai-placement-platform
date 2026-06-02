import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { env } from '../config/env.js';
import { getAccessTokenMaxAgeMs } from '../config/cookies.js';
import { hashToken, generateSecureToken } from '../utils/hash.js';
import { prisma } from '../lib/prisma.js';
import { UnauthorizedError } from '../errors/app.error.js';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export class TokenService {
  signAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: this.getAccessExpiresInSeconds(),
    });
  }

  verifyAccessToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
    } catch {
      throw new UnauthorizedError('Invalid or expired access token');
    }
  }

  async createRefreshToken(userId: string): Promise<string> {
    const rawToken = generateSecureToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + this.getRefreshExpiryMs());

    await prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });

    return rawToken;
  }

  async rotateRefreshToken(oldRawToken: string): Promise<{ userId: string; refreshToken: string }> {
    const tokenHash = hashToken(oldRawToken);

    const existing = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!existing || existing.revokedAt || existing.expiresAt < new Date()) {
      if (existing) {
        await this.revokeAllUserTokens(existing.userId);
      }
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    if (!existing.user.isActive) {
      throw new UnauthorizedError('Account is deactivated');
    }

    await prisma.refreshToken.update({
      where: { id: existing.id },
      data: { revokedAt: new Date() },
    });

    const newRefreshToken = await this.createRefreshToken(existing.userId);

    return { userId: existing.userId, refreshToken: newRefreshToken };
  }

  async revokeRefreshToken(rawToken: string): Promise<void> {
    const tokenHash = hashToken(rawToken);

    await prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  getAccessExpiresInSeconds(): number {
    return Math.floor(getAccessTokenMaxAgeMs() / 1000);
  }

  private getRefreshExpiryMs(): number {
    const match = env.JWT_REFRESH_EXPIRES_IN.match(/^(\d+)([smhd])$/);
    if (!match) return 7 * 24 * 60 * 60 * 1000;

    const value = parseInt(match[1], 10);
    const unit = match[2];

    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return value * (multipliers[unit] ?? multipliers.d);
  }
}

export const tokenService = new TokenService();
