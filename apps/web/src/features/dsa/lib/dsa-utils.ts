import type { DsaLanguage, SubmissionStatus } from '@interviewgpt/shared';

export const LANGUAGE_OPTIONS: { value: DsaLanguage; label: string; monaco: string }[] = [
  { value: 'PYTHON', label: 'Python', monaco: 'python' },
  { value: 'JAVASCRIPT', label: 'JavaScript', monaco: 'javascript' },
  { value: 'JAVA', label: 'Java', monaco: 'java' },
  { value: 'CPP', label: 'C++', monaco: 'cpp' },
];

export function difficultyClass(difficulty: string) {
  switch (difficulty) {
    case 'EASY':
      return 'text-emerald-600 dark:text-emerald-400';
    case 'MEDIUM':
      return 'text-amber-600 dark:text-amber-400';
    case 'HARD':
      return 'text-rose-600 dark:text-rose-400';
    default:
      return 'text-muted-foreground';
  }
}

export function statusClass(status: SubmissionStatus | string) {
  switch (status) {
    case 'ACCEPTED':
      return 'text-emerald-600 dark:text-emerald-400';
    case 'WRONG_ANSWER':
      return 'text-amber-600 dark:text-amber-400';
    case 'COMPILE_ERROR':
    case 'RUNTIME_ERROR':
      return 'text-rose-600 dark:text-rose-400';
    case 'TIME_LIMIT_EXCEEDED':
    case 'MEMORY_LIMIT_EXCEEDED':
      return 'text-orange-600 dark:text-orange-400';
    default:
      return 'text-muted-foreground';
  }
}

export function formatStatus(status: string) {
  return status.replace(/_/g, ' ');
}
