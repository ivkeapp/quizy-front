import { useState } from 'react';

import type { LeaderboardPeriod } from '@/entities/Leaderboard';
import { useLeaderboard, useMyPosition } from '@/features/leaderboard/hooks';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';

const PERIODS: LeaderboardPeriod[] = ['7d', '30d', '3m', '6m', '12m'];

export function LeaderboardPage() {
  const [period, setPeriod] = useState<LeaderboardPeriod>('7d');

  const leaderboard = useLeaderboard(period, 1, 20);
  const myPosition = useMyPosition(period, true);

  return (
    <section className="space-y-4 rounded-xl bg-white p-5 shadow-sm">
      <header>
        <h1 className="text-xl font-semibold">Leaderboard</h1>
        <p className="text-sm text-slate-600">Authenticated view with public ranking + your position.</p>
      </header>

      <div className="flex flex-wrap gap-2">
        {PERIODS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setPeriod(item)}
            className={`rounded px-3 py-1.5 text-sm ${
              item === period ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {myPosition.isSuccess ? (
        <div className="rounded border border-slate-200 bg-slate-50 p-3 text-sm">
          My rank: <span className="font-semibold">#{myPosition.data.rank}</span> • Score:{' '}
          <span className="font-semibold">{myPosition.data.score}</span>
        </div>
      ) : null}

      {leaderboard.isLoading ? <LoadingState label="Loading leaderboard..." /> : null}
      {leaderboard.isError ? <ErrorState message="Unable to load leaderboard." /> : null}

      {leaderboard.data ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-600">
                <th className="py-2 pr-4">Rank</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.data.users.map((user) => (
                <tr key={`${user.userId}-${user.rank}`} className="border-b border-slate-100">
                  <td className="py-2 pr-4">#{user.rank}</td>
                  <td className="py-2 pr-4">{user.email}</td>
                  <td className="py-2 pr-4 font-semibold">{user.totalScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
