import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { getApiErrorMessage, useRegister } from '@/features/auth/hooks';

export function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const register = useRegister();

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const normalizedName = name.trim();

    await register.mutateAsync({
      email,
      password,
      name: normalizedName,
    });

    navigate('/', { replace: true });
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-xl bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold">Register</h1>
      <p className="mt-1 text-sm text-slate-600">Create account and start playing quizzes.</p>

      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <input
          className="w-full rounded border border-slate-300 px-3 py-2"
          placeholder="Full name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          minLength={2}
          required
        />
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
          minLength={8}
          required
        />

        {register.isError ? (
          <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {getApiErrorMessage(register.error, 'Register failed')}
          </div>
        ) : null}

        <button
          className="w-full rounded bg-slate-900 px-4 py-2 font-medium text-white disabled:opacity-60"
          type="submit"
          disabled={register.isPending}
        >
          {register.isPending ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="mt-3 text-sm text-slate-600">
        Already have account?{' '}
        <Link className="font-medium text-slate-900" to="/login">
          Login
        </Link>
      </p>
    </div>
  );
}
