import { BarChart3, ExternalLink } from 'lucide-react';
import type { LeetCodeAnalytics as LeetCodeData } from '@interviewgpt/shared';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface LeetCodeAnalyticsProps {
  data: LeetCodeData | null;
}

export function LeetCodeAnalytics({ data }: LeetCodeAnalyticsProps) {
  return (
    <Card id="leetcode" className="scroll-mt-24 border-border/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-orange-500" />
          LeetCode Analytics
        </CardTitle>
        <CardDescription>
          {data ? `@${data.username}` : 'Link your LeetCode profile to sync stats'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-emerald-500/10 p-3">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{data.easySolved}</p>
                <p className="text-xs text-muted-foreground">Easy</p>
              </div>
              <div className="rounded-lg bg-amber-500/10 p-3">
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{data.mediumSolved}</p>
                <p className="text-xs text-muted-foreground">Medium</p>
              </div>
              <div className="rounded-lg bg-red-500/10 p-3">
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{data.hardSolved}</p>
                <p className="text-xs text-muted-foreground">Hard</p>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total solved</span>
              <span className="font-semibold">{data.totalSolved}</span>
            </div>
            {data.contestRating != null && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Contest rating</span>
                <span className="font-semibold">{data.contestRating}</span>
              </div>
            )}
            {data.acceptanceRate != null && (
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span>Acceptance rate</span>
                  <span>{Math.round(data.acceptanceRate * 100)}%</span>
                </div>
                <Progress value={data.acceptanceRate * 100} className="h-1.5" />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <p className="text-sm text-muted-foreground">No LeetCode profile linked yet</p>
            <Button variant="outline" size="sm" disabled>
              Link LeetCode
              <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
            <span className="text-xs text-muted-foreground">Available in Phase 9</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
