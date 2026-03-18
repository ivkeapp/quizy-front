import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { safeStorage } from '@/shared/lib/safeStorage';

import * as authApi from './api';
import { useAuthStatus, useLogin } from './hooks';
import { useAuthStore } from './store';

describe('auth hooks', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null });
    safeStorage.clear();
  });

  it('stores user and token on login success', async () => {
    vi.spyOn(authApi, 'login').mockResolvedValueOnce({
      accessToken: 'token-123',
      refreshToken: 'refresh-123',
      user: { userId: 1, email: 'admin@quizy.local', role: 'admin' },
    });

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useLogin(), { wrapper });

    result.current.mutate({ email: 'admin@quizy.local', password: 'Admin123!' });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const authStatus = renderHook(() => useAuthStatus()).result.current;

    expect(authStatus.isAuthenticated).toBe(true);
    expect(authStatus.user?.email).toBe('admin@quizy.local');
  });
});
