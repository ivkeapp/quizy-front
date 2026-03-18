import { useQuery, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query';

import type { ApiError } from '@/shared/api/types';

export function useApiQuery<TQueryFnData, TData = TQueryFnData>(
  options: UseQueryOptions<TQueryFnData, ApiError, TData>,
): UseQueryResult<TData, ApiError> {
  return useQuery<TQueryFnData, ApiError, TData>(options);
}
