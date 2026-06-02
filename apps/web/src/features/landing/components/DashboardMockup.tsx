import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const METRICS = [
  { label: 'Problems Solved', value: '142', color: 'bg-violet-500' },
  { label: 'Resume Score', value: '84', color: 'bg-emerald-500' },
  { label: 'Interview Score', value: '76', color: 'bg-blue-500' },
  { label: 'Readiness', value: '78%', color: 'bg-primary' },
];

export function DashboardMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative mx-auto w-full max-w-2xl perspective-[1200px]"
    >
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/30 via-violet-500/20 to-cyan-500/20 blur-2xl" />

      <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-card/80 shadow-2xl shadow-primary/10 backdrop-blur-xl dark:border-white/10 dark:bg-card/60">
        <div className="flex items-center gap-2 border-b border-border/50 bg-muted/30 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <span className="ml-2 text-xs text-muted-foreground">interviewgpt.dev/dashboard</span>
        </div>

        <div className="p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Welcome back</p>
              <p className="text-lg font-semibold">Placement Command Center</p>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3 w-3" />
              +12% this week
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {METRICS.map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="rounded-xl border border-border/50 bg-background/50 p-3"
              >
                <div className={`mb-2 h-1 w-8 rounded-full ${metric.color}`} />
                <p className="text-xl font-bold">{metric.value}</p>
                <p className="text-[10px] text-muted-foreground sm:text-xs">{metric.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-5">
            <div className="rounded-xl border border-border/50 bg-background/50 p-3 sm:col-span-3">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Weekly Activity</p>
              <div className="flex h-16 items-end gap-1">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.8 + i * 0.05, duration: 0.4 }}
                    className="flex-1 rounded-t bg-primary/60"
                  />
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-border/50 bg-background/50 p-3 sm:col-span-2">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Topic Progress</p>
              {['Arrays', 'Graphs', 'DP'].map((topic, i) => (
                <div key={topic} className="mb-2 last:mb-0">
                  <div className="mb-1 flex justify-between text-[10px]">
                    <span>{topic}</span>
                    <span className="text-muted-foreground">{[72, 45, 38][i]}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${[72, 45, 38][i]}%` }}
                      transition={{ delay: 1 + i * 0.1, duration: 0.5 }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
