import { FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { getApiErrorMessage, useLogin } from '@/features/auth/hooks';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = useLogin();

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await login.mutateAsync({ email, password });
    navigate(from, { replace: true });
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-xl bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold">Login</h1>
      <p className="mt-1 text-sm text-slate-600">Use credentials from backend seed data.</p>

      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <input
          className="w-full rounded border border-slate-300 px-3 py-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <input
          className="w-full rounded border border-slate-300 px-3 py-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {login.isError ? (
          <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {getApiErrorMessage(login.error, 'Login failed')}
          </div>
        ) : null}

        <button
          className="w-full rounded bg-slate-900 px-4 py-2 font-medium text-white disabled:opacity-60"
          type="submit"
          disabled={login.isPending}
        >
          {login.isPending ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
