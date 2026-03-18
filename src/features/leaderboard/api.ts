import type {
  LeaderboardPeriod,
  LeaderboardResponse,
  LeaderboardUser,
  MyPositionResponse,
} from '@/entities/Leaderboard';
import { http } from '@/shared/api/http';

type LeaderboardApiUser = {
  rank: number;
  user_id?: number;
  userId?: number;
  name?: string;
  email?: string;
  score?: number;
  totalScore?: number;
};

type LeaderboardApiResponse = Omit<LeaderboardResponse, 'users'> & {
  users: LeaderboardApiUser[];
};

export async function getLeaderboard(period: LeaderboardPeriod, page = 1, limit = 20) {
  const { data } = await http.get<LeaderboardApiResponse>(`/api/leaderboard/${period}`, {
    params: { page, limit },
  });

  const users: LeaderboardUser[] = data.users.map((user) => ({
    rank: user.rank,
    userId: user.user_id ?? user.userId ?? 0,
    name: user.name ?? user.email ?? 'Unknown user',
    score: user.score ?? user.totalScore ?? 0,
  }));

  return {
    ...data,
    users,
  } satisfies LeaderboardResponse;
}

export async function getMyPosition(period: LeaderboardPeriod) {
  const { data } = await http.get<MyPositionResponse>(`/api/leaderboard/${period}/my-position`);
  return data;
}
