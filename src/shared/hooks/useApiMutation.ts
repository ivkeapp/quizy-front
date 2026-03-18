import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from '@tanstack/react-query';

import type { ApiError } from '@/shared/api/types';

export function useApiMutation<TData, TVariables = void>(
  options: UseMutationOptions<TData, ApiError, TVariables>,
): UseMutationResult<TData, ApiError, TVariables> {
  return useMutation<TData, ApiError, TVariables>(options);
}
