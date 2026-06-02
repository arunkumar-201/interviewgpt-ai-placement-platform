import {
  Code2,
  FileText,
  Github,
  MessageSquare,
  RefreshCw,
} from 'lucide-react';
import type { ActivityItem } from '@interviewgpt/shared';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const ACTIVITY_ICONS: Record<string, typeof Code2> = {
  DSA_SUBMISSION: Code2,
  RESUME_ANALYSIS: FileText,
  INTERVIEW_COMPLETED: MessageSquare,
  GITHUB_SYNC: Github,
  LEETCODE_SYNC: RefreshCw,
  READINESS_UPDATED: RefreshCw,
};

interface ActivityTimelineProps {
  activities: ActivityItem[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
        <CardDescription>Your recent preparation activity</CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No activity yet. Start practicing to see your timeline.
          </p>
        ) : (
          <ul className="relative space-y-0">
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />
            {activities.map((activity, index) => {
              const Icon = ACTIVITY_ICONS[activity.type] ?? RefreshCw;
              return (
                <li key={activity.id} className="relative flex gap-4 pb-6 last:pb-0">
                  <div
                    className={cn(
                      'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-background',
                      index === 0 && 'border-primary bg-primary/10',
                    )}
                  >
                    <Icon className={cn('h-3.5 w-3.5', index === 0 && 'text-primary')} />
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium leading-none">{activity.title}</p>
                    {activity.description && (
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {activity.description}
                      </p>
                    )}
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
