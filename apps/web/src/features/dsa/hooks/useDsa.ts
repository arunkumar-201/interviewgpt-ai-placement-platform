import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { DsaLanguage, ListProblemsQuery, RunCodeInput } from '@interviewgpt/shared';
import {
  fetchProblem,
  fetchProblems,
  fetchSubmissions,
  runCode,
  submitCode,
} from '../api/dsa.api';
import { DASHBOARD_QUERY_KEY } from '@/features/dashboard/hooks/useDashboard';

export const DSA_PROBLEMS_KEY = ['dsa', 'problems'] as const;
export const DSA_PROBLEM_KEY = (slug: string) => ['dsa', 'problem', slug] as const;
export const DSA_SUBMISSIONS_KEY = (slug: string) => ['dsa', 'submissions', slug] as const;

export function useProblems(query: Partial<ListProblemsQuery>) {
  return useQuery({
    queryKey: [...DSA_PROBLEMS_KEY, query],
    queryFn: () => fetchProblems(query),
    staleTime: 60_000,
  });
}

export function useProblem(slug: string | undefined) {
  return useQuery({
    queryKey: DSA_PROBLEM_KEY(slug ?? ''),
    queryFn: () => fetchProblem(slug!),
    enabled: Boolean(slug),
  });
}

export function useSubmissions(slug: string | undefined) {
  return useQuery({
    queryKey: DSA_SUBMISSIONS_KEY(slug ?? ''),
    queryFn: () => fetchSubmissions(slug!),
    enabled: Boolean(slug),
  });
}

export function useRunCode(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RunCodeInput) => runCode(slug, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: DSA_SUBMISSIONS_KEY(slug) });
    },
  });
}

export function useSubmitCode(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ language, sourceCode }: { language: DsaLanguage; sourceCode: string }) =>
      submitCode(slug, language, sourceCode),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: DSA_SUBMISSIONS_KEY(slug) });
      void queryClient.invalidateQueries({ queryKey: DSA_PROBLEM_KEY(slug) });
      void queryClient.invalidateQueries({ queryKey: DSA_PROBLEMS_KEY });
      void queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
    },
  });
}
