import { MessageSquare } from 'lucide-react';
import type { InterviewHistoryItem } from '@interviewgpt/shared';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface InterviewHistoryProps {
  interviews: InterviewHistoryItem[];
}

export function InterviewHistory({ interviews }: InterviewHistoryProps) {
  return (
    <Card id="interview" className="scroll-mt-24 border-border/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-500" />
          Mock Interview History
        </CardTitle>
        <CardDescription>Recent AI interview sessions</CardDescription>
      </CardHeader>
      <CardContent>
        {interviews.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No interviews yet. Start a mock session to see history here.
          </p>
        ) : (
          <ul className="space-y-3">
            {interviews.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/30"
              >
                <div>
                  <p className="font-medium">{item.company}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.type} · {item.status}
                  </p>
                </div>
                <div className="text-right">
                  {item.score != null ? (
                    <span className="text-lg font-bold text-primary">{item.score}%</span>
                  ) : (
                    <Badge variant="outline">In progress</Badge>
                  )}
                  {item.completedAt && (
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(item.completedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
