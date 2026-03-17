import type {
  LeaderboardPeriod,
  LeaderboardResponse,
  MyPositionResponse,
} from '@/entities/Leaderboard';
import { http } from '@/shared/api/http';

export async function getLeaderboard(period: LeaderboardPeriod, page = 1, limit = 20) {
  const { data } = await http.get<LeaderboardResponse>(`/api/leaderboard/${period}`, {
    params: { page, limit },
  });
  return data;
}

export async function getMyPosition(period: LeaderboardPeriod) {
  const { data } = await http.get<MyPositionResponse>(`/api/leaderboard/${period}/my-position`);
  return data;
}
