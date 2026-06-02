import type { Role } from '../constants/index';

export type { Role };

export interface UserProfile {
  bio?: string | null;
  college?: string | null;
  graduationYear?: number | null;
  targetRole?: string | null;
  githubUsername?: string | null;
  leetcodeUsername?: string | null;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl: string | null;
  emailVerified: boolean;
  profile?: UserProfile | null;
}

export interface AuthResponse {
  user: AuthUser;
  expiresIn: number;
}
