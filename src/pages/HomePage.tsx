import { useAuthStatus } from '@/features/auth/hooks';
import { LoadingState } from '@/shared/ui/LoadingState';
import { LandingPage } from './LandingPage';
import { QuizSetupPage } from './QuizSetupPage';

export function HomePage() {
  const { isAuthenticated, isAuthResolved } = useAuthStatus();

  if (!isAuthResolved) {
    return <LoadingState label="Loading..." />;
  }

  return isAuthenticated ? <QuizSetupPage /> : <LandingPage />;
}
