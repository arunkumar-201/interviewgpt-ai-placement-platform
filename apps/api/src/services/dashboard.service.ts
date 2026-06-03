import { READINESS_WEIGHTS } from '@interviewgpt/shared';
import type {
  DashboardData,
  ReadinessBreakdown,
  UpcomingTask,
} from '@interviewgpt/shared';
import { prisma } from '../lib/prisma.js';
import { redis } from '../lib/redis.js';
import { NotFoundError } from '../errors/app.error.js';

const CACHE_TTL_SECONDS = 300;
const CACHE_PREFIX = 'dashboard:';

export class DashboardService {
  async getDashboard(userId: string): Promise<DashboardData> {
    const cacheKey = `${CACHE_PREFIX}${userId}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached) as DashboardData;
    }

    const data = await this.buildDashboard(userId);
    await redis.setex(cacheKey, CACHE_TTL_SECONDS, JSON.stringify(data));

    return data;
  }

  private async buildDashboard(userId: string): Promise<DashboardData> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        problemProgress: { where: { isSolved: true } },
        resumeAnalyses: { orderBy: { createdAt: 'desc' }, take: 1 },
        interviewSessions: {
          orderBy: { startedAt: 'desc' },
          take: 5,
          include: { company: true },
        },
        githubAnalyses: { orderBy: { analyzedAt: 'desc' }, take: 1 },
        leetcodeProfile: true,
        activities: { orderBy: { createdAt: 'desc' }, take: 10 },
        readinessSnapshots: { orderBy: { calculatedAt: 'desc' }, take: 7 },
        bookmarks: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const problemsSolved = user.problemProgress.length;
    const totalProblems = await prisma.dsaProblem.count({ where: { isPublished: true } });

    const resumeScore = user.resumeAnalyses[0]?.atsScore ?? 0;
    const githubScore = user.githubAnalyses[0]?.score ?? 0;

    const completedInterviews = user.interviewSessions.filter(
      (s) => s.status === 'COMPLETED' && s.overallScore != null,
    );
    const interviewScore =
      completedInterviews.length > 0
        ? Math.round(
            completedInterviews.reduce((sum, s) => sum + (s.overallScore ?? 0), 0) /
              completedInterviews.length,
          )
        : 0;

    const leetcodeScore = user.leetcodeProfile
      ? Math.min(
          100,
          Math.round(
            (user.leetcodeProfile.easySolved * 1 +
              user.leetcodeProfile.mediumSolved * 2 +
              user.leetcodeProfile.hardSolved * 3) /
              3,
          ),
        )
      : 0;

    const dsaScore = totalProblems > 0 ? Math.round((problemsSolved / totalProblems) * 100) : 0;

    const readinessBreakdown: ReadinessBreakdown = {
      dsa: user.readinessSnapshots[0]?.dsaScore ?? dsaScore,
      resume: user.readinessSnapshots[0]?.resumeScore ?? resumeScore,
      interview: user.readinessSnapshots[0]?.interviewScore ?? interviewScore,
      github: user.readinessSnapshots[0]?.githubScore ?? githubScore,
      leetcode: user.readinessSnapshots[0]?.leetcodeScore ?? leetcodeScore,
    };

    const placementReadiness =
      user.readinessSnapshots[0]?.overallScore ??
      Math.round(
        readinessBreakdown.dsa * READINESS_WEIGHTS.dsa +
          readinessBreakdown.resume * READINESS_WEIGHTS.resume +
          readinessBreakdown.interview * READINESS_WEIGHTS.interview +
          readinessBreakdown.github * READINESS_WEIGHTS.github +
          readinessBreakdown.leetcode * READINESS_WEIGHTS.leetcode,
      );

    const weeklyActivity = await this.getWeeklySubmissionActivity(userId);
    const topicProgress = await this.getTopicProgress(userId);

    const [submissionTotal, submissionAccepted, recentSubmissionRows] = await Promise.all([
      prisma.submission.count({ where: { userId } }),
      prisma.submission.count({ where: { userId, status: 'ACCEPTED' } }),
      prisma.submission.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { problem: { select: { title: true, slug: true } } },
      }),
    ]);

    const dsaAcceptanceRate =
      submissionTotal > 0 ? Math.round((submissionAccepted / submissionTotal) * 1000) / 10 : 0;

    const recentSubmissions = recentSubmissionRows.map((s) => ({
      id: s.id,
      problemTitle: s.problem.title,
      problemSlug: s.problem.slug,
      status: s.status,
      language: s.language,
      runtimeMs: s.runtimeMs,
      createdAt: s.createdAt.toISOString(),
    }));

    const companies = await prisma.company.findMany({
      where: { isActive: true },
      include: { _count: { select: { questions: true } } },
      take: 8,
    });

    const companyReadiness = companies.map((company) => {
      const bookmarkCount = user.bookmarks.length;
      const base = placementReadiness;
      const variance = (company.slug.charCodeAt(0) % 15) - 7;
      return {
        slug: company.slug,
        name: company.name,
        readiness: Math.max(0, Math.min(100, base + variance)),
        questionsTotal: company._count.questions,
        bookmarks: Math.min(bookmarkCount, company._count.questions),
      };
    });

    const upcomingTasks = this.buildUpcomingTasks({
      problemsSolved,
      resumeScore,
      interviewScore,
      githubScore,
      leetcodeLinked: Boolean(user.leetcodeProfile),
      githubLinked: Boolean(user.githubAnalyses[0]),
    });

    const readinessTrend =
      user.readinessSnapshots.length > 0
        ? user.readinessSnapshots
            .slice()
            .reverse()
            .map((s) => ({
              date: s.calculatedAt.toISOString().split('T')[0],
              score: s.overallScore,
            }))
        : this.generateReadinessTrend(placementReadiness);

    const githubAnalysis = user.githubAnalyses[0];
    const contributionData = githubAnalysis?.contributionData as
      | { weekly?: number[] }
      | number[]
      | null;

    let weeklyContributions: number[] = [0, 0, 0, 0, 0, 0, 0];
    if (Array.isArray(contributionData)) {
      weeklyContributions = contributionData.slice(-7);
    } else if (contributionData?.weekly) {
      weeklyContributions = contributionData.weekly.slice(-7);
    }

    return {
      profile: {
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        role: user.role,
        college: user.profile?.college ?? null,
        targetRole: user.profile?.targetRole ?? 'SDE-1',
        graduationYear: user.profile?.graduationYear ?? null,
      },
      metrics: {
        placementReadiness,
        problemsSolved,
        resumeScore,
        interviewScore,
        githubScore,
        leetcodeScore,
      },
      readinessBreakdown,
      dsaProgress: {
        solved: problemsSolved,
        total: totalProblems || 20,
        easy: await this.countSolvedByDifficulty(userId, 'EASY'),
        medium: await this.countSolvedByDifficulty(userId, 'MEDIUM'),
        hard: await this.countSolvedByDifficulty(userId, 'HARD'),
        acceptanceRate: dsaAcceptanceRate,
        topicProgress,
        weeklyActivity,
      },
      recentSubmissions,
      leetcode: user.leetcodeProfile
        ? {
            username: user.leetcodeProfile.username,
            easySolved: user.leetcodeProfile.easySolved,
            mediumSolved: user.leetcodeProfile.mediumSolved,
            hardSolved: user.leetcodeProfile.hardSolved,
            totalSolved: user.leetcodeProfile.totalSolved,
            contestRating: user.leetcodeProfile.contestRating,
            acceptanceRate: user.leetcodeProfile.acceptanceRate,
            topicProgress: (user.leetcodeProfile.topicProgress as Record<string, number>) ?? {},
          }
        : null,
      github: githubAnalysis
        ? {
            username: githubAnalysis.githubUsername,
            score: githubAnalysis.score,
            totalRepos: githubAnalysis.totalRepos,
            totalStars: githubAnalysis.totalStars,
            totalCommits: githubAnalysis.totalCommits,
            weeklyContributions,
          }
        : user.profile?.githubUsername
          ? null
          : null,
      resume: user.resumeAnalyses[0]
        ? {
            atsScore: user.resumeAnalyses[0].atsScore,
            fileName: user.resumeAnalyses[0].fileName,
            analyzedAt: user.resumeAnalyses[0].createdAt.toISOString(),
          }
        : null,
      interviews: user.interviewSessions.map((session) => ({
        id: session.id,
        type: session.type,
        company: session.company.name,
        score: session.overallScore,
        status: session.status,
        completedAt: session.completedAt?.toISOString() ?? null,
      })),
      companyReadiness,
      activities: user.activities.map((a) => ({
        id: a.id,
        type: a.type,
        title: a.title,
        description: a.description,
        createdAt: a.createdAt.toISOString(),
      })),
      upcomingTasks,
      charts: {
        weeklyActivity: weeklyActivity.map((w) => ({
          date: w.date,
          dsa: w.count,
          interviews: 0,
        })),
        readinessTrend,
        skillScores: [
          { skill: 'DSA', score: readinessBreakdown.dsa },
          { skill: 'Resume', score: readinessBreakdown.resume },
          { skill: 'Interview', score: readinessBreakdown.interview },
          { skill: 'GitHub', score: readinessBreakdown.github },
          { skill: 'LeetCode', score: readinessBreakdown.leetcode },
        ],
      },
    };
  }

  private async getWeeklySubmissionActivity(userId: string): Promise<{ date: string; count: number }[]> {
    const days: { date: string; count: number }[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(day.getDate() - i);
      day.setHours(0, 0, 0, 0);
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);

      const count = await prisma.submission.count({
        where: {
          userId,
          createdAt: { gte: day, lt: nextDay },
        },
      });

      days.push({
        date: day.toISOString().split('T')[0],
        count,
      });
    }

    return days;
  }

  private async getTopicProgress(userId: string) {
    const topics = ['ARRAYS', 'STRINGS', 'LINKED_LISTS', 'TREES', 'GRAPHS', 'DP', 'GREEDY'] as const;

    const results = await Promise.all(
      topics.map(async (topic) => {
        const total = await prisma.dsaProblem.count({
          where: { topic, isPublished: true },
        });
        const solved = await prisma.userProblemProgress.count({
          where: {
            userId,
            isSolved: true,
            problem: { topic },
          },
        });
        return { topic, solved, total: total || 5 };
      }),
    );

    return results;
  }

  private async countSolvedByDifficulty(
    userId: string,
    difficulty: 'EASY' | 'MEDIUM' | 'HARD',
  ): Promise<number> {
    return prisma.userProblemProgress.count({
      where: {
        userId,
        isSolved: true,
        problem: { difficulty },
      },
    });
  }

  private generateReadinessTrend(currentScore: number) {
    const trend: { date: string; score: number }[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(day.getDate() - i);
      const variance = (6 - i) * 2;
      trend.push({
        date: day.toISOString().split('T')[0],
        score: Math.max(0, Math.min(100, currentScore - (6 - i) * 3 + variance)),
      });
    }

    trend[trend.length - 1].score = currentScore;
    return trend;
  }

  private buildUpcomingTasks(ctx: {
    problemsSolved: number;
    resumeScore: number;
    interviewScore: number;
    githubScore: number;
    leetcodeLinked: boolean;
    githubLinked: boolean;
  }): UpcomingTask[] {
    const tasks: UpcomingTask[] = [];

    if (ctx.problemsSolved < 5) {
      tasks.push({
        id: 'dsa-warmup',
        title: 'Solve 3 easy DSA problems',
        description: 'Build momentum in the coding arena',
        priority: 'high',
        module: 'DSA',
      });
    }

    if (ctx.resumeScore < 70) {
      tasks.push({
        id: 'resume-upload',
        title: 'Upload and analyze your resume',
        description: 'Get ATS score and keyword suggestions',
        priority: 'high',
        module: 'Resume',
      });
    }

    if (ctx.interviewScore < 1) {
      tasks.push({
        id: 'mock-interview',
        title: 'Complete a technical mock interview',
        description: 'Practice company-specific questions with AI',
        priority: 'medium',
        module: 'Interview',
      });
    }

    if (!ctx.githubLinked) {
      tasks.push({
        id: 'github-connect',
        title: 'Connect your GitHub profile',
        description: 'Unlock repository and contribution analytics',
        priority: 'medium',
        module: 'GitHub',
      });
    }

    if (!ctx.leetcodeLinked) {
      tasks.push({
        id: 'leetcode-link',
        title: 'Link your LeetCode username',
        description: 'Sync problem stats and topic progress',
        priority: 'low',
        module: 'LeetCode',
      });
    }

    tasks.push({
      id: 'company-bank',
      title: 'Bookmark 5 company questions',
      description: 'Prepare for your target recruiters',
      priority: 'low',
      module: 'Company Bank',
    });

    return tasks.slice(0, 5);
  }
}

export const dashboardService = new DashboardService();
