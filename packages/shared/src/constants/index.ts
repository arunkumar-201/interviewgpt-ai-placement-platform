export enum Role {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
}

export enum AuthProvider {
  EMAIL = 'EMAIL',
  GOOGLE = 'GOOGLE',
}

export enum NotificationType {
  SYSTEM = 'SYSTEM',
  DSA = 'DSA',
  RESUME = 'RESUME',
  INTERVIEW = 'INTERVIEW',
  READINESS = 'READINESS',
  ADMIN = 'ADMIN',
}

export const API_PREFIX = '/api/v1';

export const READINESS_WEIGHTS = {
  dsa: 0.3,
  resume: 0.2,
  interview: 0.25,
  github: 0.15,
  leetcode: 0.1,
} as const;

export const DEFAULT_COMPANIES = [
  { slug: 'google', name: 'Google' },
  { slug: 'amazon', name: 'Amazon' },
  { slug: 'microsoft', name: 'Microsoft' },
  { slug: 'adobe', name: 'Adobe' },
  { slug: 'atlassian', name: 'Atlassian' },
  { slug: 'goldman-sachs', name: 'Goldman Sachs' },
  { slug: 'infosys', name: 'Infosys' },
] as const;
