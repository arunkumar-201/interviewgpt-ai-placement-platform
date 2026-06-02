import { Github } from 'lucide-react';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { GitHubAnalytics as GitHubData } from '@interviewgpt/shared';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface GitHubAnalyticsProps {
  data: GitHubData | null;
}

export function GitHubAnalytics({ data }: GitHubAnalyticsProps) {
  const chartData = data?.weeklyContributions.map((count, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i] ?? `D${i}`,
    commits: count,
  })) ?? [];

  return (
    <Card id="github" className="scroll-mt-24 border-border/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Github className="h-5 w-5" />
          GitHub Analytics
        </CardTitle>
        <CardDescription>
          {data ? `@${data.username} · Score ${data.score}/100` : 'Connect GitHub for profile insights'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <div className="rounded-lg border p-3">
                <p className="text-xl font-bold">{data.totalRepos}</p>
                <p className="text-muted-foreground">Repos</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xl font-bold">{data.totalStars}</p>
                <p className="text-muted-foreground">Stars</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xl font-bold">{data.totalCommits}</p>
                <p className="text-muted-foreground">Commits</p>
              </div>
            </div>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="commits" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <p className="text-sm text-muted-foreground">GitHub not analyzed yet</p>
            <Button variant="outline" size="sm" disabled>
              Connect GitHub
            </Button>
            <span className="text-xs text-muted-foreground">Available in Phase 8</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
