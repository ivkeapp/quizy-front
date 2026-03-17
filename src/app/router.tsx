import { createBrowserRouter } from 'react-router-dom';

import { CategoriesPage } from '@/pages/CategoriesPage';
import { LeaderboardPage } from '@/pages/LeaderboardPage';
import { LoginPage } from '@/pages/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { QuizPlayPage } from '@/pages/QuizPlayPage';
import { QuizResultPage } from '@/pages/QuizResultPage';
import { QuizSetupPage } from '@/pages/QuizSetupPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { AppLayout } from '@/shared/ui/AppLayout';
import { ProtectedRoute } from '@/shared/ui/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <QuizSetupPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'categories',
        element: <CategoriesPage />,
      },
      {
        path: 'quiz/session/:sessionId',
        element: <QuizPlayPage />,
      },
      {
        path: 'quiz/session/:sessionId/result',
        element: <QuizResultPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'leaderboard',
            element: <LeaderboardPage />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
