import { Link } from 'react-router-dom';
import { Code2 } from 'lucide-react';
import type { DsaProgress } from '@interviewgpt/shared';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface DsaProgressWidgetProps {
  data: DsaProgress;
}

export function DsaProgressWidget({ data }: DsaProgressWidgetProps) {
  const pct = data.total > 0 ? Math.round((data.solved / data.total) * 100) : 0;

  return (
    <Card id="dsa" className="scroll-mt-24 border-border/60">
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-violet-500" />
            DSA Progress
          </CardTitle>
          <CardDescription>
            {data.solved} of {data.total} problems solved ({pct}%) · {data.acceptanceRate}%
            acceptance
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/dsa">Open Arena</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <Progress value={pct} className="h-2" />

        <div className="flex flex-wrap gap-2">
          <Badge variant="success">Easy: {data.easy}</Badge>
          <Badge variant="outline">Medium: {data.medium}</Badge>
          <Badge variant="secondary">Hard: {data.hard}</Badge>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            By topic
          </p>
          {data.topicProgress.map((topic) => {
            const topicPct = topic.total > 0 ? (topic.solved / topic.total) * 100 : 0;
            return (
              <div key={topic.topic}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="capitalize">{topic.topic.replace(/_/g, ' ').toLowerCase()}</span>
                  <span>
                    {topic.solved}/{topic.total}
                  </span>
                </div>
                <Progress value={topicPct} className="h-1.5" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
