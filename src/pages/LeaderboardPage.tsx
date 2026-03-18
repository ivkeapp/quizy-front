import { useState } from 'react';

import type { LeaderboardPeriod } from '@/entities/Leaderboard';
import { useLeaderboard, useMyPosition } from '@/features/leaderboard/hooks';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';

const PERIODS: LeaderboardPeriod[] = ['7d', '30d', '3m', '6m', '12m'];

export function LeaderboardPage() {
  const [period, setPeriod] = useState<LeaderboardPeriod>('7d');
  const [page, setPage] = useState(1);
  const limit = 20;

  const leaderboard = useLeaderboard(period, page, limit);
  const myPosition = useMyPosition(period, true);

  return (
    <Card className="space-y-4">
      <header>
        <h1 className="text-xl font-semibold">Leaderboard</h1>
        <p className="text-sm text-slate-600">Authenticated view with public ranking + your position.</p>
      </header>

      <div className="flex flex-wrap gap-2">
        {PERIODS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setPeriod(item);
              setPage(1);
            }}
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
                <th className="py-2 pr-4">Pozicija</th>
                <th className="py-2 pr-4">Ime</th>
                <th className="py-2 pr-4">Poeni</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.data.users.map((user) => (
                <tr
                  key={`${user.userId}-${user.rank}`}
                  className={`border-b border-slate-100 ${
                    myPosition.data?.user_id === user.userId ? 'bg-amber-50' : ''
                  }`}
                >
                  <td className="py-2 pr-4">#{user.rank}</td>
                  <td className="py-2 pr-4">{user.name}</td>
                  <td className="py-2 pr-4 font-semibold">{user.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <div className="flex items-center justify-end gap-2">
        <Button variant="secondary" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>
          Previous
        </Button>
        <span className="text-sm text-slate-600">Page {page}</span>
        <Button
          variant="secondary"
          disabled={!leaderboard.data || leaderboard.data.users.length < limit}
          onClick={() => setPage((current) => current + 1)}
        >
          Next
        </Button>
      </div>
    </Card>
  );
}
