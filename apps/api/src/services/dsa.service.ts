import {
  ActivityType,
  SubmissionStatus,
  SupportedLanguage,
  type Difficulty,
  type DsaTopic,
} from '@prisma/client';
import type {
  ListProblemsQuery,
  RunCodeInput,
  SubmitCodeInput,
  ProblemDetail,
  ProblemSummary,
  ProblemEditorial,
  SubmissionResult,
  SubmissionHistoryItem,
  PaginatedProblems,
} from '@interviewgpt/shared';
import { prisma } from '../lib/prisma.js';
import { redis } from '../lib/redis.js';
import { executionService } from './execution.service.js';
import { invalidateDashboardCache, invalidateProblemListCache } from '../lib/cache.js';
import { NotFoundError } from '../errors/app.error.js';
import { logger } from '../lib/logger.js';
import type { JudgeVerdict } from './judge0.service.js';

const PROBLEMS_CACHE_TTL = 120;

export class DsaService {
  async listProblems(userId: string, query: ListProblemsQuery): Promise<PaginatedProblems> {
    const cacheKey = `dsa:problems:${JSON.stringify({ ...query, userId })}`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached) as PaginatedProblems;

    const where: {
      isPublished: boolean;
      difficulty?: Difficulty;
      topic?: DsaTopic;
      tags?: { has: string };
      OR?: Array<{ title?: { contains: string; mode: 'insensitive' }; slug?: { contains: string; mode: 'insensitive' } }>;
    } = { isPublished: true };

    if (query.difficulty) where.difficulty = query.difficulty;
    if (query.topic) where.topic = query.topic;
    if (query.tag) where.tags = { has: query.tag };
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { slug: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [total, problems, solvedRows] = await Promise.all([
      prisma.dsaProblem.count({ where }),
      prisma.dsaProblem.findMany({
        where,
        orderBy: [{ orderIndex: 'asc' }, { difficulty: 'asc' }, { title: 'asc' }],
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        select: {
          id: true,
          slug: true,
          title: true,
          difficulty: true,
          topic: true,
          tags: true,
          companies: true,
          acceptanceRate: true,
        },
      }),
      prisma.userProblemProgress.findMany({
        where: { userId, isSolved: true },
        select: { problemId: true },
      }),
    ]);

    const solvedSet = new Set(solvedRows.map((r) => r.problemId));

    let data: ProblemSummary[] = problems.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      difficulty: p.difficulty,
      topic: p.topic,
      tags: p.tags,
      companies: p.companies,
      acceptanceRate: p.acceptanceRate,
      isSolved: solvedSet.has(p.id),
    }));

    if (query.status === 'solved') {
      data = data.filter((p) => p.isSolved);
    } else if (query.status === 'unsolved') {
      data = data.filter((p) => !p.isSolved);
    }

    const result: PaginatedProblems = {
      data,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
        solvedCount: solvedSet.size,
      },
    };

    await redis.setex(cacheKey, PROBLEMS_CACHE_TTL, JSON.stringify(result));
    return result;
  }

  async getProblemBySlug(slug: string, userId: string): Promise<ProblemDetail> {
    const problem = await prisma.dsaProblem.findUnique({
      where: { slug, isPublished: true },
      include: {
        testCases: { where: { isHidden: false }, orderBy: { order: 'asc' } },
      },
    });

    if (!problem) throw new NotFoundError('Problem not found');

    const [progress, neighbors, related] = await Promise.all([
      prisma.userProblemProgress.findUnique({
        where: { userId_problemId: { userId, problemId: problem.id } },
      }),
      this.getNeighbors(problem.orderIndex),
      this.getRelatedProblems(problem.relatedSlugs),
    ]);

    return {
      id: problem.id,
      slug: problem.slug,
      title: problem.title,
      description: problem.description,
      fullDescription: problem.fullDescription ?? problem.description,
      difficulty: problem.difficulty,
      topic: problem.topic,
      tags: problem.tags,
      companies: problem.companies,
      constraints: problem.constraints,
      examples: problem.examples as unknown as ProblemDetail['examples'],
      edgeCases: (problem.edgeCases as string[]) ?? [],
      hints: (problem.hints as string[]) ?? [],
      followUp: problem.followUp,
      starterCode: problem.starterCode as Record<string, string>,
      editorial: problem.editorial as unknown as ProblemEditorial | null,
      acceptanceRate: problem.acceptanceRate,
      timeLimitMs: problem.timeLimitMs,
      memoryLimitMb: problem.memoryLimitMb,
      isSolved: progress?.isSolved ?? false,
      attempts: progress?.attempts ?? 0,
      sampleTestCases: problem.testCases.map((tc) => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
      })),
      navigation: {
        prev: neighbors.prev,
        next: neighbors.next,
        related,
      },
    };
  }

  async runCodeBySlug(userId: string, slug: string, input: RunCodeInput): Promise<SubmissionResult> {
    const problem = await this.requirePublishedProblem(slug);
    return this.runCode(userId, problem.id, input);
  }

  async submitCodeBySlug(
    userId: string,
    slug: string,
    input: SubmitCodeInput,
  ): Promise<SubmissionResult> {
    const problem = await this.requirePublishedProblem(slug);
    return this.submitCode(userId, problem.id, input);
  }

  async getSubmissionsBySlug(userId: string, slug: string): Promise<SubmissionHistoryItem[]> {
    const problem = await this.requirePublishedProblem(slug);
    return this.getSubmissions(userId, problem.id);
  }

  private async requirePublishedProblem(slug: string) {
    const problem = await prisma.dsaProblem.findUnique({
      where: { slug, isPublished: true },
      select: { id: true, slug: true },
    });
    if (!problem) throw new NotFoundError('Problem not found');
    return problem;
  }

  async runCode(userId: string, problemId: string, input: RunCodeInput): Promise<SubmissionResult> {
    const problem = await prisma.dsaProblem.findUnique({
      where: { id: problemId, isPublished: true },
      include: { testCases: { where: { isHidden: false }, orderBy: { order: 'asc' } } },
    });

    if (!problem) throw new NotFoundError('Problem not found');

    const testCases = problem.testCases.map((tc) => ({
      input: tc.input,
      expectedOutput: tc.expectedOutput,
    }));

    if (input.customInput !== undefined) {
      testCases.push({
        input: input.customInput,
        expectedOutput: input.customExpectedOutput ?? '',
      });
    }

    logger.info('dsa.runCode', { userId, problemId, language: input.language, testCount: testCases.length });

    return this.execute(userId, problem.id, input, testCases, problem.timeLimitMs, problem.memoryLimitMb, false);
  }

  async submitCode(
    userId: string,
    problemId: string,
    input: SubmitCodeInput,
  ): Promise<SubmissionResult> {
    const problem = await prisma.dsaProblem.findUnique({
      where: { id: problemId, isPublished: true },
      include: { testCases: { orderBy: { order: 'asc' } } },
    });

    if (!problem) throw new NotFoundError('Problem not found');

    logger.info('dsa.submitCode', { userId, problemId, language: input.language });

    const result = await this.execute(
      userId,
      problem.id,
      input,
      problem.testCases.map((tc) => ({ input: tc.input, expectedOutput: tc.expectedOutput })),
      problem.timeLimitMs,
      problem.memoryLimitMb,
      true,
    );

    await this.updateAcceptanceRate(problemId);
    await invalidateDashboardCache(userId);
    await invalidateProblemListCache();

    return result;
  }

  async getSubmissions(userId: string, problemId: string): Promise<SubmissionHistoryItem[]> {
    const submissions = await prisma.submission.findMany({
      where: { userId, problemId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return submissions.map((s) => ({
      id: s.id,
      language: s.language as SubmissionHistoryItem['language'],
      status: s.status as SubmissionHistoryItem['status'],
      runtimeMs: s.runtimeMs,
      memoryKb: s.memoryKb,
      passedTests: s.passedTests,
      totalTests: s.totalTests,
      createdAt: s.createdAt.toISOString(),
    }));
  }

  private async getNeighbors(orderIndex: number) {
    const [prev, next] = await Promise.all([
      prisma.dsaProblem.findFirst({
        where: { isPublished: true, orderIndex: { lt: orderIndex } },
        orderBy: { orderIndex: 'desc' },
        select: { slug: true, title: true },
      }),
      prisma.dsaProblem.findFirst({
        where: { isPublished: true, orderIndex: { gt: orderIndex } },
        orderBy: { orderIndex: 'asc' },
        select: { slug: true, title: true },
      }),
    ]);

    return { prev, next };
  }

  private async getRelatedProblems(slugs: string[]) {
    if (slugs.length === 0) return [];
    const rows = await prisma.dsaProblem.findMany({
      where: { slug: { in: slugs }, isPublished: true },
      select: { slug: true, title: true, difficulty: true },
    });
    const map = new Map(rows.map((r) => [r.slug, r]));
    return slugs.map((slug) => map.get(slug)).filter(Boolean) as {
      slug: string;
      title: string;
      difficulty: string;
    }[];
  }

  private async execute(
    userId: string,
    problemId: string,
    input: SubmitCodeInput,
    testCases: { input: string; expectedOutput: string }[],
    timeLimitMs: number,
    memoryLimitMb: number,
    persist: boolean,
  ): Promise<SubmissionResult> {
    const language = input.language as SupportedLanguage;
    const action = persist ? 'submit' : 'run';

    const submission = await prisma.submission.create({
      data: {
        userId,
        problemId,
        language,
        sourceCode: input.sourceCode,
        status: SubmissionStatus.PENDING,
        totalTests: testCases.length,
      },
    });

    let verdicts: JudgeVerdict[];
    try {
      verdicts = await executionService.runTests(
        input.sourceCode,
        language,
        testCases,
        timeLimitMs,
        memoryLimitMb,
        { action, problemId, userId },
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Judge execution failed';
      logger.error('dsa.execute.failed', { action, problemId, userId, error: message });

      await prisma.submission.update({
        where: { id: submission.id },
        data: {
          status: SubmissionStatus.RUNTIME_ERROR,
          errorMessage: message,
        },
      });

      return {
        submissionId: submission.id,
        status: 'RUNTIME_ERROR',
        passedTests: 0,
        totalTests: testCases.length,
        runtimeMs: null,
        memoryKb: null,
        errorMessage: message,
      };
    }

    const passedTests = verdicts.filter((v) => v.passed).length;
    const overallStatus = this.resolveOverallStatus(verdicts);
    const maxRuntime = Math.max(...verdicts.map((v) => v.runtimeMs ?? 0));
    const maxMemory = Math.max(...verdicts.map((v) => v.memoryKb ?? 0));
    const firstError = verdicts.find((v) => !v.passed);

    await prisma.submission.update({
      where: { id: submission.id },
      data: {
        status: overallStatus,
        passedTests,
        runtimeMs: maxRuntime || null,
        memoryKb: maxMemory || null,
        errorMessage: firstError?.compileOutput || firstError?.stderr || null,
      },
    });

    if (persist) {
      await this.updateProgress(userId, problemId, overallStatus);
      if (overallStatus === SubmissionStatus.ACCEPTED) {
        await this.logActivity(userId, problemId);
      }
    }

    const problem = await prisma.dsaProblem.findUnique({
      where: { id: problemId },
      include: { testCases: { orderBy: { order: 'asc' } } },
    });

    const testResults = verdicts.map((v, i) => ({
      passed: v.passed,
      input: testCases[i].input,
      expectedOutput: testCases[i].expectedOutput,
      actualOutput: v.stdout,
      runtimeMs: v.runtimeMs,
      isHidden: problem?.testCases[i]?.isHidden ?? false,
    }));

    const visibleResults = testResults.filter((t) => !t.isHidden);
    const failedHidden = testResults.find((t) => !t.passed && t.isHidden);

    return {
      submissionId: submission.id,
      status: overallStatus as SubmissionResult['status'],
      passedTests,
      totalTests: testCases.length,
      runtimeMs: maxRuntime || null,
      memoryKb: maxMemory || null,
      errorMessage: firstError?.compileOutput || firstError?.stderr || null,
      testResults:
        persist && overallStatus !== 'ACCEPTED'
          ? [...visibleResults.filter((t) => !t.passed), ...(failedHidden ? [failedHidden] : [])]
          : visibleResults,
    };
  }

  private resolveOverallStatus(verdicts: JudgeVerdict[]): SubmissionStatus {
    if (verdicts.every((v) => v.passed)) return SubmissionStatus.ACCEPTED;
    if (verdicts.some((v) => v.status === 'COMPILE_ERROR')) return SubmissionStatus.COMPILE_ERROR;
    if (verdicts.some((v) => v.status === 'TIME_LIMIT_EXCEEDED'))
      return SubmissionStatus.TIME_LIMIT_EXCEEDED;
    if (verdicts.some((v) => v.status === 'MEMORY_LIMIT_EXCEEDED'))
      return SubmissionStatus.MEMORY_LIMIT_EXCEEDED;
    if (verdicts.some((v) => v.status === 'RUNTIME_ERROR')) return SubmissionStatus.RUNTIME_ERROR;
    return SubmissionStatus.WRONG_ANSWER;
  }

  private async updateProgress(
    userId: string,
    problemId: string,
    status: SubmissionStatus,
  ): Promise<void> {
    const existing = await prisma.userProblemProgress.findUnique({
      where: { userId_problemId: { userId, problemId } },
    });

    const isSolved = status === SubmissionStatus.ACCEPTED;

    if (existing) {
      await prisma.userProblemProgress.update({
        where: { id: existing.id },
        data: {
          attempts: { increment: 1 },
          isSolved: existing.isSolved || isSolved,
          bestStatus: isSolved ? SubmissionStatus.ACCEPTED : existing.bestStatus ?? status,
          solvedAt: isSolved && !existing.isSolved ? new Date() : existing.solvedAt,
        },
      });
    } else {
      await prisma.userProblemProgress.create({
        data: {
          userId,
          problemId,
          attempts: 1,
          isSolved,
          bestStatus: status,
          solvedAt: isSolved ? new Date() : null,
        },
      });
    }
  }

  private async logActivity(userId: string, problemId: string): Promise<void> {
    const problem = await prisma.dsaProblem.findUnique({ where: { id: problemId } });
    if (!problem) return;

    await prisma.activityLog.create({
      data: {
        userId,
        type: ActivityType.DSA_SUBMISSION,
        title: `Solved ${problem.title}`,
        description: `${problem.difficulty} · ${problem.topic}`,
        metadata: { problemId, slug: problem.slug },
      },
    });
  }

  private async updateAcceptanceRate(problemId: string): Promise<void> {
    const [accepted, total] = await Promise.all([
      prisma.submission.count({ where: { problemId, status: SubmissionStatus.ACCEPTED } }),
      prisma.submission.count({ where: { problemId } }),
    ]);

    const rate = total > 0 ? Math.round((accepted / total) * 1000) / 10 : 0;

    await prisma.dsaProblem.update({
      where: { id: problemId },
      data: { acceptanceRate: rate },
    });
  }
}

export const dsaService = new DsaService();
