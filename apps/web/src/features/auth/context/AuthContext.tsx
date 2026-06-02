import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import type { AuthUser, LoginInput, RegisterInput } from '@interviewgpt/shared';
import * as authApi from '../api/auth.api';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.getMe,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'me'], data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'me'], data.user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(['auth', 'me'], null);
      queryClient.clear();
    },
  });

  const login = useCallback(
    async (data: LoginInput) => {
      await loginMutation.mutateAsync(data);
    },
    [loginMutation],
  );

  const register = useCallback(
    async (data: RegisterInput) => {
      await registerMutation.mutateAsync(data);
    },
    [registerMutation],
  );

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  const refetchUser = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: user ?? null,
      isLoading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'ADMIN',
      login,
      register,
      logout,
      refetchUser,
    }),
    [user, isLoading, login, register, logout, refetchUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
