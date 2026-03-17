import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { QuizQuestionsCount } from '@/entities/Quiz';
import { useCategories } from '@/features/categories/hooks';
import { getApiErrorMessage } from '@/features/auth/hooks';
import { useStartQuiz } from '@/features/quiz/hooks';
import { LoadingState } from '@/shared/ui/LoadingState';

const QUIZ_OPTIONS: QuizQuestionsCount[] = ['10', '20', '30', '50'];

export function QuizSetupPage() {
  const navigate = useNavigate();

  const [questionsCount, setQuestionsCount] = useState<QuizQuestionsCount>('10');
  const [categoryId, setCategoryId] = useState<string>('');

  const categories = useCategories();
  const startQuiz = useStartQuiz();

  const onStartQuiz = async () => {
    const session = await startQuiz.mutateAsync(questionsCount);
    navigate(`/quiz/session/${session.session_id}`, {
      state: {
        startPayload: session,
        selectedCategoryId: categoryId || null,
      },
    });
  };

  return (
    <section className="space-y-4 rounded-xl bg-white p-5 shadow-sm">
      <header>
        <h1 className="text-xl font-semibold">Start Quiz Session</h1>
        <p className="text-sm text-slate-600">Select question count and start a timed session.</p>
      </header>

      <div>
        <label className="mb-2 block text-sm font-medium">Questions count</label>
        <div className="flex flex-wrap gap-2">
          {QUIZ_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setQuestionsCount(option)}
              className={`rounded px-3 py-2 text-sm ${
                questionsCount === option ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Category (optional display only)</label>
        {categories.isLoading ? <LoadingState label="Loading categories..." /> : null}
        {!categories.isLoading ? (
          <select
            className="w-full rounded border border-slate-300 px-3 py-2"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
          >
            <option value="">All categories</option>
            {categories.data?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        ) : null}
        <p className="mt-1 text-xs text-slate-500">
          `POST /api/quiz/start` currently accepts only `questions_count`, so category selection is not sent.
        </p>
      </div>

      {startQuiz.isError ? (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {getApiErrorMessage(startQuiz.error, 'Unable to start quiz')}
        </div>
      ) : null}

      <button
        type="button"
        onClick={onStartQuiz}
        disabled={startQuiz.isPending}
        className="rounded bg-slate-900 px-4 py-2 font-medium text-white disabled:opacity-60"
      >
        {startQuiz.isPending ? 'Starting...' : 'Start quiz'}
      </button>
    </section>
  );
}
