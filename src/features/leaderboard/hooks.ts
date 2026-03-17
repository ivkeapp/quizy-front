import { useQuery } from '@tanstack/react-query';

import type { LeaderboardPeriod } from '@/entities/Leaderboard';

import * as leaderboardApi from './api';

export function useLeaderboard(period: LeaderboardPeriod, page = 1, limit = 20) {
  return useQuery({
    queryKey: ['leaderboard', period, page, limit],
    queryFn: () => leaderboardApi.getLeaderboard(period, page, limit),
  });
}

export function useMyPosition(period: LeaderboardPeriod, enabled = true) {
  return useQuery({
    queryKey: ['leaderboard', 'my-position', period],
    queryFn: () => leaderboardApi.getMyPosition(period),
    enabled,
  });
}
