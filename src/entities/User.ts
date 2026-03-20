export type UserRole = 'user' | 'admin';

export type User = {
  userId: number;
  email: string;
  name?: string;
  isVerified?: boolean;
  verifiedAt?: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
};
