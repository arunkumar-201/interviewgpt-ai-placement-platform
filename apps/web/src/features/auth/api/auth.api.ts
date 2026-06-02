import type {
  AuthUser,
  AuthResponse,
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from '@interviewgpt/shared';
import { apiClient, API_URL } from '@/lib/api-client';

export function register(data: RegisterInput) {
  return apiClient<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function login(data: LoginInput) {
  return apiClient<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function logout() {
  return apiClient<void>('/auth/logout', { method: 'POST' });
}

export function getMe() {
  return apiClient<AuthUser>('/auth/me', { skipRefresh: true });
}

export function forgotPassword(data: ForgotPasswordInput) {
  return apiClient<{ message: string }>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function resetPassword(data: ResetPasswordInput) {
  return apiClient<{ message: string }>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getGoogleAuthUrl() {
  return `${API_URL}/auth/google`;
}
