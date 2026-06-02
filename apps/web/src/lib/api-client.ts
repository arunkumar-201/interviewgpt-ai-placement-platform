const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api/v1';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export async function apiClient<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const body = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !body.success) {
    throw new Error(body.error?.message ?? 'Request failed');
  }

  return body.data as T;
}

export interface HealthData {
  status: string;
  timestamp: string;
  service: string;
}

export interface ReadyData {
  status: string;
  db: string;
  redis: string;
  timestamp: string;
}

export function fetchHealth() {
  return apiClient<HealthData>('/health');
}

export function fetchReady() {
  return apiClient<ReadyData>('/ready');
}

export { API_URL };
