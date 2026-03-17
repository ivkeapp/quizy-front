import { useMutation, useQuery } from '@tanstack/react-query';

import type { QuizQuestionsCount, SubmitAnswerPayload } from '@/entities/Quiz';

import * as quizApi from './api';

export function useStartQuiz() {
  return useMutation({
    mutationFn: (questionsCount: QuizQuestionsCount) => quizApi.startQuiz(questionsCount),
  });
}

export function useSubmitAnswer(sessionId: number) {
  return useMutation({
    mutationFn: (payload: SubmitAnswerPayload) => quizApi.submitAnswer(sessionId, payload),
  });
}

export function useQuizStatus(sessionId: number, enabled = true) {
  return useQuery({
    queryKey: ['quiz', 'status', sessionId],
    queryFn: () => quizApi.getQuizStatus(sessionId),
    enabled,
    refetchInterval: 5_000,
  });
}

export function useQuizResult(sessionId: number, enabled = true) {
  return useQuery({
    queryKey: ['quiz', 'result', sessionId],
    queryFn: () => quizApi.getQuizResult(sessionId),
    enabled,
  });
}
