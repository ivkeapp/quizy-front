import { http } from '@/shared/api/http';

import type {
  AdminQuestionArchiveResponse,
  AdminQuestionPayload,
  AdminQuestionsResponse,
  AdminQuestionUpdatePayload,
  AdminQuestionUpdateResponse,
} from './types';

export async function getAdminQuestions() {
  const { data } = await http.get<AdminQuestionsResponse>('/api/admin/questions');
  return data;
}

export async function createAdminQuestion(payload: AdminQuestionPayload) {
  const { data } = await http.post('/api/admin/questions', payload);
  return data;
}

export async function updateAdminQuestion(id: number, payload: AdminQuestionUpdatePayload) {
  const { data } = await http.put<AdminQuestionUpdateResponse>(`/api/admin/questions/${id}`, payload);
  return data;
}

export async function archiveAdminQuestion(id: number) {
  const { data } = await http.delete<AdminQuestionArchiveResponse>(`/api/admin/questions/${id}`);
  return data;
}
