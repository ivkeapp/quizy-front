import { memo } from 'react';

import { formatTime } from '@/shared/lib/format';

type QuizTimerProps = {
  remainingSeconds: number;
};

function QuizTimerComponent({ remainingSeconds }: QuizTimerProps) {
  const isCritical = remainingSeconds <= 30;

  return (
    <div
      className={`rounded px-3 py-2 text-sm font-semibold text-white ${
        isCritical ? 'animate-pulse bg-red-600' : 'bg-slate-900'
      }`}
    >
      Time left: {formatTime(remainingSeconds)}
    </div>
  );
}

export const QuizTimer = memo(QuizTimerComponent);
