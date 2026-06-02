import type { CookieOptions } from 'express';
import { env, cookieSecure } from './env.js';

export const ACCESS_TOKEN_COOKIE = 'ig_access_token';
export const REFRESH_TOKEN_COOKIE = 'ig_refresh_token';
export const OAUTH_STATE_COOKIE = 'ig_oauth_state';

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: cookieSecure,
  sameSite: 'lax',
  path: '/',
};

export function accessTokenCookieOptions(maxAgeMs: number): CookieOptions {
  return {
    ...baseCookieOptions,
    maxAge: maxAgeMs,
  };
}

export function refreshTokenCookieOptions(maxAgeMs: number): CookieOptions {
  return {
    ...baseCookieOptions,
    maxAge: maxAgeMs,
    path: '/api/v1/auth',
  };
}

export function oauthStateCookieOptions(): CookieOptions {
  return {
    ...baseCookieOptions,
    maxAge: 10 * 60 * 1000,
    path: '/api/v1/auth',
  };
}

export function clearAuthCookieOptions(): CookieOptions {
  return {
    ...baseCookieOptions,
    maxAge: 0,
  };
}

export function clearRefreshCookieOptions(): CookieOptions {
  return {
    ...baseCookieOptions,
    maxAge: 0,
    path: '/api/v1/auth',
  };
}

export function getAccessTokenMaxAgeMs(): number {
  return parseDurationToMs(env.JWT_ACCESS_EXPIRES_IN);
}

export function getRefreshTokenMaxAgeMs(): number {
  return parseDurationToMs(env.JWT_REFRESH_EXPIRES_IN);
}

function parseDurationToMs(duration: string): number {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) return 15 * 60 * 1000;

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    default:
      return 15 * 60 * 1000;
  }
}
