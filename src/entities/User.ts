export type UserRole = 'user' | 'admin';

export type User = {
  userId: number;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
};
