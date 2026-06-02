import { useQuery } from '@tanstack/react-query';
import { fetchDashboard } from '../api/dashboard.api';

export const DASHBOARD_QUERY_KEY = ['dashboard'] as const;

export function useDashboard() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: fetchDashboard,
    staleTime: 1000 * 60 * 2,
  });
}
