import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProblemNavigation } from '@interviewgpt/shared';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { difficultyClass } from '../lib/dsa-utils';

interface ProblemNavigationBarProps {
  navigation: ProblemNavigation;
}

export function ProblemNavigationBar({ navigation }: ProblemNavigationBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={!navigation.prev} asChild={Boolean(navigation.prev)}>
          {navigation.prev ? (
            <Link to={`/dsa/${navigation.prev.slug}`}>
              <ChevronLeft className="mr-1 h-4 w-4" />
              {navigation.prev.title}
            </Link>
          ) : (
            <span>
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </span>
          )}
        </Button>
        <Button variant="outline" size="sm" disabled={!navigation.next} asChild={Boolean(navigation.next)}>
          {navigation.next ? (
            <Link to={`/dsa/${navigation.next.slug}`}>
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          ) : (
            <span>
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </span>
          )}
        </Button>
      </div>
      {navigation.related.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Related:</span>
          {navigation.related.map((p) => (
            <Link key={p.slug} to={`/dsa/${p.slug}`}>
              <Badge variant="outline" className={`hover:bg-muted ${difficultyClass(p.difficulty)}`}>
                {p.title}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
