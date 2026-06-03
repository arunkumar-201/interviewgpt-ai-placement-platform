export type DsaLanguage = 'JAVASCRIPT' | 'PYTHON' | 'JAVA' | 'CPP';

export type SubmissionStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'WRONG_ANSWER'
  | 'TIME_LIMIT_EXCEEDED'
  | 'MEMORY_LIMIT_EXCEEDED'
  | 'RUNTIME_ERROR'
  | 'COMPILE_ERROR';

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

export interface ProblemNavigation {
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
  related: { slug: string; title: string; difficulty: string }[];
}

export interface ProblemSummary {
  id: string;
  slug: string;
  title: string;
  difficulty: string;
  topic: string;
  tags: string[];
  companies: string[];
  acceptanceRate: number;
  isSolved: boolean;
}

export interface ProblemDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  fullDescription: string;
  difficulty: string;
  topic: string;
  tags: string[];
  companies: string[];
  constraints: string | null;
  examples: ProblemExample[];
  edgeCases: string[];
  hints: string[];
  followUp: string | null;
  starterCode: Record<string, string>;
  editorial: ProblemEditorial | null;
  acceptanceRate: number;
  timeLimitMs: number;
  memoryLimitMb: number;
  isSolved: boolean;
  attempts: number;
  sampleTestCases: { input: string; expectedOutput: string }[];
  navigation: ProblemNavigation;
}

export interface SubmissionResult {
  submissionId: string;
  status: SubmissionStatus;
  passedTests: number;
  totalTests: number;
  runtimeMs: number | null;
  memoryKb: number | null;
  errorMessage: string | null;
  testResults?: {
    passed: boolean;
    input: string;
    expectedOutput: string;
    actualOutput?: string;
    runtimeMs?: number | null;
    isHidden: boolean;
  }[];
}

export interface SubmissionHistoryItem {
  id: string;
  language: DsaLanguage;
  status: SubmissionStatus;
  runtimeMs: number | null;
  memoryKb: number | null;
  passedTests: number;
  totalTests: number;
  createdAt: string;
}

export interface PaginatedProblems {
  data: ProblemSummary[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    solvedCount: number;
  };
}
