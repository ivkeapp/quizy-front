import { create } from 'zustand';

import type { User } from '@/entities/User';

type AuthState = {
  isAuthResolved: boolean;
  user: User | null;
  setAuthResolved: (value: boolean) => void;
  setUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthResolved: false,
  user: null,
  setAuthResolved: (value) => set({ isAuthResolved: value }),
  setUser: (user) => set({ user }),
}));
