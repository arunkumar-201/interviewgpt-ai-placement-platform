import { CheckCircle2, Circle } from 'lucide-react';
import type { UpcomingTask } from '@interviewgpt/shared';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface UpcomingTasksProps {
  tasks: UpcomingTask[];
}

const PRIORITY_STYLES = {
  high: 'border-red-500/30 bg-red-500/5',
  medium: 'border-amber-500/30 bg-amber-500/5',
  low: 'border-border/50',
};

export function UpcomingTasks({ tasks }: UpcomingTasksProps) {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle>Upcoming Tasks</CardTitle>
        <CardDescription>Recommended actions to boost readiness</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={cn(
              'flex gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/20',
              PRIORITY_STYLES[task.priority],
            )}
          >
            <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium">{task.title}</p>
                <Badge variant="outline" className="text-[10px]">
                  {task.module}
                </Badge>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{task.description}</p>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-4 text-center">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            <p className="text-sm text-muted-foreground">You&apos;re all caught up!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
