import type { SubmissionResult } from '@interviewgpt/shared';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatStatus, statusClass } from '../lib/dsa-utils';

interface TestResultsPanelProps {
  result: SubmissionResult | null;
  mode: 'run' | 'submit' | null;
}

export function TestResultsPanel({ result, mode }: TestResultsPanelProps) {
  if (!result) {
    return (
      <Card className="border-border/60">
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          Run against sample tests or submit for full evaluation. Use a custom test case to debug edge inputs.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          {mode === 'run' ? 'Run results' : 'Submission result'}
        </CardTitle>
        <p className={`text-sm font-semibold ${statusClass(result.status)}`}>
          {formatStatus(result.status)} · {result.passedTests}/{result.totalTests} passed
          {result.runtimeMs != null && ` · ${result.runtimeMs} ms`}
          {result.memoryKb != null && ` · ${result.memoryKb} KB`}
        </p>
        {result.errorMessage && (
          <pre className="mt-2 max-h-40 overflow-auto rounded bg-muted p-2 text-xs text-destructive whitespace-pre-wrap">
            {result.errorMessage}
          </pre>
        )}
      </CardHeader>
      {result.testResults && result.testResults.length > 0 && (
        <CardContent className="space-y-3 pt-0">
          {result.testResults.map((tc, i) => (
            <div
              key={i}
              className={`rounded-lg border p-3 text-xs ${
                tc.passed ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-rose-500/30 bg-rose-500/5'
              }`}
            >
              <div className="mb-2 flex items-center gap-2 font-medium">
                {tc.passed ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-rose-500" />
                )}
                Test case {i + 1}
                {tc.isHidden && (
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    hidden
                  </span>
                )}
                {tc.runtimeMs != null && (
                  <span className="ml-auto text-muted-foreground">{tc.runtimeMs} ms</span>
                )}
              </div>
              <div className="space-y-1 font-mono text-muted-foreground">
                <p>
                  <span className="font-sans font-medium text-foreground">Input:</span> {tc.input}
                </p>
                <p>
                  <span className="font-sans font-medium text-foreground">Expected:</span>{' '}
                  {tc.expectedOutput}
                </p>
                {tc.actualOutput !== undefined && (
                  <p>
                    <span className="font-sans font-medium text-foreground">Actual:</span>{' '}
                    {tc.actualOutput || '(empty)'}
                  </p>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
}
