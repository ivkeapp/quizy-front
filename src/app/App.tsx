import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';

import { useAuthBootstrap } from '@/features/auth/hooks';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';
import { LoadingState } from '@/shared/ui/LoadingState';

import { router } from './router';
import { AppProviders } from './providers/AppProviders';

function AppContent() {
  useAuthBootstrap();
  return <RouterProvider router={router} />;
}

export function App() {
  return (
    <AppProviders>
      <ErrorBoundary>
        <Suspense fallback={<LoadingState label="Loading page..." />}>
          <AppContent />
        </Suspense>
      </ErrorBoundary>
    </AppProviders>
  );
}
