import type { LeaderboardPeriod } from '@/entities/Leaderboard';
import { queryKeys } from '@/shared/config/queryKeys';
import { useApiQuery } from '@/shared/hooks/useApiQuery';

import * as leaderboardApi from './api';

export function useLeaderboard(period: LeaderboardPeriod, page = 1, limit = 20) {
  return useApiQuery({
    queryKey: queryKeys.leaderboard.list(period, page, limit),
    queryFn: () => leaderboardApi.getLeaderboard(period, page, limit),
    staleTime: 60_000,
  });
}

export function useMyPosition(period: LeaderboardPeriod, enabled = true) {
  return useApiQuery({
    queryKey: queryKeys.leaderboard.myPosition(period),
    queryFn: () => leaderboardApi.getMyPosition(period),
    enabled,
    staleTime: 60_000,
  });
}
