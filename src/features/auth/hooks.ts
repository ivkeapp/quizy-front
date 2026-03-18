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
  const setUser = useAuthStore((state) => state.setUser);

  return useApiMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      session.setAccessToken(response.accessToken);
      session.setRefreshToken(response.refreshToken);
      setUser(response.user);
    },
  });
}

export function useRegister() {
  const setUser = useAuthStore((state) => state.setUser);

  return useApiMutation({
    mutationFn: authApi.register,
    onSuccess: (response) => {
      session.setAccessToken(response.accessToken);
      session.setRefreshToken(response.refreshToken);
      setUser(response.user);
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
  const setUser = useAuthStore((state) => state.setUser);
  const token = session.getAccessToken();
  const meQuery = useMe(Boolean(token));

  useEffect(() => {
    if (meQuery.data) {
      setUser(meQuery.data);
    }
  }, [meQuery.data, setUser]);

  useEffect(() => {
    if (meQuery.error) {
      setUser(null);
      session.clear();
    }
  }, [meQuery.error, setUser]);

  useEffect(() => {
    return authEvents.subscribe('unauthorized', () => {
      setUser(null);
      session.clear();
    });
  }, [setUser]);
}

export function useLogout() {
  const setUser = useAuthStore((state) => state.setUser);

  return () => {
    session.clear();
    setUser(null);
  };
}

export function useAuthStatus() {
  const user = useAuthStore((state) => state.user);
  const token = session.getAccessToken();

  return {
    isAuthenticated: Boolean(token),
    user,
  };
}

export function getApiErrorMessage(error: unknown, fallback = 'Request failed') {
  const apiError = error as ApiError | undefined;
  return apiError?.message ?? fallback;
}
