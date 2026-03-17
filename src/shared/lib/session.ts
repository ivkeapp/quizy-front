const ACCESS_TOKEN_KEY = 'quizy_access_token';
const REFRESH_TOKEN_KEY = 'quizy_refresh_token';

let accessTokenInMemory: string | null = null;

export const session = {
  getAccessToken(): string | null {
    if (accessTokenInMemory) {
      return accessTokenInMemory;
    }
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  setAccessToken(token: string | null) {
    accessTokenInMemory = token;
    if (token) {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
      return;
    }
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  setRefreshToken(token: string | null) {
    if (token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
      return;
    }
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
  clear() {
    accessTokenInMemory = null;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};
