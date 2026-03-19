import type { QuizStartPayload, SubmitAnswerPayload } from '@/entities/Quiz';
import { queryKeys } from '@/shared/config/queryKeys';
import { useApiMutation } from '@/shared/hooks/useApiMutation';
import { useApiQuery } from '@/shared/hooks/useApiQuery';

import * as quizApi from './api';

export function useStartQuiz() {
  return useApiMutation({
    mutationFn: (payload: QuizStartPayload) => quizApi.startQuiz(payload),
  });
}

export function useSubmitAnswer(sessionId: number) {
  return useApiMutation({
    mutationFn: (payload: SubmitAnswerPayload) => quizApi.submitAnswer(sessionId, payload),
  });
}

export function useQuizStatus(sessionId: number, enabled = true) {
  return useApiQuery({
    queryKey: queryKeys.quiz.status(sessionId),
    queryFn: () => quizApi.getQuizStatus(sessionId),
    enabled,
    refetchInterval: 5_000,
    staleTime: 3_000,
  });
}

export function useQuizResult(sessionId: number, enabled = true) {
  return useApiQuery({
    queryKey: queryKeys.quiz.result(sessionId),
    queryFn: () => quizApi.getQuizResult(sessionId),
    enabled,
    staleTime: 60_000,
  });
}
