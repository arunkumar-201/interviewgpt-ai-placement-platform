import type { Difficulty, DsaTopic } from '@prisma/client';

export interface SeedTestCase {
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface ProblemEditorial {
  bruteForce: string;
  better: string;
  optimal: string;
  timeComplexity: string;
  spaceComplexity: string;
}

export type StarterLanguages = 'PYTHON' | 'JAVASCRIPT' | 'JAVA' | 'CPP';

export interface SeedProblem {
  slug: string;
  title: string;
  difficulty: Difficulty;
  topic: DsaTopic;
  tags: string[];
  companies: string[];
  description: string;
  fullDescription: string;
  constraints: string;
  examples: ProblemExample[];
  edgeCases: string[];
  hints: [string, string, string];
  followUp?: string;
  editorial: ProblemEditorial;
  relatedSlugs: string[];
  orderIndex: number;
  starterCode: Record<StarterLanguages, string>;
  testCases: SeedTestCase[];
}

/** Condensed definition passed to `createProblem` in catalog batches. */
export interface ProblemDef {
  slug: string;
  title: string;
  difficulty: Difficulty;
  topic: DsaTopic;
  tags: string[];
  companies: string[];
  description: string;
  fullDescription: string;
  constraints: string;
  examples: ProblemExample[];
  edgeCases: string[];
  hints: [string, string, string];
  followUp?: string;
  editorial: ProblemEditorial;
  relatedSlugs: string[];
  orderIndex: number;
  /** Python solve body; must set `result` (or call print yourself). */
  py: string;
  /** JavaScript solve body; must set `result`. */
  js: string;
  /** Full Java source for Judge0; if omitted, uses javaStub comment template. */
  java?: string;
  /** Full C++ source for Judge0; if omitted, uses cppStub comment template. */
  cpp?: string;
  testCases: SeedTestCase[];
}
