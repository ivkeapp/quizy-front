import { Link, NavLink, Outlet } from 'react-router-dom';

import { useAuthStatus, useLogout } from '@/features/auth/hooks';

export function AppLayout() {
  const { isAuthenticated, user } = useAuthStatus();
  const logout = useLogout();

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-semibold text-slate-900">
            Quizy
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <NavLink to="/" className="text-slate-600 hover:text-slate-900">
              Quiz
            </NavLink>
            <NavLink to="/categories" className="text-slate-600 hover:text-slate-900">
              Categories
            </NavLink>
            <NavLink to="/leaderboard" className="text-slate-600 hover:text-slate-900">
              Leaderboard
            </NavLink>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={logout}
                className="rounded bg-slate-900 px-3 py-1.5 text-white"
              >
                Logout ({user?.email})
              </button>
            ) : (
              <NavLink to="/login" className="rounded bg-slate-900 px-3 py-1.5 text-white">
                Login
              </NavLink>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-4xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
