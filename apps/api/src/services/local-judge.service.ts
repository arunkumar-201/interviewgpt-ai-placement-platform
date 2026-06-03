import { spawn } from 'node:child_process';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { SupportedLanguage } from '@prisma/client';
import type { JudgeTestCase, JudgeVerdict } from './judge0.service.js';
import { logger } from '../lib/logger.js';

const SUPPORTED: SupportedLanguage[] = ['PYTHON', 'JAVASCRIPT'];

export class LocalJudgeService {
  supports(language: SupportedLanguage): boolean {
    return SUPPORTED.includes(language);
  }

  async runTests(
    sourceCode: string,
    language: SupportedLanguage,
    testCases: JudgeTestCase[],
    timeLimitMs: number,
  ): Promise<JudgeVerdict[]> {
    if (!this.supports(language)) {
      throw new Error(`Local fallback does not support ${language}. Configure Judge0 for Java/C++.`);
    }

    logger.info('local-judge.runTests', {
      language,
      testCaseCount: testCases.length,
      timeLimitMs,
    });

    const results: JudgeVerdict[] = [];
    for (const tc of testCases) {
      results.push(await this.runSingle(sourceCode, language, tc, timeLimitMs));
    }
    return results;
  }

  private async runSingle(
    sourceCode: string,
    language: SupportedLanguage,
    testCase: JudgeTestCase,
    timeLimitMs: number,
  ): Promise<JudgeVerdict> {
    const dir = await mkdtemp(join(tmpdir(), 'ig-judge-'));
    const started = Date.now();

    try {
      const file = join(dir, language === 'PYTHON' ? 'solution.py' : 'solution.js');
      await writeFile(file, sourceCode, 'utf8');

      const cmd = language === 'PYTHON' ? (process.platform === 'win32' ? 'python' : 'python3') : 'node';
      const args = language === 'PYTHON' ? [file] : [file];

      const { stdout, stderr, exitCode, timedOut } = await this.spawnWithTimeout(
        cmd,
        args,
        testCase.input,
        timeLimitMs,
      );

      const runtimeMs = Date.now() - started;

      if (timedOut) {
        return {
          passed: false,
          status: 'TIME_LIMIT_EXCEEDED',
          stdout,
          stderr: stderr || 'Time limit exceeded',
          runtimeMs,
          memoryKb: null,
        };
      }

      if (exitCode !== 0) {
        return {
          passed: false,
          status: stderr ? 'COMPILE_ERROR' : 'RUNTIME_ERROR',
          stdout,
          stderr: stderr || `Process exited with code ${exitCode}`,
          runtimeMs,
          memoryKb: null,
        };
      }

      const passed = this.normalizeOutput(stdout) === this.normalizeOutput(testCase.expectedOutput);
      return {
        passed,
        status: passed ? 'ACCEPTED' : 'WRONG_ANSWER',
        stdout: stdout.trim(),
        stderr,
        runtimeMs,
        memoryKb: null,
      };
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  }

  private spawnWithTimeout(
    command: string,
    args: string[],
    stdin: string,
    timeLimitMs: number,
  ): Promise<{ stdout: string; stderr: string; exitCode: number; timedOut: boolean }> {
    return new Promise((resolve) => {
      const child = spawn(command, args, { stdio: ['pipe', 'pipe', 'pipe'] });
      let stdout = '';
      let stderr = '';
      let timedOut = false;

      const timer = setTimeout(() => {
        timedOut = true;
        child.kill('SIGKILL');
      }, timeLimitMs + 500);

      child.stdout.on('data', (chunk: Buffer) => {
        stdout += chunk.toString();
      });
      child.stderr.on('data', (chunk: Buffer) => {
        stderr += chunk.toString();
      });

      child.on('close', (code) => {
        clearTimeout(timer);
        resolve({ stdout, stderr, exitCode: code ?? 1, timedOut });
      });

      child.on('error', (err) => {
        clearTimeout(timer);
        resolve({ stdout, stderr: err.message, exitCode: 1, timedOut: false });
      });

      child.stdin.write(stdin);
      child.stdin.end();
    });
  }

  private normalizeOutput(output: string): string {
    const trimmed = output.trim().replace(/\r\n/g, '\n');
    try {
      return JSON.stringify(JSON.parse(trimmed));
    } catch {
      return trimmed.replace(/\s+/g, ' ').trim();
    }
  }
}

export const localJudgeService = new LocalJudgeService();
