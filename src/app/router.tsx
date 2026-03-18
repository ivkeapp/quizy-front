import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { AppLayout } from '@/shared/ui/AppLayout';
import { ProtectedRoute } from '@/shared/ui/ProtectedRoute';
import { RouteErrorBoundary } from '@/shared/ui/RouteErrorBoundary';

const CategoriesPage = lazy(() => import('@/pages/CategoriesPage').then((module) => ({ default: module.CategoriesPage })));
const AdminQuestionsPage = lazy(() => import('@/pages/AdminQuestionsPage').then((module) => ({ default: module.AdminQuestionsPage })));
const LeaderboardPage = lazy(() => import('@/pages/LeaderboardPage').then((module) => ({ default: module.LeaderboardPage })));
const LoginPage = lazy(() => import('@/pages/LoginPage').then((module) => ({ default: module.LoginPage })));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })));
const QuizPlayPage = lazy(() => import('@/pages/QuizPlayPage').then((module) => ({ default: module.QuizPlayPage })));
const QuizResultPage = lazy(() => import('@/pages/QuizResultPage').then((module) => ({ default: module.QuizResultPage })));
const QuizSetupPage = lazy(() => import('@/pages/QuizSetupPage').then((module) => ({ default: module.QuizSetupPage })));
const RegisterPage = lazy(() => import('@/pages/RegisterPage').then((module) => ({ default: module.RegisterPage })));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <RouteErrorBoundary />,
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
        element: <ProtectedRoute requiredRole="admin" />,
        children: [
          {
            path: 'admin/questions',
            element: <AdminQuestionsPage />,
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
