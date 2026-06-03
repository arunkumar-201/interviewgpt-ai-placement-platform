import { Link } from 'react-router-dom';
import { History } from 'lucide-react';
import type { RecentSubmission } from '@interviewgpt/shared';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatStatus, statusClass } from '@/features/dsa/lib/dsa-utils';

interface RecentSubmissionsWidgetProps {
  submissions: RecentSubmission[];
}

export function RecentSubmissionsWidget({ submissions }: RecentSubmissionsWidgetProps) {
  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="h-5 w-5 text-violet-500" />
            Recent submissions
          </CardTitle>
          <CardDescription>Latest DSA runs and submits</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/dsa">Arena</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {submissions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No submissions yet.{' '}
            <Link to="/dsa" className="text-primary hover:underline">
              Start solving
            </Link>
          </p>
        ) : (
          <ul className="space-y-2">
            {submissions.map((s) => (
              <li key={s.id}>
                <Link
                  to={`/dsa/${s.problemSlug}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/40 px-3 py-2 text-sm transition-colors hover:bg-muted/50"
                >
                  <span className="font-medium">{s.problemTitle}</span>
                  <span className={`text-xs ${statusClass(s.status)}`}>
                    {formatStatus(s.status)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {s.language}
                    {s.runtimeMs != null && ` · ${s.runtimeMs}ms`}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
