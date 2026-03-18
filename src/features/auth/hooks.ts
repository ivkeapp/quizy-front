import { useEffect } from 'react';

import { queryKeys } from '@/shared/config/queryKeys';
import { useApiMutation } from '@/shared/hooks/useApiMutation';
import { useApiQuery } from '@/shared/hooks/useApiQuery';
import { authEvents } from '@/shared/lib/authEvents';
import type { ApiError } from '@/shared/api/types';
import { session } from '@/shared/lib/session';

import * as authApi from './api';
import { useAuthStore } from './store';

export function useLogin() {
  const setAuthResolved = useAuthStore((state) => state.setAuthResolved);
  const setUser = useAuthStore((state) => state.setUser);

  return useApiMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      session.setAccessToken(response.accessToken);
      session.setRefreshToken(response.refreshToken);
      setUser(response.user);
      setAuthResolved(true);
    },
  });
}

export function useRegister() {
  const setAuthResolved = useAuthStore((state) => state.setAuthResolved);
  const setUser = useAuthStore((state) => state.setUser);

  return useApiMutation({
    mutationFn: authApi.register,
    onSuccess: (response) => {
      session.setAccessToken(response.accessToken);
      session.setRefreshToken(response.refreshToken);
      setUser(response.user);
      setAuthResolved(true);
    },
  });
}

export function useMe(enabled = true) {
  return useApiQuery({
    queryKey: queryKeys.auth.me,
    queryFn: authApi.me,
    enabled,
    retry: false,
    staleTime: 5 * 60_000,
  });
}

export function useAuthBootstrap() {
  const setAuthResolved = useAuthStore((state) => state.setAuthResolved);
  const setUser = useAuthStore((state) => state.setUser);
  const token = session.getAccessToken();
  const refreshToken = session.getRefreshToken();
  const meQuery = useMe(Boolean(token));
  const refreshMutation = useApiMutation({
    mutationFn: authApi.refresh,
    onSuccess: (response) => {
      session.setAccessToken(response.accessToken);
      session.setRefreshToken(response.refreshToken);
      setUser(response.user);
      setAuthResolved(true);
    },
    onError: () => {
      setUser(null);
      session.clear();
      setAuthResolved(true);
    },
  });

  useEffect(() => {
    if (token) {
      return;
    }

    if (!refreshToken) {
      setAuthResolved(true);
      return;
    }

    if (!refreshMutation.isPending && !refreshMutation.isSuccess) {
      refreshMutation.mutate();
    }
  }, [refreshMutation, refreshToken, setAuthResolved, token]);

  useEffect(() => {
    if (meQuery.data) {
      setUser(meQuery.data);
      setAuthResolved(true);
    }
  }, [meQuery.data, setAuthResolved, setUser]);

  useEffect(() => {
    if (meQuery.error) {
      setUser(null);
      session.clear();
      setAuthResolved(true);
    }
  }, [meQuery.error, setAuthResolved, setUser]);

  useEffect(() => {
    return authEvents.subscribe('unauthorized', () => {
      setUser(null);
      session.clear();
      setAuthResolved(true);
    });
  }, [setAuthResolved, setUser]);
}

export function useLogout() {
  const setAuthResolved = useAuthStore((state) => state.setAuthResolved);
  const setUser = useAuthStore((state) => state.setUser);

  return () => {
    session.clear();
    setUser(null);
    setAuthResolved(true);
  };
}

export function useAuthStatus() {
  const isAuthResolved = useAuthStore((state) => state.isAuthResolved);
  const user = useAuthStore((state) => state.user);
  const token = session.getAccessToken();

  return {
    isAuthResolved,
    isAuthenticated: Boolean(token),
    isAdmin: user?.role === 'admin',
    user,
  };
}

export function getApiErrorMessage(error: unknown, fallback = 'Request failed') {
  const apiError = error as ApiError | undefined;
  return apiError?.message ?? fallback;
}
