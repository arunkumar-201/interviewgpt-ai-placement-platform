const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api/v1';

export interface ApiErrorBody {
  code: string;
  message: string;
  details?: unknown;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiErrorBody;
}

export class ApiClientError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

export async function apiClient<T>(
  path: string,
  options?: RequestInit & { skipRefresh?: boolean },
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const body = (await response.json()) as ApiResponse<T>;

  if (response.status === 401 && !options?.skipRefresh && !path.includes('/auth/refresh')) {
    try {
      await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      return apiClient<T>(path, { ...options, skipRefresh: true });
    } catch {
      // fall through to error
    }
  }

  if (!response.ok || !body.success) {
    throw new ApiClientError(
      body.error?.message ?? 'Request failed',
      response.status,
      body.error?.code ?? 'UNKNOWN_ERROR',
      body.error?.details,
    );
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
