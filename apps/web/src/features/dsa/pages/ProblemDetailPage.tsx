import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Loader2, Play, Send } from 'lucide-react';
import type { DsaLanguage, SubmissionResult } from '@interviewgpt/shared';
import { DashboardLayout } from '@/features/dashboard/layouts/DashboardLayout';
import {
  useProblem,
  useRunCode,
  useSubmitCode,
  useSubmissions,
} from '../hooks/useDsa';
import { CodeEditor } from '../components/CodeEditor';
import { TestResultsPanel } from '../components/TestResultsPanel';
import { SubmissionHistoryPanel } from '../components/SubmissionHistoryPanel';
import { HintsPanel } from '../components/HintsPanel';
import { EditorialPanel } from '../components/EditorialPanel';
import { ProblemNavigationBar } from '../components/ProblemNavigationBar';
import { CustomTestPanel } from '../components/CustomTestPanel';
import { LANGUAGE_OPTIONS, difficultyClass } from '../lib/dsa-utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type PanelTab = 'results' | 'history' | 'hints' | 'editorial';

function codeStorageKey(slug: string, lang: DsaLanguage) {
  return `dsa:code:${slug}:${lang}`;
}

export function ProblemDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: problem, isLoading, isError } = useProblem(slug);
  const { data: submissions = [], isLoading: subsLoading } = useSubmissions(slug);

  const [language, setLanguage] = useState<DsaLanguage>('PYTHON');
  const [sourceCode, setSourceCode] = useState('');
  const [runResult, setRunResult] = useState<SubmissionResult | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmissionResult | null>(null);
  const [activePanel, setActivePanel] = useState<PanelTab>('results');
  const [customInput, setCustomInput] = useState('');
  const [customExpected, setCustomExpected] = useState('');

  const runMutation = useRunCode(slug ?? '');
  const submitMutation = useSubmitCode(slug ?? '');

  useEffect(() => {
    if (!problem) return;

    const stored = localStorage.getItem(codeStorageKey(problem.slug, language));
    if (stored) {
      setSourceCode(stored);
      return;
    }

    const starter = problem.starterCode[language] ?? problem.starterCode.PYTHON ?? '';
    setSourceCode(starter);
  }, [problem, language]);

  useEffect(() => {
    if (!problem || !sourceCode) return;
    localStorage.setItem(codeStorageKey(problem.slug, language), sourceCode);
  }, [problem, language, sourceCode]);

  useEffect(() => {
    if (problem?.sampleTestCases[0]) {
      setCustomInput(problem.sampleTestCases[0].input);
      setCustomExpected(problem.sampleTestCases[0].expectedOutput);
    }
  }, [problem?.id]);

  const handleRun = async () => {
    if (!problem) return;
    setSubmitResult(null);
    setRunResult(null);
    const result = await runMutation.mutateAsync({
      language,
      sourceCode,
      ...(customInput.trim()
        ? { customInput: customInput.trim(), customExpectedOutput: customExpected.trim() || undefined }
        : {}),
    });
    setRunResult(result);
    setActivePanel('results');
  };

  const handleSubmit = async () => {
    if (!problem) return;
    setRunResult(null);
    setSubmitResult(null);
    const result = await submitMutation.mutateAsync({ language, sourceCode });
    setSubmitResult(result);
    setActivePanel('results');
  };

  const displayResult = submitResult ?? runResult;
  const resultMode = submitResult ? 'submit' : runResult ? 'run' : null;

  if (isLoading) {
    return (
      <DashboardLayout title="Loading…">
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !problem) {
    return (
      <DashboardLayout title="Problem">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Problem not found</p>
            <Button asChild className="mt-4">
              <Link to="/dsa">Back to problems</Link>
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const tabs: { id: PanelTab; label: string }[] = [
    { id: 'results', label: 'Results' },
    { id: 'history', label: 'Submissions' },
    { id: 'hints', label: 'Hints' },
    { id: 'editorial', label: 'Editorial' },
  ];

  return (
    <DashboardLayout title={problem.title}>
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dsa">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Problems
            </Link>
          </Button>
          <h1 className="text-xl font-bold">{problem.title}</h1>
          <span className={`text-sm font-semibold ${difficultyClass(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
          {problem.isSolved && (
            <Badge variant="success" className="gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Accepted
            </Badge>
          )}
          <span className="text-sm text-muted-foreground">
            {problem.acceptanceRate.toFixed(1)}% acceptance · {problem.attempts} attempts
          </span>
        </div>

        <ProblemNavigationBar navigation={problem.navigation} />

        <div className="flex flex-wrap gap-1">
          {problem.tags.map((t) => (
            <Badge key={t} variant="outline">
              {t}
            </Badge>
          ))}
          {problem.companies.map((c) => (
            <Badge key={c} variant="secondary">
              {c}
            </Badge>
          ))}
        </div>

        <div className="grid min-h-[calc(100vh-14rem)] gap-4 xl:grid-cols-2">
          <div className="space-y-4 overflow-auto">
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">Problem statement</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-sm leading-relaxed">
                {problem.fullDescription}
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">Examples</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {problem.examples.map((ex, i) => (
                  <div key={i} className="rounded-lg border border-border/50 bg-muted/30 p-4 text-sm">
                    <p className="font-medium">Example {i + 1}</p>
                    <p className="mt-2 font-mono text-xs">
                      <strong>Input:</strong> {ex.input}
                    </p>
                    <p className="font-mono text-xs">
                      <strong>Output:</strong> {ex.output}
                    </p>
                    {ex.explanation && (
                      <p className="mt-2 text-muted-foreground">{ex.explanation}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {problem.constraints && (
              <Card className="border-border/60">
                <CardHeader>
                  <CardTitle className="text-base">Constraints</CardTitle>
                </CardHeader>
                <CardContent className="whitespace-pre-wrap font-mono text-xs text-muted-foreground">
                  {problem.constraints}
                </CardContent>
              </Card>
            )}

            {problem.edgeCases.length > 0 && (
              <Card className="border-border/60">
                <CardHeader>
                  <CardTitle className="text-base">Edge cases</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {problem.edgeCases.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {problem.followUp && (
              <Card className="border-border/60">
                <CardHeader>
                  <CardTitle className="text-base">Follow-up</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{problem.followUp}</CardContent>
              </Card>
            )}

            {problem.sampleTestCases.length > 0 && (
              <Card className="border-border/60">
                <CardHeader>
                  <CardTitle className="text-base">Sample test cases</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 font-mono text-xs">
                  {problem.sampleTestCases.map((tc, i) => (
                    <div key={i} className="rounded bg-muted/40 p-2">
                      <p>Input: {tc.input}</p>
                      <p>Expected: {tc.expectedOutput}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <select
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                value={language}
                onChange={(e) => setLanguage(e.target.value as DsaLanguage)}
              >
                {LANGUAGE_OPTIONS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
              <Button
                variant="outline"
                size="sm"
                disabled={runMutation.isPending}
                onClick={() => void handleRun()}
              >
                {runMutation.isPending ? (
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                ) : (
                  <Play className="mr-1 h-4 w-4" />
                )}
                Run
              </Button>
              <Button size="sm" disabled={submitMutation.isPending} onClick={() => void handleSubmit()}>
                {submitMutation.isPending ? (
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-1 h-4 w-4" />
                )}
                Submit
              </Button>
            </div>

            <div className="min-h-[360px] flex-1">
              <CodeEditor language={language} value={sourceCode} onChange={setSourceCode} />
            </div>

            <CustomTestPanel
              customInput={customInput}
              customExpected={customExpected}
              onInputChange={setCustomInput}
              onExpectedChange={setCustomExpected}
            />

            <div className="flex gap-1 border-b border-border/60 text-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`border-b-2 px-3 py-2 transition-colors ${
                    activePanel === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setActivePanel(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activePanel === 'results' && (
              <TestResultsPanel result={displayResult} mode={resultMode} />
            )}
            {activePanel === 'history' && (
              <SubmissionHistoryPanel submissions={submissions} loading={subsLoading} />
            )}
            {activePanel === 'hints' && <HintsPanel hints={problem.hints} />}
            {activePanel === 'editorial' && <EditorialPanel editorial={problem.editorial} />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
