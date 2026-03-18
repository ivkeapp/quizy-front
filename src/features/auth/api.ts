import type { User } from '@/entities/User';
import { http } from '@/shared/api/http';

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await http.post<AuthResponse>('/api/auth/login', payload);
  return data;
}

export async function register(payload: {
  email: string;
  password: string;
  name: string;
}): Promise<AuthResponse> {
  const { data } = await http.post<AuthResponse>('/api/auth/register', payload);
  return data;
}

export async function me(): Promise<User> {
  const { data } = await http.get<User>('/api/auth/me');
  return data;
}

export async function refresh(): Promise<AuthResponse> {
  const { data } = await http.post<AuthResponse>('/api/auth/refresh', {
    refresh_token: null,
  });
  return data;
}
