import { AuthProvider, Role } from '@prisma/client';
import type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  AuthUser,
  AuthResponse,
} from '@interviewgpt/shared';
import { prisma } from '../lib/prisma.js';
import { redis } from '../lib/redis.js';
import { env, isGoogleOAuthEnabled } from '../config/env.js';
import { hashPassword, comparePassword, hashToken, generateSecureToken, generateOAuthState } from '../utils/hash.js';
import { tokenService } from './token.service.js';
import { emailService } from './email.service.js';
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
  ValidationError,
} from '../errors/app.error.js';

const OAUTH_STATE_PREFIX = 'oauth:state:';
const OAUTH_STATE_TTL_SECONDS = 600;

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: AuthUser;
}

export class AuthService {
  async register(input: RegisterInput): Promise<AuthTokens> {
    const existing = await prisma.user.findUnique({ where: { email: input.email.toLowerCase() } });

    if (existing) {
      throw new ConflictError('Email is already registered');
    }

    const passwordHash = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        name: input.name.trim(),
        passwordHash,
        role: Role.STUDENT,
        authProvider: AuthProvider.EMAIL,
        emailVerified: false,
        profile: {
          create: {},
        },
      },
      include: { profile: true },
    });

    return this.issueTokens(user);
  }

  async login(input: LoginInput): Promise<AuthTokens> {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
      include: { profile: true },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Account is deactivated');
    }

    const valid = await comparePassword(input.password, user.passwordHash);

    if (!valid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    return this.issueTokens(user);
  }

  async logout(refreshToken: string | undefined): Promise<void> {
    if (refreshToken) {
      await tokenService.revokeRefreshToken(refreshToken);
    }
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const { userId, refreshToken: newRefreshToken } =
      await tokenService.rotateRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    const accessToken = tokenService.signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn: tokenService.getAccessExpiresInSeconds(),
      user: this.toAuthUser(user),
    };
  }

  async forgotPassword(input: ForgotPasswordInput): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (!user || !user.passwordHash) {
      return;
    }

    const rawToken = generateSecureToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(
      Date.now() + env.PASSWORD_RESET_EXPIRES_HOURS * 60 * 60 * 1000,
    );

    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${rawToken}`;
    await emailService.sendPasswordResetEmail(user.email, resetUrl);
  }

  async resetPassword(input: ResetPasswordInput): Promise<void> {
    const tokenHash = hashToken(input.token);

    const resetRecord = await prisma.passwordReset.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!resetRecord || resetRecord.usedAt || resetRecord.expiresAt < new Date()) {
      throw new ValidationError([{ field: 'token', message: 'Invalid or expired reset token' }]);
    }

    const passwordHash = await hashPassword(input.password);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetRecord.userId },
        data: { passwordHash },
      }),
      prisma.passwordReset.update({
        where: { id: resetRecord.id },
        data: { usedAt: new Date() },
      }),
      prisma.refreshToken.updateMany({
        where: { userId: resetRecord.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);
  }

  async getMe(userId: string): Promise<AuthUser> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return this.toAuthUser(user);
  }

  getGoogleAuthUrl(): { url: string; state: string } {
    if (!isGoogleOAuthEnabled) {
      throw new ValidationError([{ field: 'google', message: 'Google OAuth is not configured' }]);
    }

    const state = generateOAuthState();

    const params = new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID!,
      redirect_uri: env.GOOGLE_CALLBACK_URL,
      response_type: 'code',
      scope: 'openid email profile',
      state,
      access_type: 'online',
      prompt: 'select_account',
    });

    return {
      state,
      url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    };
  }

  async storeOAuthState(state: string): Promise<void> {
    await redis.setex(`${OAUTH_STATE_PREFIX}${state}`, OAUTH_STATE_TTL_SECONDS, '1');
  }

  async validateOAuthState(state: string): Promise<boolean> {
    const key = `${OAUTH_STATE_PREFIX}${state}`;
    const exists = await redis.get(key);

    if (!exists) return false;

    await redis.del(key);
    return true;
  }

  async handleGoogleCallback(code: string, state: string): Promise<AuthTokens> {
    if (!isGoogleOAuthEnabled) {
      throw new ValidationError([{ field: 'google', message: 'Google OAuth is not configured' }]);
    }

    const validState = await this.validateOAuthState(state);

    if (!validState) {
      throw new UnauthorizedError('Invalid OAuth state');
    }

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID!,
        client_secret: env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: env.GOOGLE_CALLBACK_URL,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      throw new UnauthorizedError('Failed to exchange Google authorization code');
    }

    const tokens = (await tokenResponse.json()) as { access_token: string };

    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!profileResponse.ok) {
      throw new UnauthorizedError('Failed to fetch Google profile');
    }

    const profile = (await profileResponse.json()) as {
      id: string;
      email: string;
      name: string;
      picture?: string;
    };

    if (!profile.email) {
      throw new UnauthorizedError('Google account has no email');
    }

    let user = await prisma.user.findFirst({
      where: {
        OR: [{ googleId: profile.id }, { email: profile.email.toLowerCase() }],
      },
      include: { profile: true },
    });

    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: profile.id,
          authProvider: AuthProvider.GOOGLE,
          emailVerified: true,
          avatarUrl: profile.picture ?? user.avatarUrl,
          name: user.name || profile.name,
        },
        include: { profile: true },
      });
    } else {
      user = await prisma.user.create({
        data: {
          email: profile.email.toLowerCase(),
          name: profile.name,
          googleId: profile.id,
          avatarUrl: profile.picture,
          authProvider: AuthProvider.GOOGLE,
          emailVerified: true,
          role: Role.STUDENT,
          profile: { create: {} },
        },
        include: { profile: true },
      });
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Account is deactivated');
    }

    return this.issueTokens(user);
  }

  private async issueTokens(
    user: {
      id: string;
      email: string;
      name: string;
      role: Role;
      avatarUrl: string | null;
      emailVerified: boolean;
      profile: {
        bio: string | null;
        college: string | null;
        graduationYear: number | null;
        targetRole: string | null;
        githubUsername: string | null;
        leetcodeUsername: string | null;
      } | null;
    },
  ): Promise<AuthTokens> {
    const accessToken = tokenService.signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = await tokenService.createRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      expiresIn: tokenService.getAccessExpiresInSeconds(),
      user: this.toAuthUser(user),
    };
  }

  private toAuthUser(user: {
    id: string;
    email: string;
    name: string;
    role: Role;
    avatarUrl: string | null;
    emailVerified: boolean;
    profile: {
      bio: string | null;
      college: string | null;
      graduationYear: number | null;
      targetRole: string | null;
      githubUsername: string | null;
      leetcodeUsername: string | null;
    } | null;
  }): AuthUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as AuthUser['role'],
      avatarUrl: user.avatarUrl,
      emailVerified: user.emailVerified,
      profile: user.profile
        ? {
            bio: user.profile.bio,
            college: user.profile.college,
            graduationYear: user.profile.graduationYear,
            targetRole: user.profile.targetRole,
            githubUsername: user.profile.githubUsername,
            leetcodeUsername: user.profile.leetcodeUsername,
          }
        : null,
    };
  }
}

export const authService = new AuthService();

// Re-export AuthResponse for controller typing
export type { AuthResponse };
