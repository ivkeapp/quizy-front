import { queryKeys } from '@/shared/config/queryKeys';
import { useApiQuery } from '@/shared/hooks/useApiQuery';
import * as categoriesApi from './api';

export function useCategories() {
  return useApiQuery({
    queryKey: queryKeys.categories.all,
    queryFn: categoriesApi.getCategories,
    staleTime: 10 * 60_000,
  });
}
