import { useEffect, useMemo, useState } from 'react';

import type { Category } from '@/entities/Category';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';

import type { AdminQuestion, AdminQuestionPayload } from './types';

type QuestionFormProps = {
  categories: Category[];
  initialQuestion?: AdminQuestion | null;
  isSubmitting?: boolean;
  onCancel?: () => void;
  onSubmit: (payload: AdminQuestionPayload) => Promise<void> | void;
};

type AnswerInput = {
  text: string;
  isCorrect: boolean;
  position: number;
};

const defaultAnswers: AnswerInput[] = [1, 2, 3, 4].map((position) => ({
  text: '',
  isCorrect: position === 1,
  position,
}));

export function QuestionForm({
  categories,
  initialQuestion,
  isSubmitting = false,
  onCancel,
  onSubmit,
}: QuestionFormProps) {
  const [text, setText] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [active, setActive] = useState(true);
  const [answers, setAnswers] = useState<AnswerInput[]>(defaultAnswers);

  const isEditMode = Boolean(initialQuestion);

  useEffect(() => {
    if (!initialQuestion) {
      setText('');
      setCategoryId(categories[0] ? String(categories[0].id) : '');
      setActive(true);
      setAnswers(defaultAnswers);
      return;
    }

    setText(initialQuestion.text);
    setCategoryId(String(initialQuestion.categoryId));
    setActive(initialQuestion.active);
    setAnswers(
      initialQuestion.answers
        .slice()
        .sort((left, right) => left.position - right.position)
        .map((answer) => ({
          text: answer.text,
          isCorrect: answer.isCorrect,
          position: answer.position,
        })),
    );
  }, [categories, initialQuestion]);

  const isValid = useMemo(() => {
    const trimmedQuestion = text.trim();
    const correctCount = answers.filter((answer) => answer.isCorrect).length;

    return (
      trimmedQuestion.length >= 5 &&
      categoryId.length > 0 &&
      answers.every((answer) => answer.text.trim().length > 0) &&
      correctCount === 1
    );
  }, [answers, categoryId, text]);

  const updateAnswer = (index: number, value: Partial<AnswerInput>) => {
    setAnswers((current) =>
      current.map((answer, currentIndex) => {
        if (currentIndex !== index) {
          return value.isCorrect ? { ...answer, isCorrect: false } : answer;
        }

        return { ...answer, ...value };
      }),
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValid) {
      return;
    }

    await onSubmit({
      text: text.trim(),
      category_id: Number(categoryId),
      active,
      answers: answers.map((answer) => ({
        text: answer.text.trim(),
        is_correct: answer.isCorrect,
        position: answer.position,
      })),
    });
  };

  return (
    <Card className="space-y-4 border border-slate-200">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{isEditMode ? 'Edit question' : 'Add question'}</h2>
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block text-sm font-medium">Question text</label>
          <textarea
            className="min-h-24 w-full rounded border border-slate-300 px-3 py-2"
            value={text}
            onChange={(event) => setText(event.target.value)}
            minLength={5}
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Category</label>
            <select
              className="w-full rounded border border-slate-300 px-3 py-2"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              required
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 self-end rounded border border-slate-300 px-3 py-2 text-sm">
            <input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} />
            Active question
          </label>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-medium">Answers (exactly 4, one correct)</div>
          {answers.map((answer, index) => (
            <div key={answer.position} className="grid gap-3 rounded border border-slate-200 p-3 sm:grid-cols-[1fr_auto]">
              <div>
                <label className="mb-1 block text-xs text-slate-500">Answer {answer.position}</label>
                <input
                  className="w-full rounded border border-slate-300 px-3 py-2"
                  value={answer.text}
                  onChange={(event) => updateAnswer(index, { text: event.target.value })}
                  required
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="correct-answer"
                  checked={answer.isCorrect}
                  onChange={() => updateAnswer(index, { isCorrect: true })}
                />
                Correct
              </label>
            </div>
          ))}
        </div>

        <Button type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting ? 'Saving...' : isEditMode ? 'Save changes' : 'Create question'}
        </Button>
      </form>
    </Card>
  );
}
