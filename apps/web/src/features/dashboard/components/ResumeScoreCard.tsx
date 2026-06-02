import { FileText, Upload } from 'lucide-react';
import type { ResumeSummary } from '@interviewgpt/shared';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface ResumeScoreCardProps {
  data: ResumeSummary | null;
}

export function ResumeScoreCard({ data }: ResumeScoreCardProps) {
  return (
    <Card id="resume" className="scroll-mt-24 border-border/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-emerald-500" />
          Resume Score
        </CardTitle>
        <CardDescription>ATS compatibility and keyword analysis</CardDescription>
      </CardHeader>
      <CardContent>
        {data ? (
          <div className="space-y-4">
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold">{data.atsScore}</span>
              <span className="mb-2 text-muted-foreground">/ 100 ATS</span>
            </div>
            <Progress value={data.atsScore} className="h-2" />
            {data.fileName && (
              <p className="truncate text-sm text-muted-foreground">{data.fileName}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Last analyzed {new Date(data.analyzedAt).toLocaleDateString()}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <div className="rounded-full bg-muted p-4">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Upload your resume for ATS scoring</p>
            <Button variant="outline" size="sm" disabled>
              Analyze Resume
            </Button>
            <span className="text-xs text-muted-foreground">Available in Phase 6</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
