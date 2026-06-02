import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  API_URL: z.string().url().default('http://localhost:4000'),

  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  COOKIE_SECURE: z
    .string()
    .optional()
    .transform((v) => v === 'true'),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z
    .string()
    .url()
    .default('http://localhost:4000/api/v1/auth/google/callback'),

  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),
  ADMIN_NAME: z.string().optional(),

  PASSWORD_RESET_EXPIRES_HOURS: z.coerce.number().default(1),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('Invalid environment variables:', result.error.flatten().fieldErrors);
    throw new Error('Environment validation failed');
  }

  return result.data;
}

export const env = loadEnv();

export const isGoogleOAuthEnabled = Boolean(
  env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET,
);

export const cookieSecure =
  env.COOKIE_SECURE ?? env.NODE_ENV === 'production';
