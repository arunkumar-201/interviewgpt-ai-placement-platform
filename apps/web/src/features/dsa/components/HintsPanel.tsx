import { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface HintsPanelProps {
  hints: string[];
}

export function HintsPanel({ hints }: HintsPanelProps) {
  const [revealed, setRevealed] = useState(0);

  if (hints.length === 0) {
    return (
      <Card className="border-border/60">
        <CardContent className="py-6 text-sm text-muted-foreground">No hints for this problem.</CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          Hints
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {hints.slice(0, revealed).map((hint, i) => (
          <div key={i} className="rounded-lg border border-border/50 bg-muted/30 p-3 text-sm">
            <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">Hint {i + 1}</p>
            <p>{hint}</p>
          </div>
        ))}
        {revealed < hints.length && (
          <Button variant="outline" size="sm" onClick={() => setRevealed((r) => r + 1)}>
            Reveal hint {revealed + 1}
          </Button>
        )}
        {revealed >= hints.length && (
          <p className="text-xs text-muted-foreground">All hints revealed.</p>
        )}
      </CardContent>
    </Card>
  );
}
