import axios from 'axios';

import type { ApiError } from './types';

export function normalizeApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return {
        error: 'NetworkError',
        message: 'Unable to reach the server. Please check your connection.',
        code: 0,
      };
    }

    return {
      error: error.response.data?.error ?? 'RequestError',
      message: error.response.data?.message ?? 'Unexpected request error',
      code: error.response.status ?? 500,
    };
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    return {
      error: 'UnknownError',
      message: String((error as { message: unknown }).message),
      code: 500,
    };
  }

  return {
    error: 'UnknownError',
    message: 'Unexpected application error',
    code: 500,
  };
}
