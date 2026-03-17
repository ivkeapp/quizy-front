import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="rounded-xl bg-white p-5 shadow-sm">
      <h1 className="text-xl font-semibold">Page not found</h1>
      <p className="mt-1 text-sm text-slate-600">Requested route does not exist.</p>
      <Link to="/" className="mt-3 inline-block rounded bg-slate-900 px-3 py-2 text-sm text-white">
        Go to home
      </Link>
    </section>
  );
}
