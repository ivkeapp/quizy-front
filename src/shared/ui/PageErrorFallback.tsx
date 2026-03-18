import { Link } from 'react-router-dom';

import { Card } from './Card';

export function PageErrorFallback({
  title = 'Something went wrong',
  message = 'Please try again or return to the home page.',
}: {
  title?: string;
  message?: string;
}) {
  return (
    <Card>
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="mt-2 text-sm text-slate-600">{message}</p>
      <Link to="/" className="mt-4 inline-block rounded bg-slate-900 px-4 py-2 text-sm text-white">
        Go home
      </Link>
    </Card>
  );
}
