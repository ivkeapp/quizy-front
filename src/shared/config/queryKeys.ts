export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  categories: {
    all: ['categories'] as const,
  },
  quiz: {
    status: (sessionId: number) => ['quiz', 'status', sessionId] as const,
    result: (sessionId: number) => ['quiz', 'result', sessionId] as const,
  },
  leaderboard: {
    list: (period: string, page: number, limit: number) =>
      ['leaderboard', period, page, limit] as const,
    myPosition: (period: string) => ['leaderboard', 'my-position', period] as const,
  },
  admin: {
    questions: ['admin', 'questions'] as const,
  },
};
