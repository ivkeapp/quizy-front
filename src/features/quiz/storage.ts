import type { QuizStartResponse } from '@/entities/Quiz';
import { safeStorage } from '@/shared/lib/safeStorage';

export type PersistedQuizSession = {
  sessionId: number;
  startPayload: QuizStartResponse;
  currentIndex: number;
  latestScore: number;
  correctAnswers: number;
  endsAt: number;
  questionStartedAt: number;
};

const ACTIVE_SESSION_ID_KEY = 'quizy_active_quiz_session_id';

function getSessionKey(sessionId: number) {
  return `quizy_active_quiz_${sessionId}`;
}

export function savePersistedQuizSession(snapshot: PersistedQuizSession) {
  safeStorage.setItem(ACTIVE_SESSION_ID_KEY, String(snapshot.sessionId));
  safeStorage.setItem(getSessionKey(snapshot.sessionId), JSON.stringify(snapshot));
}

export function getPersistedQuizSession(sessionId: number): PersistedQuizSession | null {
  const raw = safeStorage.getItem(getSessionKey(sessionId));
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as PersistedQuizSession;
  } catch {
    return null;
  }
}

export function getLastActiveQuizSessionId(): number | null {
  const raw = safeStorage.getItem(ACTIVE_SESSION_ID_KEY);
  if (!raw) {
    return null;
  }

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

export function clearPersistedQuizSession(sessionId: number) {
  safeStorage.removeItem(getSessionKey(sessionId));

  const activeSessionId = getLastActiveQuizSessionId();
  if (activeSessionId === sessionId) {
    safeStorage.removeItem(ACTIVE_SESSION_ID_KEY);
  }
}
