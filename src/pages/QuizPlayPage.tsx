import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import type { QuizQuestion, QuizStartResponse } from '@/entities/Quiz';
import { getApiErrorMessage } from '@/features/auth/hooks';
import { useSubmitAnswer } from '@/features/quiz/hooks';
import { formatTime } from '@/shared/lib/format';
import { ErrorState } from '@/shared/ui/ErrorState';

type QuizPlayLocationState = {
  startPayload?: QuizStartResponse;
  selectedCategoryId?: string | null;
};

export function QuizPlayPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionId } = useParams<{ sessionId: string }>();

  const parsedSessionId = Number(sessionId);
  const state = (location.state as QuizPlayLocationState | null) ?? null;
  const startPayload = state?.startPayload;

  const submitAnswer = useSubmitAnswer(parsedSessionId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(startPayload?.duration ?? 0);
  const [latestScore, setLatestScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const endTimeRef = useRef(Date.now() + (startPayload?.duration ?? 0) * 1000);
  const questionStartedAtRef = useRef(Date.now());

  useEffect(() => {
    if (!startPayload) {
      return;
    }

    const timer = setInterval(() => {
      const seconds = Math.max(0, Math.floor((endTimeRef.current - Date.now()) / 1000));
      setRemainingSeconds(seconds);
      if (seconds <= 0) {
        clearInterval(timer);
        navigate(`/quiz/session/${parsedSessionId}/result`, { replace: true });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, parsedSessionId, startPayload]);

  const currentQuestion: QuizQuestion | undefined = useMemo(
    () => startPayload?.questions[currentIndex],
    [currentIndex, startPayload?.questions],
  );

  if (!startPayload || Number.isNaN(parsedSessionId)) {
    return (
      <ErrorState message="Quiz session payload is missing. Start a new quiz from setup page." />
    );
  }

  const onSubmitAnswer = async () => {
    if (!currentQuestion || selectedAnswerId === null) {
      return;
    }

    const timeSpentMs = Math.max(0, Date.now() - questionStartedAtRef.current);

    const response = await submitAnswer.mutateAsync({
      question_id: currentQuestion.id,
      answer_id: selectedAnswerId,
      time_spent_ms: Math.min(timeSpentMs, 300000),
    });

    setLatestScore(response.current_score);
    setCorrectAnswers(response.correct_answers);

    const nextIndex = currentIndex + 1;
    if (nextIndex >= startPayload.questions.length) {
      navigate(`/quiz/session/${parsedSessionId}/result`, { replace: true });
      return;
    }

    setCurrentIndex(nextIndex);
    setSelectedAnswerId(null);
    questionStartedAtRef.current = Date.now();
  };

  return (
    <section className="space-y-4 rounded-xl bg-white p-5 shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Quiz in progress</h1>
          <p className="text-sm text-slate-600">
            Question {currentIndex + 1} / {startPayload.questions.length}
          </p>
        </div>
        <div className="rounded bg-slate-900 px-3 py-2 text-sm font-semibold text-white">
          Time left: {formatTime(remainingSeconds)}
        </div>
      </header>

      <div className="rounded border border-slate-200 p-4">
        <h2 className="font-medium">{currentQuestion?.text}</h2>

        <div className="mt-3 grid gap-2">
          {currentQuestion?.answers.map((answer) => {
            const isActive = selectedAnswerId === answer.id;
            return (
              <button
                key={answer.id}
                type="button"
                onClick={() => setSelectedAnswerId(answer.id)}
                className={`rounded border px-3 py-2 text-left text-sm ${
                  isActive ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white'
                }`}
              >
                {answer.position}. {answer.text}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-slate-600">
          Current score: <span className="font-semibold text-slate-900">{latestScore}</span> • Correct:{' '}
          <span className="font-semibold text-slate-900">{correctAnswers}</span>
        </div>

        <button
          type="button"
          onClick={onSubmitAnswer}
          disabled={selectedAnswerId === null || submitAnswer.isPending}
          className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {submitAnswer.isPending ? 'Submitting...' : 'Submit & next'}
        </button>
      </div>

      {submitAnswer.isError ? (
        <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {getApiErrorMessage(submitAnswer.error, 'Unable to submit answer')}
        </div>
      ) : null}
    </section>
  );
}
