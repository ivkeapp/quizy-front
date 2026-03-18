import { useMemo, useState } from 'react';

import { useArchiveAdminQuestion, useCreateAdminQuestion, useAdminQuestions, useUpdateAdminQuestion } from '@/features/admin/hooks';
import { QuestionForm } from '@/features/admin/QuestionForm';
import type { AdminQuestion } from '@/features/admin/types';
import { useCategories } from '@/features/categories/hooks';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';

export function AdminQuestionsPage() {
  const [editingQuestion, setEditingQuestion] = useState<AdminQuestion | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all');

  const categoriesQuery = useCategories();
  const questionsQuery = useAdminQuestions();
  const createQuestion = useCreateAdminQuestion();
  const updateQuestion = useUpdateAdminQuestion();
  const archiveQuestion = useArchiveAdminQuestion();

  const categories = categoriesQuery.data ?? [];
  const categoryNameMap = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories],
  );

  const orderedQuestions = useMemo(
    () => (questionsQuery.data?.items ?? []).slice().sort((left, right) => right.id - left.id),
    [questionsQuery.data?.items],
  );

  const filteredQuestions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return orderedQuestions.filter((question) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        question.text.toLowerCase().includes(normalizedSearch) ||
        question.answers.some((answer) => answer.text.toLowerCase().includes(normalizedSearch));

      const matchesCategory =
        categoryFilter === 'all' || String(question.categoryId) === categoryFilter;

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && question.active) ||
        (statusFilter === 'archived' && !question.active);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [categoryFilter, orderedQuestions, searchTerm, statusFilter]);

  if (categoriesQuery.isLoading || questionsQuery.isLoading) {
    return <LoadingState label="Loading admin questions..." />;
  }

  if (categoriesQuery.isError || questionsQuery.isError) {
    return <ErrorState message="Unable to load admin questions." />;
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">Admin questions</h1>
            <p className="text-sm text-slate-600">Add, edit and archive quiz questions.</p>
          </div>
          <Button
            type="button"
            onClick={() => {
              setEditingQuestion(null);
              setIsCreateMode((current) => !current);
            }}
          >
            {isCreateMode ? 'Close form' : 'Add question'}
          </Button>
        </div>

        {isCreateMode ? (
          <QuestionForm
            categories={categories}
            isSubmitting={createQuestion.isPending}
            onSubmit={async (payload) => {
              await createQuestion.mutateAsync(payload);
              setIsCreateMode(false);
            }}
            onCancel={() => setIsCreateMode(false)}
          />
        ) : null}

        {createQuestion.isError ? (
          <ErrorState message="Unable to create question." />
        ) : null}
      </Card>

      <Card className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Search questions</label>
            <input
              className="w-full rounded border border-slate-300 px-3 py-2"
              placeholder="Search by question or answer text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Category</label>
            <select
              className="w-full rounded border border-slate-300 px-3 py-2"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Status</label>
            <select
              className="w-full rounded border border-slate-300 px-3 py-2"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as 'all' | 'active' | 'archived')}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-slate-600">
          Showing <span className="font-semibold text-slate-900">{filteredQuestions.length}</span> of{' '}
          <span className="font-semibold text-slate-900">{orderedQuestions.length}</span> questions.
        </div>
      </Card>

      <div className="space-y-4">
        {filteredQuestions.map((question) => {
          const isEditing = editingQuestion?.id === question.id;
          const categoryName = categoryNameMap.get(question.categoryId) ?? `Category ${question.categoryId}`;

          return (
            <Card key={question.id} className="space-y-4 border border-slate-200">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Question #{question.id} • {categoryName} • Usage {question.usageCount}
                  </div>
                  <h2 className="mt-1 text-lg font-semibold">{question.text}</h2>
                  <div className="mt-1 text-sm text-slate-600">
                    Status: {question.active ? 'Active' : 'Archived'}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setIsCreateMode(false);
                      setEditingQuestion(isEditing ? null : question);
                    }}
                  >
                    {isEditing ? 'Close edit' : 'Edit'}
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    disabled={archiveQuestion.isPending || !question.active}
                    onClick={async () => {
                      const shouldArchive = window.confirm(
                        `Archive question #${question.id}? This will set it as inactive.`,
                      );

                      if (!shouldArchive) {
                        return;
                      }

                      await archiveQuestion.mutateAsync(question.id);
                      if (isEditing) {
                        setEditingQuestion(null);
                      }
                    }}
                  >
                    Archive
                  </Button>
                </div>
              </div>

              <ul className="grid gap-2 sm:grid-cols-2">
                {question.answers
                  .slice()
                  .sort((left, right) => left.position - right.position)
                  .map((answer) => (
                    <li key={`${question.id}-${answer.position}`} className="rounded border border-slate-200 p-3 text-sm">
                      <span className="font-medium">{answer.position}. {answer.text}</span>
                      <span className={`ml-2 rounded px-2 py-0.5 text-xs ${answer.isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                        {answer.isCorrect ? 'Correct' : 'Wrong'}
                      </span>
                    </li>
                  ))}
              </ul>

              {isEditing ? (
                <QuestionForm
                  categories={categories}
                  initialQuestion={question}
                  isSubmitting={updateQuestion.isPending}
                  onSubmit={async (payload) => {
                    await updateQuestion.mutateAsync({ id: question.id, payload });
                    setEditingQuestion(null);
                  }}
                  onCancel={() => setEditingQuestion(null)}
                />
              ) : null}
            </Card>
          );
        })}

        {filteredQuestions.length === 0 ? (
          <Card>
            <p className="text-sm text-slate-600">No questions match the current filters.</p>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
