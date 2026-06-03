import type { ProblemEditorial } from '@interviewgpt/shared';
import { BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EditorialPanelProps {
  editorial: ProblemEditorial | null;
}

export function EditorialPanel({ editorial }: EditorialPanelProps) {
  if (!editorial) {
    return (
      <Card className="border-border/60">
        <CardContent className="py-6 text-sm text-muted-foreground">
          Editorial not available for this problem yet.
        </CardContent>
      </Card>
    );
  }

  const sections = [
    { title: 'Brute force', body: editorial.bruteForce },
    { title: 'Better approach', body: editorial.better },
    { title: 'Optimal solution', body: editorial.optimal },
  ];

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <BookOpen className="h-4 w-4" />
          Editorial
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {sections.map((s) => (
          <div key={s.title}>
            <h4 className="mb-1 font-semibold">{s.title}</h4>
            <p className="text-muted-foreground">{s.body}</p>
          </div>
        ))}
        <div className="flex flex-wrap gap-4 rounded-lg bg-muted/40 p-3 text-xs">
          <span>
            <strong>Time:</strong> {editorial.timeComplexity}
          </span>
          <span>
            <strong>Space:</strong> {editorial.spaceComplexity}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
