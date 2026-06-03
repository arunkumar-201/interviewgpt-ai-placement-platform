export interface DashboardMetrics {
  placementReadiness: number;
  problemsSolved: number;
  resumeScore: number;
  interviewScore: number;
  githubScore: number;
  leetcodeScore: number;
}

export interface ReadinessBreakdown {
  dsa: number;
  resume: number;
  interview: number;
  github: number;
  leetcode: number;
}

export interface TopicProgress {
  topic: string;
  solved: number;
  total: number;
}

export interface WeeklyActivityPoint {
  date: string;
  count: number;
}

export interface DsaProgress {
  solved: number;
  total: number;
  easy: number;
  medium: number;
  hard: number;
  acceptanceRate: number;
  topicProgress: TopicProgress[];
  weeklyActivity: WeeklyActivityPoint[];
}

export interface LeetCodeAnalytics {
  username: string;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalSolved: number;
  contestRating: number | null;
  acceptanceRate: number | null;
  topicProgress: Record<string, number>;
}

export interface GitHubAnalytics {
  username: string;
  score: number;
  totalRepos: number;
  totalStars: number;
  totalCommits: number;
  weeklyContributions: number[];
}

export interface ResumeSummary {
  atsScore: number;
  fileName: string | null;
  analyzedAt: string;
}

export interface InterviewHistoryItem {
  id: string;
  type: string;
  company: string;
  score: number | null;
  status: string;
  completedAt: string | null;
}

export interface CompanyReadinessItem {
  slug: string;
  name: string;
  readiness: number;
  questionsTotal: number;
  bookmarks: number;
}

export interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string | null;
  createdAt: string;
}

export interface UpcomingTask {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  module: string;
}

export interface PerformanceCharts {
  weeklyActivity: { date: string; dsa: number; interviews: number }[];
  readinessTrend: { date: string; score: number }[];
  skillScores: { skill: string; score: number }[];
}

export interface DashboardProfile {
  name: string;
  email: string;
  avatarUrl: string | null;
  role: string;
  college: string | null;
  targetRole: string | null;
  graduationYear: number | null;
}

export interface RecentSubmission {
  id: string;
  problemTitle: string;
  problemSlug: string;
  status: string;
  language: string;
  runtimeMs: number | null;
  createdAt: string;
}

export interface DashboardData {
  profile: DashboardProfile;
  metrics: DashboardMetrics;
  readinessBreakdown: ReadinessBreakdown;
  dsaProgress: DsaProgress;
  recentSubmissions: RecentSubmission[];
  leetcode: LeetCodeAnalytics | null;
  github: GitHubAnalytics | null;
  resume: ResumeSummary | null;
  interviews: InterviewHistoryItem[];
  companyReadiness: CompanyReadinessItem[];
  activities: ActivityItem[];
  upcomingTasks: UpcomingTask[];
  charts: PerformanceCharts;
}
