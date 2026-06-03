import { redis } from './redis.js';

const DASHBOARD_PREFIX = 'dashboard:';

export async function invalidateDashboardCache(userId: string): Promise<void> {
  await redis.del(`${DASHBOARD_PREFIX}${userId}`);
}

export async function invalidateProblemListCache(): Promise<void> {
  const keys = await redis.keys('dsa:problems:*');
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}
