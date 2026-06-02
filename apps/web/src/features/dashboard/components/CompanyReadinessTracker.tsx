import { Building2 } from 'lucide-react';
import type { CompanyReadinessItem } from '@interviewgpt/shared';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface CompanyReadinessTrackerProps {
  companies: CompanyReadinessItem[];
}

export function CompanyReadinessTracker({ companies }: CompanyReadinessTrackerProps) {
  return (
    <Card id="companies" className="scroll-mt-24 border-border/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          Company Readiness
        </CardTitle>
        <CardDescription>Preparation level per target company</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {companies.map((company) => (
          <div key={company.slug} className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{company.name}</p>
                <p className="text-xs text-muted-foreground">
                  {company.questionsTotal} questions · {company.bookmarks} bookmarked
                </p>
              </div>
              <span className="text-sm font-semibold text-primary">{company.readiness}%</span>
            </div>
            <Progress value={company.readiness} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
