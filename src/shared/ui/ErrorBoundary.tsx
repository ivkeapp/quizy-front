import type { ErrorInfo, PropsWithChildren, ReactNode } from 'react';
import { Component } from 'react';

import { PageErrorFallback } from './PageErrorFallback';

type ErrorBoundaryProps = PropsWithChildren<{
  fallback?: ReactNode;
}>;

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application error boundary caught an error', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <PageErrorFallback />;
    }

    return this.props.children;
  }
}
