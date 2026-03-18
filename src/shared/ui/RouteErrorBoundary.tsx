import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

import { PageErrorFallback } from './PageErrorFallback';

export function RouteErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return <PageErrorFallback title={`Error ${error.status}`} message={error.statusText} />;
  }

  if (error instanceof Error) {
    return <PageErrorFallback title="Unexpected Application Error" message={error.message} />;
  }

  return <PageErrorFallback />;
}
