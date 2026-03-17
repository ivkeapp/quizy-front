export type LeaderboardPeriod = '7d' | '30d' | '3m' | '6m' | '12m';

export type LeaderboardUser = {
  rank: number;
  userId: number;
  email: string;
  totalScore: number;
};

export type LeaderboardResponse = {
  period: LeaderboardPeriod;
  page: number;
  limit: number;
  users: LeaderboardUser[];
  source: 'cache' | 'database';
};

export type MyPositionResponse = {
  period: LeaderboardPeriod;
  user_id: number;
  rank: number;
  score: number;
};
