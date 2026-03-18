export type AdminQuestionAnswer = {
  id?: number;
  text: string;
  isCorrect: boolean;
  position: number;
};

export type AdminQuestion = {
  id: number;
  text: string;
  categoryId: number;
  active: boolean;
  usageCount: number;
  answers: AdminQuestionAnswer[];
};

export type AdminQuestionsResponse = {
  items: AdminQuestion[];
};

export type AdminQuestionPayload = {
  text: string;
  category_id: number;
  active?: boolean;
  answers: Array<{
    text: string;
    is_correct: boolean;
    position: number;
  }>;
};

export type AdminQuestionUpdatePayload = Partial<AdminQuestionPayload>;

export type AdminQuestionUpdateResponse = {
  updated: true;
  question: AdminQuestion;
};

export type AdminQuestionArchiveResponse = {
  archived: true;
  question: {
    id: number;
    active: boolean;
  };
};
