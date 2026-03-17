import { RouterProvider } from 'react-router-dom';

import { useAuthBootstrap } from '@/features/auth/hooks';

import { router } from './router';
import { AppProviders } from './providers/AppProviders';

function AppContent() {
  useAuthBootstrap();
  return <RouterProvider router={router} />;
}

export function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}
