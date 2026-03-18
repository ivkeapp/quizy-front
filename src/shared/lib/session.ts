import { safeStorage } from './safeStorage';

const ACCESS_TOKEN_KEY = 'quizy_access_token';
const REFRESH_TOKEN_KEY = 'quizy_refresh_token';

let accessTokenInMemory: string | null = null;

export const session = {
  getAccessToken(): string | null {
    if (accessTokenInMemory) {
      return accessTokenInMemory;
    }
    return safeStorage.getItem(ACCESS_TOKEN_KEY);
  },
  setAccessToken(token: string | null) {
    accessTokenInMemory = token;
    if (token) {
      safeStorage.setItem(ACCESS_TOKEN_KEY, token);
      return;
    }
    safeStorage.removeItem(ACCESS_TOKEN_KEY);
  },
  getRefreshToken(): string | null {
    return safeStorage.getItem(REFRESH_TOKEN_KEY);
  },
  setRefreshToken(token: string | null) {
    if (token) {
      safeStorage.setItem(REFRESH_TOKEN_KEY, token);
      return;
    }
    safeStorage.removeItem(REFRESH_TOKEN_KEY);
  },
  clear() {
    accessTokenInMemory = null;
    safeStorage.removeItem(ACCESS_TOKEN_KEY);
    safeStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};
