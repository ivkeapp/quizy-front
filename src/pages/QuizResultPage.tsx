import { Link, useParams } from 'react-router-dom';

import { useQuizResult } from '@/features/quiz/hooks';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';

export function QuizResultPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const parsedSessionId = Number(sessionId);

  const result = useQuizResult(parsedSessionId, Number.isFinite(parsedSessionId));

  if (result.isLoading) {
    return <LoadingState label="Loading result..." />;
  }

  if (result.isError || !result.data) {
    return <ErrorState message="Unable to load quiz result." />;
  }

  return (
    <section className="space-y-4 rounded-xl bg-white p-5 shadow-sm">
      <h1 className="text-xl font-semibold">Quiz Result</h1>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded border border-slate-200 p-3">
          <div className="text-xs text-slate-500">Status</div>
          <div className="font-semibold">{result.data.status}</div>
        </div>
        <div className="rounded border border-slate-200 p-3">
          <div className="text-xs text-slate-500">Total Score</div>
          <div className="font-semibold">{result.data.score}</div>
        </div>
        <div className="rounded border border-slate-200 p-3">
          <div className="text-xs text-slate-500">Correct Answers</div>
          <div className="font-semibold">
            {result.data.correct_answers} / {result.data.total_questions}
          </div>
        </div>
        <div className="rounded border border-slate-200 p-3">
          <div className="text-xs text-slate-500">Time Bonus</div>
          <div className="font-semibold">{result.data.time_bonus}</div>
        </div>
      </div>

      <div className="flex gap-2">
        <Link to="/" className="rounded bg-slate-900 px-4 py-2 text-sm text-white">
          Start new quiz
        </Link>
        <Link to="/leaderboard" className="rounded border border-slate-300 px-4 py-2 text-sm">
          Leaderboard
        </Link>
      </div>
    </section>
  );
}
