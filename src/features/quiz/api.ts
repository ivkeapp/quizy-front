import type {
  QuizResultResponse,
  QuizStartPayload,
  QuizStartResponse,
  QuizStatusResponse,
  SubmitAnswerPayload,
  SubmitAnswerResponse,
} from '@/entities/Quiz';
import { http } from '@/shared/api/http';

export async function startQuiz(payload: QuizStartPayload): Promise<QuizStartResponse> {
  const { data } = await http.post<QuizStartResponse>('/api/quiz/start', payload);
  return data;
}

export async function getQuizStatus(sessionId: number): Promise<QuizStatusResponse> {
  const { data } = await http.get<QuizStatusResponse>(`/api/quiz/${sessionId}/status`);
  return data;
}

export async function submitAnswer(
  sessionId: number,
  payload: SubmitAnswerPayload,
): Promise<SubmitAnswerResponse> {
  const { data } = await http.post<SubmitAnswerResponse>(`/api/quiz/${sessionId}/answer`, payload);
  return data;
}

export async function getQuizResult(sessionId: number): Promise<QuizResultResponse> {
  const { data } = await http.get<QuizResultResponse>(`/api/quiz/${sessionId}/result`);
  return data;
}
