import { SupportedLanguage } from '@prisma/client';
import { env } from '../config/env.js';
import { ExternalServiceError } from '../errors/app.error.js';
import { logger } from '../lib/logger.js';

const LANGUAGE_IDS: Record<SupportedLanguage, number> = {
  JAVASCRIPT: 63,
  PYTHON: 71,
  JAVA: 62,
  CPP: 54,
  GO: 60,
};

export interface JudgeTestCase {
  input: string;
  expectedOutput: string;
}

export interface JudgeVerdict {
  passed: boolean;
  status: 'ACCEPTED' | 'WRONG_ANSWER' | 'TIME_LIMIT_EXCEEDED' | 'RUNTIME_ERROR' | 'COMPILE_ERROR' | 'MEMORY_LIMIT_EXCEEDED';
  stdout: string;
  stderr: string;
  runtimeMs: number | null;
  memoryKb: number | null;
  compileOutput?: string;
}

export class Judge0Service {
  private get headers(): Record<string, string> {
    const base: Record<string, string> = { 'Content-Type': 'application/json' };

    if (env.JUDGE0_RAPIDAPI_HOST && env.JUDGE0_API_KEY) {
      base['X-RapidAPI-Key'] = env.JUDGE0_API_KEY;
      base['X-RapidAPI-Host'] = env.JUDGE0_RAPIDAPI_HOST;
    }

    return base;
  }

  private get baseUrl(): string {
    return env.JUDGE0_API_URL.replace(/\/$/, '');
  }

  async runTests(
    sourceCode: string,
    language: SupportedLanguage,
    testCases: JudgeTestCase[],
    timeLimitMs: number,
    memoryLimitMb: number,
  ): Promise<JudgeVerdict[]> {
    const languageId = LANGUAGE_IDS[language];

    logger.info('judge0.runTests.start', {
      baseUrl: this.baseUrl,
      language,
      languageId,
      testCaseCount: testCases.length,
      timeLimitMs,
      memoryLimitMb,
      usingRapidApi: Boolean(env.JUDGE0_API_KEY && env.JUDGE0_RAPIDAPI_HOST),
    });

    const submissions = await Promise.all(
      testCases.map((tc, index) =>
        this.submitAndWait(
          {
            source_code: sourceCode,
            language_id: languageId,
            stdin: tc.input,
            expected_output: tc.expectedOutput,
            cpu_time_limit: timeLimitMs / 1000,
            memory_limit: memoryLimitMb * 1024,
          },
          index,
        ),
      ),
    );

    const verdicts = submissions.map((result, index) => {
      const tc = testCases[index];
      return this.mapResult(result, tc.expectedOutput);
    });

    logger.info('judge0.runTests.complete', {
      passed: verdicts.filter((v) => v.passed).length,
      total: verdicts.length,
    });

    return verdicts;
  }

  private async submitAndWait(body: Record<string, unknown>, testIndex: number) {
    const submitUrl = `${this.baseUrl}/submissions?base64_encoded=false&wait=false`;

    logger.debug('judge0.submit.request', {
      url: submitUrl,
      testIndex,
      languageId: body.language_id,
      stdinLength: typeof body.stdin === 'string' ? body.stdin.length : 0,
    });

    let tokenRes: Response;
    try {
      tokenRes = await fetch(submitUrl, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(body),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Network error';
      const cause = error instanceof Error && error.cause ? String(error.cause) : undefined;
      logger.error('judge0.submit.network_error', {
        url: submitUrl,
        testIndex,
        error: message,
        cause,
      });
      throw new ExternalServiceError(
        `Cannot reach Judge0 at ${this.baseUrl}. ${message}${cause ? ` (${cause})` : ''}. ` +
          'Start Judge0 (docker compose up judge0-server) or enable JUDGE0_LOCAL_FALLBACK for Python/JS.',
      );
    }

    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      logger.error('judge0.submit.http_error', {
        status: tokenRes.status,
        testIndex,
        body: text.slice(0, 500),
      });
      throw new ExternalServiceError(`Judge0 submit failed (HTTP ${tokenRes.status}): ${text}`);
    }

    const { token } = (await tokenRes.json()) as { token: string };
    logger.debug('judge0.submit.token', { testIndex, token });

    for (let i = 0; i < 30; i++) {
      await this.sleep(500);

      const pollUrl = `${this.baseUrl}/submissions/${token}?base64_encoded=false&fields=stdout,stderr,status,time,memory,compile_output,message`;

      let resultRes: Response;
      try {
        resultRes = await fetch(pollUrl, { headers: this.headers });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Network error';
        logger.error('judge0.poll.network_error', { testIndex, attempt: i + 1, error: message });
        throw new ExternalServiceError(`Judge0 poll failed: ${message}`);
      }

      if (!resultRes.ok) {
        logger.warn('judge0.poll.http_error', { testIndex, attempt: i + 1, status: resultRes.status });
        continue;
      }

      const result = (await resultRes.json()) as {
        status?: { id: number; description: string };
        stdout?: string | null;
        stderr?: string | null;
        time?: string | null;
        memory?: number | null;
        compile_output?: string | null;
        message?: string | null;
      };

      logger.debug('judge0.poll.response', {
        testIndex,
        attempt: i + 1,
        statusId: result.status?.id,
        statusDesc: result.status?.description,
      });

      if (result.status && result.status.id > 2) {
        logger.info('judge0.poll.complete', {
          testIndex,
          statusId: result.status.id,
          statusDesc: result.status.description,
          runtimeMs: result.time ? Math.round(parseFloat(result.time) * 1000) : null,
        });
        return result;
      }
    }

    logger.error('judge0.poll.timeout', { testIndex, token });
    throw new ExternalServiceError('Judge0 execution timed out waiting for results');
  }

  private mapResult(
    result: {
      stdout?: string | null;
      stderr?: string | null;
      status?: { id: number; description: string };
      time?: string | null;
      memory?: number | null;
      compile_output?: string | null;
      message?: string | null;
    },
    expectedOutput: string,
  ): JudgeVerdict {
    const statusId = result.status?.id ?? 0;
    const stdout = (result.stdout ?? '').trim();
    const stderr = (result.stderr ?? '').trim();
    const compileOutput = result.compile_output ?? '';

    const runtimeMs = result.time ? Math.round(parseFloat(result.time) * 1000) : null;
    const memoryKb = result.memory ?? null;

    if (statusId === 6) {
      return {
        passed: false,
        status: 'COMPILE_ERROR',
        stdout,
        stderr,
        runtimeMs,
        memoryKb,
        compileOutput,
      };
    }

    if (statusId === 5) {
      return {
        passed: false,
        status: 'TIME_LIMIT_EXCEEDED',
        stdout,
        stderr,
        runtimeMs,
        memoryKb,
      };
    }

    if (statusId === 12) {
      return {
        passed: false,
        status: 'RUNTIME_ERROR',
        stdout,
        stderr: stderr || result.message || 'Runtime error',
        runtimeMs,
        memoryKb,
      };
    }

    if (statusId === 3) {
      const passed = this.normalizeOutput(stdout) === this.normalizeOutput(expectedOutput);
      return {
        passed,
        status: passed ? 'ACCEPTED' : 'WRONG_ANSWER',
        stdout,
        stderr,
        runtimeMs,
        memoryKb,
      };
    }

    return {
      passed: false,
      status: 'RUNTIME_ERROR',
      stdout,
      stderr: stderr || 'Unknown execution status',
      runtimeMs,
      memoryKb,
    };
  }

  private normalizeOutput(output: string): string {
    const trimmed = output.trim().replace(/\r\n/g, '\n');
    try {
      return JSON.stringify(JSON.parse(trimmed));
    } catch {
      return trimmed.replace(/\s+/g, ' ').trim();
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const judge0Service = new Judge0Service();
