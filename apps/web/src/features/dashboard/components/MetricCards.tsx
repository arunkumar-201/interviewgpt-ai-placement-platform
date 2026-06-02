import { motion } from 'framer-motion';
import { Code2, FileText, Github, MessageSquare, Trophy } from 'lucide-react';
import type { DashboardMetrics } from '@interviewgpt/shared';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardsProps {
  metrics: DashboardMetrics;
}

const METRICS = [
  { key: 'problemsSolved' as const, label: 'Problems Solved', icon: Code2, color: 'text-violet-500' },
  { key: 'resumeScore' as const, label: 'Resume Score', icon: FileText, color: 'text-emerald-500' },
  { key: 'interviewScore' as const, label: 'Interview Score', icon: MessageSquare, color: 'text-blue-500' },
  { key: 'githubScore' as const, label: 'GitHub Score', icon: Github, color: 'text-slate-500 dark:text-slate-300' },
];

export function MetricCards({ metrics }: MetricCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {METRICS.map((item, index) => {
        const Icon = item.icon;
        const value = metrics[item.key];
        const suffix = item.key === 'problemsSolved' ? '' : '%';

        return (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <Card className="border-border/60 transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-5">
                <div className={cn('rounded-xl bg-muted/50 p-3', item.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {value}
                    {suffix}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="sm:col-span-2 xl:col-span-4 hidden"
      >
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <Trophy className="h-5 w-5 text-amber-500" />
            <span>LeetCode: {metrics.leetcodeScore}%</span>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
