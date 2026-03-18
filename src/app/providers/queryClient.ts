import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        const maybeCode = (error as { code?: number })?.code;
        if (maybeCode === 401 || maybeCode === 403 || maybeCode === 404) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      staleTime: 30_000,
      gcTime: 5 * 60_000,
    },
    mutations: {
      retry: false,
    },
  },
});
