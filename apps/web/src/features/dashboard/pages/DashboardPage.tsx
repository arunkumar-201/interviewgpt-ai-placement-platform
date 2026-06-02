import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { useDashboard } from '../hooks/useDashboard';
import { DashboardSkeleton } from '../components/DashboardSkeleton';
import { ProfileCard } from '../components/ProfileCard';
import { ReadinessScoreCard } from '../components/ReadinessScoreCard';
import { MetricCards } from '../components/MetricCards';
import { DsaProgressWidget } from '../components/DsaProgressWidget';
import { LeetCodeAnalytics } from '../components/LeetCodeAnalytics';
import { GitHubAnalytics } from '../components/GitHubAnalytics';
import { ResumeScoreCard } from '../components/ResumeScoreCard';
import { InterviewHistory } from '../components/InterviewHistory';
import { CompanyReadinessTracker } from '../components/CompanyReadinessTracker';
import { ActivityTimeline } from '../components/ActivityTimeline';
import { UpcomingTasks } from '../components/UpcomingTasks';
import { PerformanceCharts } from '../components/PerformanceCharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function DashboardPage() {
  const { data, isLoading, isError, refetch } = useDashboard();

  return (
    <DashboardLayout title="Placement Dashboard">
      {isLoading && <DashboardSkeleton />}

      {isError && (
        <Card className="border-destructive/50">
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <p className="text-center text-muted-foreground">Failed to load dashboard data</p>
            <Button onClick={() => refetch()}>Retry</Button>
          </CardContent>
        </Card>
      )}

      {data && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-auto max-w-7xl space-y-6"
        >
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <ProfileCard profile={data.profile} />
            </div>
            <div className="lg:col-span-2">
              <ReadinessScoreCard metrics={data.metrics} breakdown={data.readinessBreakdown} />
            </div>
          </div>

          <MetricCards metrics={data.metrics} />

          <PerformanceCharts charts={data.charts} />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <DsaProgressWidget data={data.dsaProgress} />
              <InterviewHistory interviews={data.interviews} />
              <CompanyReadinessTracker companies={data.companyReadiness} />
            </div>
            <div className="space-y-6">
              <UpcomingTasks tasks={data.upcomingTasks} />
              <ResumeScoreCard data={data.resume} />
              <LeetCodeAnalytics data={data.leetcode} />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <GitHubAnalytics data={data.github} />
            <ActivityTimeline activities={data.activities} />
          </div>
        </motion.div>
      )}
    </DashboardLayout>
  );
}
