import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { QuizPlayPage } from './QuizPlayPage';

vi.mock('@/features/quiz/hooks', () => ({
  useSubmitAnswer: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
    isError: false,
    error: null,
  }),
  useQuizStatus: () => ({ data: null }),
}));

describe('QuizPlayPage', () => {
  it('renders quiz question and progress from start payload', () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: '/quiz/session/42',
              state: {
                startPayload: {
                  session_id: 42,
                  duration: 120,
                  questions: [
                    {
                      id: 1,
                      text: 'Test pitanje?',
                      category_id: 1,
                      answers: [
                        { id: 11, text: 'Odgovor A', position: 1 },
                        { id: 12, text: 'Odgovor B', position: 2 },
                        { id: 13, text: 'Odgovor C', position: 3 },
                        { id: 14, text: 'Odgovor D', position: 4 },
                      ],
                    },
                  ],
                },
              },
            },
          ]}
        >
          <Routes>
            <Route path="/quiz/session/:sessionId" element={<QuizPlayPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByRole('heading', { name: 'Quiz in progress' })).toBeInTheDocument();
    expect(screen.getByText('Question 1 / 1')).toBeInTheDocument();
    expect(screen.getByText('Test pitanje?')).toBeInTheDocument();
    expect(screen.getByText('1. Odgovor A')).toBeInTheDocument();
  });
});
