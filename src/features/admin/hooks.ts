import { useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/shared/config/queryKeys';
import { useApiMutation } from '@/shared/hooks/useApiMutation';
import { useApiQuery } from '@/shared/hooks/useApiQuery';

import * as adminApi from './api';
import type { AdminQuestionPayload, AdminQuestionUpdatePayload } from './types';

export function useAdminQuestions() {
  return useApiQuery({
    queryKey: queryKeys.admin.questions,
    queryFn: adminApi.getAdminQuestions,
    staleTime: 30_000,
  });
}

export function useCreateAdminQuestion() {
  const queryClient = useQueryClient();

  return useApiMutation({
    mutationFn: (payload: AdminQuestionPayload) => adminApi.createAdminQuestion(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.questions });
    },
  });
}

export function useUpdateAdminQuestion() {
  const queryClient = useQueryClient();

  return useApiMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AdminQuestionUpdatePayload }) =>
      adminApi.updateAdminQuestion(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.questions });
    },
  });
}

export function useArchiveAdminQuestion() {
  const queryClient = useQueryClient();

  return useApiMutation({
    mutationFn: (id: number) => adminApi.archiveAdminQuestion(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.questions });
    },
  });
}
