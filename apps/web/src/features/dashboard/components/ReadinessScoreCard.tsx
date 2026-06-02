import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import type { DashboardMetrics, ReadinessBreakdown } from '@interviewgpt/shared';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ReadinessScoreCardProps {
  metrics: DashboardMetrics;
  breakdown: ReadinessBreakdown;
}

const BREAKDOWN_LABELS: { key: keyof ReadinessBreakdown; label: string }[] = [
  { key: 'dsa', label: 'DSA' },
  { key: 'resume', label: 'Resume' },
  { key: 'interview', label: 'Interview' },
  { key: 'github', label: 'GitHub' },
  { key: 'leetcode', label: 'LeetCode' },
];

export function ReadinessScoreCard({ metrics, breakdown }: ReadinessScoreCardProps) {
  const score = metrics.placementReadiness;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
      <Card className="h-full border-primary/20 bg-gradient-to-br from-primary/10 via-card to-violet-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Placement Readiness
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardTitle>
          <CardDescription>Weighted score across all preparation modules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="relative flex h-36 w-36 shrink-0 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted/30"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="url(#readinessGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${score * 2.64} 264`}
                />
                <defs>
                  <linearGradient id="readinessGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute text-center">
                <span className="text-4xl font-bold">{score}</span>
                <span className="block text-xs text-muted-foreground">/ 100</span>
              </div>
            </div>

            <div className="w-full flex-1 space-y-3">
              {BREAKDOWN_LABELS.map(({ key, label }) => (
                <div key={key}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">{breakdown[key]}%</span>
                  </div>
                  <Progress value={breakdown[key]} className="h-1.5" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
