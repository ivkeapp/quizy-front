import axios from 'axios';

import { env } from '@/shared/lib/env';
import { session } from '@/shared/lib/session';

import type { ApiError } from './types';

const AUTH_REFRESH_PATH = '/api/auth/refresh';

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export const http = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

http.interceptors.request.use((config) => {
  const token = session.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function refreshAccessToken() {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = http
    .post(AUTH_REFRESH_PATH, {
      refresh_token: session.getRefreshToken(),
    })
    .then((response) => {
      const accessToken = response.data?.accessToken as string | undefined;
      const refreshToken = response.data?.refreshToken as string | undefined;
      session.setAccessToken(accessToken ?? null);
      if (refreshToken) {
        session.setRefreshToken(refreshToken);
      }
      return accessToken ?? null;
    })
    .catch(() => {
      session.clear();
      return null;
    })
    .finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });

  return refreshPromise;
}

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    const isUnauthorized = error.response.status === 401;
    const isRefreshCall = originalRequest.url?.includes(AUTH_REFRESH_PATH);

    if (isUnauthorized && !isRefreshCall && !originalRequest._retry) {
      originalRequest._retry = true;
      const accessToken = await refreshAccessToken();
      if (accessToken) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return http(originalRequest);
      }
    }

    const apiError: ApiError = {
      error: error.response?.data?.error ?? 'RequestError',
      message: error.response?.data?.message ?? 'Unexpected request error',
      code: error.response?.status ?? 500,
    };

    return Promise.reject(apiError);
  },
);
