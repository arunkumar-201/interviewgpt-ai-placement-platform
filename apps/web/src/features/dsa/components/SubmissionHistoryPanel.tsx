import type { SubmissionHistoryItem } from '@interviewgpt/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatStatus, statusClass } from '../lib/dsa-utils';

interface SubmissionHistoryPanelProps {
  submissions: SubmissionHistoryItem[];
  loading?: boolean;
}

export function SubmissionHistoryPanel({ submissions, loading }: SubmissionHistoryPanelProps) {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-base">Submission history</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {!loading && submissions.length === 0 && (
          <p className="text-sm text-muted-foreground">No submissions yet.</p>
        )}
        <ul className="space-y-2">
          {submissions.map((s) => (
            <li
              key={s.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/40 px-3 py-2 text-sm"
            >
              <span className={`font-medium ${statusClass(s.status)}`}>
                {formatStatus(s.status)}
              </span>
              <span className="text-muted-foreground">{s.language}</span>
              <span className="text-muted-foreground">
                {s.passedTests}/{s.totalTests}
                {s.runtimeMs != null && ` · ${s.runtimeMs}ms`}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(s.createdAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
