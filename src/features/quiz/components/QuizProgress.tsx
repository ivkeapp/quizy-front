import { memo } from 'react';

type QuizProgressProps = {
  currentIndex: number;
  totalQuestions: number;
};

function QuizProgressComponent({ currentIndex, totalQuestions }: QuizProgressProps) {
  const progressPercent = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>
          Question {currentIndex + 1} / {totalQuestions}
        </span>
        <span>{Math.round(progressPercent)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-slate-900 transition-all" style={{ width: `${progressPercent}%` }} />
      </div>
    </div>
  );
}

export const QuizProgress = memo(QuizProgressComponent);
