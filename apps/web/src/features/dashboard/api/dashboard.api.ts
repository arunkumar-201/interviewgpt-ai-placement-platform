import type { DashboardData } from '@interviewgpt/shared';
import { apiClient } from '@/lib/api-client';

export function fetchDashboard() {
  return apiClient<DashboardData>('/dashboard');
}
