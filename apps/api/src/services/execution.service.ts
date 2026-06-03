import { SupportedLanguage } from '@prisma/client';
import { env, isJudge0LocalFallbackEnabled } from '../config/env.js';
import { logger } from '../lib/logger.js';
import { judge0Service, type JudgeTestCase, type JudgeVerdict } from './judge0.service.js';
import { localJudgeService } from './local-judge.service.js';

export class ExecutionService {
  async runTests(
    sourceCode: string,
    language: SupportedLanguage,
    testCases: JudgeTestCase[],
    timeLimitMs: number,
    memoryLimitMb: number,
    context: { action: 'run' | 'submit'; problemId: string; userId: string },
  ): Promise<JudgeVerdict[]> {
    logger.info('execution.runTests.start', {
      action: context.action,
      problemId: context.problemId,
      userId: context.userId,
      language,
      testCaseCount: testCases.length,
      judge0Url: env.JUDGE0_API_URL,
    });

    try {
      const verdicts = await judge0Service.runTests(
        sourceCode,
        language,
        testCases,
        timeLimitMs,
        memoryLimitMb,
      );

      logger.info('execution.runTests.judge0.success', {
        action: context.action,
        problemId: context.problemId,
        passed: verdicts.filter((v) => v.passed).length,
        total: verdicts.length,
      });

      return verdicts;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Judge0 execution failed';
      const cause =
        error instanceof Error && 'cause' in error
          ? String((error as Error & { cause?: unknown }).cause)
          : undefined;

      logger.error('execution.runTests.judge0.failed', {
        action: context.action,
        problemId: context.problemId,
        language,
        judge0Url: env.JUDGE0_API_URL,
        error: message,
        cause,
      });

      if (isJudge0LocalFallbackEnabled && localJudgeService.supports(language)) {
        logger.warn('execution.runTests.fallback.local', {
          action: context.action,
          problemId: context.problemId,
          language,
        });

        const verdicts = await localJudgeService.runTests(
          sourceCode,
          language,
          testCases,
          timeLimitMs,
        );

        logger.info('execution.runTests.fallback.success', {
          action: context.action,
          problemId: context.problemId,
          passed: verdicts.filter((v) => v.passed).length,
          total: verdicts.length,
        });

        return verdicts;
      }

      throw error;
    }
  }

  async pingJudge0(): Promise<{ ok: boolean; mode: 'judge0' | 'fallback'; detail: string }> {
    try {
      const res = await fetch(`${env.JUDGE0_API_URL.replace(/\/$/, '')}/about`, {
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        return { ok: true, mode: 'judge0', detail: `Judge0 reachable at ${env.JUDGE0_API_URL}` };
      }
      return { ok: false, mode: 'judge0', detail: `Judge0 returned HTTP ${res.status}` };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      if (isJudge0LocalFallbackEnabled) {
        return {
          ok: true,
          mode: 'fallback',
          detail: `Judge0 unreachable (${message}); local fallback enabled for Python/JavaScript`,
        };
      }
      return { ok: false, mode: 'judge0', detail: `Judge0 unreachable: ${message}` };
    }
  }
}

export const executionService = new ExecutionService();
