import type {
  DsaLanguage,
  PaginatedProblems,
  ProblemDetail,
  RunCodeInput,
  SubmissionHistoryItem,
  SubmissionResult,
} from '@interviewgpt/shared';
import type { ListProblemsQuery } from '@interviewgpt/shared';
import { apiClient } from '@/lib/api-client';

export function fetchProblems(query: Partial<ListProblemsQuery> = {}) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.set(key, String(value));
    }
  });
  const qs = params.toString();
  return apiClient<PaginatedProblems>(`/problems${qs ? `?${qs}` : ''}`);
}

export function fetchProblem(slug: string) {
  return apiClient<ProblemDetail>(`/problems/${slug}`);
}

export function runCode(slug: string, payload: RunCodeInput) {
  return apiClient<SubmissionResult>(`/problems/${slug}/run`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function submitCode(slug: string, language: DsaLanguage, sourceCode: string) {
  return apiClient<SubmissionResult>(`/problems/${slug}/submit`, {
    method: 'POST',
    body: JSON.stringify({ language, sourceCode }),
  });
}

export function fetchSubmissions(slug: string) {
  return apiClient<SubmissionHistoryItem[]>(`/problems/${slug}/submissions`);
}
