import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import type { QuizQuestion, QuizStartResponse } from '@/entities/Quiz';
import { getApiErrorMessage } from '@/features/auth/hooks';
import { QuizProgress } from '@/features/quiz/components/QuizProgress';
import { QuizTimer } from '@/features/quiz/components/QuizTimer';
import { useQuizStatus, useSubmitAnswer } from '@/features/quiz/hooks';
import {
  getPersistedQuizSession,
  savePersistedQuizSession,
} from '@/features/quiz/storage';
import { useQuizLeaveGuard } from '@/features/quiz/useQuizLeaveGuard';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
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
  const persistedSession = useMemo(
    () => (Number.isFinite(parsedSessionId) ? getPersistedQuizSession(parsedSessionId) : null),
    [parsedSessionId],
  );
  const startPayload = state?.startPayload ?? persistedSession?.startPayload;

  const submitAnswer = useSubmitAnswer(parsedSessionId);
  const quizStatus = useQuizStatus(parsedSessionId, Number.isFinite(parsedSessionId) && Boolean(startPayload));

  const [currentIndex, setCurrentIndex] = useState(persistedSession?.currentIndex ?? 0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(() => {
    if (persistedSession) {
      return Math.max(0, Math.floor((persistedSession.endsAt - Date.now()) / 1000));
    }

    return startPayload?.duration ?? 0;
  });
  const [latestScore, setLatestScore] = useState(persistedSession?.latestScore ?? 0);
  const [correctAnswers, setCorrectAnswers] = useState(persistedSession?.correctAnswers ?? 0);

  const endTimeRef = useRef(
    persistedSession?.endsAt ?? Date.now() + (startPayload?.duration ?? 0) * 1000,
  );
  const questionStartedAtRef = useRef(persistedSession?.questionStartedAt ?? Date.now());

  useQuizLeaveGuard(Boolean(startPayload) && remainingSeconds > 0);

  const persistSnapshot = useCallback(() => {
    if (!startPayload || Number.isNaN(parsedSessionId)) {
      return;
    }

    savePersistedQuizSession({
      sessionId: parsedSessionId,
      startPayload,
      currentIndex,
      latestScore,
      correctAnswers,
      endsAt: endTimeRef.current,
      questionStartedAt: questionStartedAtRef.current,
    });
  }, [correctAnswers, currentIndex, latestScore, parsedSessionId, startPayload]);

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

  useEffect(() => {
    if (!quizStatus.data) {
      return;
    }

    if (quizStatus.data.status === 'COMPLETED' || quizStatus.data.status === 'EXPIRED') {
      navigate(`/quiz/session/${parsedSessionId}/result`, { replace: true });
      return;
    }

    setLatestScore(quizStatus.data.score);
    setCorrectAnswers(quizStatus.data.correct_answers);
    setRemainingSeconds(quizStatus.data.remaining_seconds);
    endTimeRef.current = Date.now() + quizStatus.data.remaining_seconds * 1000;
  }, [navigate, parsedSessionId, quizStatus.data]);

  useEffect(() => {
    persistSnapshot();
  }, [persistSnapshot]);

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
    <Card className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Quiz in progress</h1>
          <p className="text-sm text-slate-600">Session #{parsedSessionId}</p>
        </div>
        <QuizTimer remainingSeconds={remainingSeconds} />
      </header>

      <QuizProgress currentIndex={currentIndex} totalQuestions={startPayload.questions.length} />

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
                data-testid={`answer-option-${answer.id}`}
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

        <Button
          type="button"
          onClick={onSubmitAnswer}
          disabled={selectedAnswerId === null || submitAnswer.isPending}
        >
          {submitAnswer.isPending ? 'Submitting...' : 'Submit & next'}
        </Button>
      </div>

      {submitAnswer.isError ? (
        <ErrorState message={getApiErrorMessage(submitAnswer.error, 'Unable to submit answer')} />
      ) : null}
    </Card>
  );
}
