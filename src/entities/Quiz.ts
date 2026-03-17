export type QuizQuestionsCount = '10' | '20' | '30' | '50';

export type QuizAnswer = {
  id: number;
  text: string;
  position: number;
};

export type QuizQuestion = {
  id: number;
  text: string;
  category_id: number;
  answers: QuizAnswer[];
};

export type QuizStartResponse = {
  session_id: number;
  duration: number;
  questions: QuizQuestion[];
};

export type QuizStatus = 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED';

export type QuizStatusResponse = {
  session_id: number;
  status: QuizStatus;
  remaining_seconds: number;
  score: number;
  correct_answers: number;
};

export type SubmitAnswerPayload = {
  question_id: number;
  answer_id: number;
  time_spent_ms: number;
};

export type SubmitAnswerResponse = {
  accepted: boolean;
  is_correct: boolean;
  current_score: number;
  correct_answers: number;
};

export type QuizResultResponse = {
  session_id: number;
  status: QuizStatus;
  score: number;
  correct_answers: number;
  time_bonus: number;
  total_questions: number;
  duration_seconds: number;
};
