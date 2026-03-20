import { Link, useSearchParams } from 'react-router-dom';

import { getApiErrorMessage, useVerifyEmail } from '@/features/auth/hooks';
import { LoadingState } from '@/shared/ui/LoadingState';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const verifyEmail = useVerifyEmail(token);

  if (!token) {
    return (
      <div className="mx-auto w-full max-w-md rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Email verification</h1>
        <p className="mt-2 text-sm text-red-700">Verification token is missing.</p>
        <Link className="mt-4 inline-flex rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white" to="/register">
          Back to register
        </Link>
      </div>
    );
  }

  if (verifyEmail.isLoading) {
    return <LoadingState label="Verifying email..." />;
  }

  if (verifyEmail.isError) {
    return (
      <div className="mx-auto w-full max-w-md rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Email verification failed</h1>
        <p className="mt-2 text-sm text-red-700">
          {getApiErrorMessage(verifyEmail.error, 'Invalid or expired verification token')}
        </p>
        <Link className="mt-4 inline-flex rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white" to="/register">
          Register again
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-xl bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold">Email verified</h1>
      <p className="mt-2 text-sm text-slate-600">
        {verifyEmail.data?.message || 'Email verified successfully.'}
      </p>
      <Link className="mt-4 inline-flex rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white" to="/login">
        Continue to login
      </Link>
    </div>
  );
}
