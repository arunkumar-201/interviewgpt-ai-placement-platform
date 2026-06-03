import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Code2, Search } from 'lucide-react';
import { DashboardLayout } from '@/features/dashboard/layouts/DashboardLayout';
import { useProblems } from '../hooks/useDsa';
import { difficultyClass } from '../lib/dsa-utils';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import type { ListProblemsQuery } from '@interviewgpt/shared';
import { DIFFICULTY_OPTIONS, TOPIC_OPTIONS } from '../lib/filters';

export function ProblemsListPage() {
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<ListProblemsQuery['difficulty'] | ''>('');
  const [topic, setTopic] = useState<ListProblemsQuery['topic'] | ''>('');
  const [status, setStatus] = useState<ListProblemsQuery['status']>('all');
  const [tag, setTag] = useState('');
  const [page, setPage] = useState(1);

  const query = useMemo(
    () => ({
      page,
      limit: 20,
      search: search || undefined,
      difficulty: difficulty || undefined,
      topic: topic || undefined,
      status,
      tag: tag || undefined,
    }),
    [page, search, difficulty, topic, status, tag],
  );

  const { data, isLoading, isError, refetch } = useProblems(query);

  const progressPct =
    data && data.meta.total > 0
      ? Math.round((data.meta.solvedCount / data.meta.total) * 100)
      : 0;

  const allTags = useMemo(() => {
    if (!data) return [];
    const set = new Set<string>();
    data.data.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return [...set].sort();
  }, [data]);

  return (
    <DashboardLayout title="DSA Coding Arena">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
              <Code2 className="h-7 w-7 text-violet-500" />
              Problems
            </h1>
            <p className="text-muted-foreground">
              Practice data structures and algorithms with Judge0 execution.
            </p>
          </div>
          {data && (
            <Card className="w-full border-border/60 sm:w-72">
              <CardHeader className="pb-2 pt-4">
                <CardDescription>Your progress</CardDescription>
                <CardTitle className="text-lg">
                  {data.meta.solvedCount} / {data.meta.total} solved
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <Progress value={progressPct} className="h-2" />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search problems…"
              className="pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value as ListProblemsQuery['difficulty'] | '');
              setPage(1);
            }}
          >
            {DIFFICULTY_OPTIONS.map((d) => (
              <option key={d.value || 'all'} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value as ListProblemsQuery['topic'] | '');
              setPage(1);
            }}
          >
            {TOPIC_OPTIONS.map((t) => (
              <option key={t.value || 'all'} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as ListProblemsQuery['status']);
              setPage(1);
            }}
          >
            <option value="all">All</option>
            <option value="solved">Solved</option>
            <option value="unsolved">Unsolved</option>
          </select>
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={tag}
            onChange={(e) => {
              setTag(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All tags</option>
            {allTags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {isError && (
          <Card className="border-destructive/50">
            <CardContent className="flex flex-col items-center gap-3 py-8">
              <p className="text-muted-foreground">Failed to load problems</p>
              <Button onClick={() => refetch()}>Retry</Button>
            </CardContent>
          </Card>
        )}

        <Card className="border-border/60">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-left text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Difficulty</th>
                    <th className="px-4 py-3 font-medium hidden sm:table-cell">Acceptance</th>
                    <th className="px-4 py-3 font-medium hidden md:table-cell">Tags</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading &&
                    Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i} className="border-b border-border/40">
                        <td colSpan={5} className="px-4 py-4">
                          <div className="h-4 animate-pulse rounded bg-muted" />
                        </td>
                      </tr>
                    ))}
                  {data?.data.map((problem) => (
                    <tr
                      key={problem.id}
                      className="border-b border-border/40 transition-colors hover:bg-muted/40"
                    >
                      <td className="px-4 py-3">
                        {problem.isSolved ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" aria-label="Solved" />
                        ) : (
                          <span className="inline-block h-5 w-5 rounded-full border border-border" />
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/dsa/${problem.slug}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {problem.title}
                        </Link>
                      </td>
                      <td className={`px-4 py-3 font-medium ${difficultyClass(problem.difficulty)}`}>
                        {problem.difficulty}
                      </td>
                      <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                        {problem.acceptanceRate}%
                      </td>
                      <td className="hidden px-4 py-3 md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {problem.tags.slice(0, 3).map((t) => (
                            <Badge key={t} variant="outline" className="text-[10px]">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {data && data.meta.totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span className="flex items-center text-sm text-muted-foreground">
              Page {page} of {data.meta.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= data.meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
