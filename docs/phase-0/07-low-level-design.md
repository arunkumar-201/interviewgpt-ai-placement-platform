# Low-Level Design (LLD)

## InterviewGPT — Module Internals & Contracts

**Version:** 1.0.0

---

## 1. Backend Layer Responsibilities

### 1.1 Route Layer
- Define HTTP method, path, middleware chain
- No business logic
- Delegate to controller

### 1.2 Controller Layer
- Parse request (params, query, body)
- Call service method(s)
- Map service result to HTTP response
- Catch service errors → pass to error middleware

### 1.3 Service Layer
- Business logic and orchestration
- Transaction boundaries (Prisma `$transaction`)
- Call external APIs (Gemini, Judge0, GitHub)
- Throw typed `AppError` subclasses

### 1.4 Repository Layer (Prisma)
- Direct database access encapsulated in repository classes (optional thin wrapper)
- MVP: services call `prisma.*` directly; refactor to repos if complexity grows

---

## 2. Core Classes & Interfaces

### 2.1 AuthService

```typescript
interface AuthService {
  register(dto: RegisterDto): Promise<AuthResponse>;
  login(dto: LoginDto): Promise<AuthResponse>;
  logout(userId: string, refreshToken: string): Promise<void>;
  refresh(refreshToken: string): Promise<TokenPair>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
  googleCallback(code: string): Promise<AuthResponse>;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface AuthResponse extends TokenPair {
  user: UserProfile;
}
```

**TokenService internals:**
- `signAccessToken(payload: JwtPayload): string` — 15 min expiry
- `signRefreshToken(userId: string): string` — 7 day expiry, stored hashed
- `verifyAccessToken(token: string): JwtPayload`
- `rotateRefreshToken(oldToken: string): TokenPair` — invalidate old, issue new

### 2.2 DsaService

```typescript
interface DsaService {
  listProblems(filters: ProblemFilters): Promise<PaginatedResult<ProblemSummary>>;
  getProblemBySlug(slug: string, userId?: string): Promise<ProblemDetail>;
  submitSolution(userId: string, problemId: string, dto: SubmitDto): Promise<SubmissionResult>;
  getSubmissions(userId: string, problemId: string): Promise<Submission[]>;
  getHint(userId: string, problemId: string, attemptContext: string): Promise<HintResponse>;
}

interface SubmitDto {
  language: SupportedLanguage;
  sourceCode: string;
}

enum SupportedLanguage {
  JAVASCRIPT = 'javascript',
  PYTHON = 'python',
  JAVA = 'java',
  CPP = 'cpp',
  GO = 'go',
}

enum SubmissionStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  WRONG_ANSWER = 'WRONG_ANSWER',
  TIME_LIMIT_EXCEEDED = 'TIME_LIMIT_EXCEEDED',
  RUNTIME_ERROR = 'RUNTIME_ERROR',
  COMPILE_ERROR = 'COMPILE_ERROR',
}
```

**Judge0Service:**
- Map language enum → Judge0 language_id
- Wrap test cases in stdin/expected stdout pairs
- `submitBatch(sourceCode, testCases): Promise<Verdict[]>`

### 2.3 ResumeService

```typescript
interface ResumeService {
  getUploadUrl(userId: string, filename: string): Promise<PresignedUrlResponse>;
  analyze(userId: string, dto: AnalyzeResumeDto): Promise<ResumeAnalysisResult>;
  getHistory(userId: string): Promise<ResumeAnalysisSummary[]>;
  getLatest(userId: string): Promise<ResumeAnalysisResult | null>;
}

interface ResumeAnalysisResult {
  id: string;
  atsScore: number;
  skills: string[];
  keywords: KeywordAnalysis[];
  sections: ParsedSections;
  suggestions: AiSuggestion[];
  createdAt: Date;
}

interface KeywordAnalysis {
  keyword: string;
  found: boolean;
  importance: 'high' | 'medium' | 'low';
}
```

**ATS Scoring Algorithm (rule-based):**
```
baseScore = 50
+ sectionPresence (contact, summary, experience, education, skills) → max +20
+ keywordMatchRatio(targetRoleKeywords) → max +20
+ formattingScore (no tables detected, reasonable length) → max +10
= clamp(0, 100)
```

### 2.4 InterviewService

```typescript
interface InterviewService {
  createSession(userId: string, dto: CreateSessionDto): Promise<InterviewSession>;
  submitAnswer(sessionId: string, userId: string, answer: string): Promise<QaEvaluation>;
  completeSession(sessionId: string, userId: string): Promise<SessionSummary>;
  getSession(sessionId: string, userId: string): Promise<InterviewSessionDetail>;
  listSessions(userId: string): Promise<InterviewSessionSummary[]>;
}

enum InterviewType {
  TECHNICAL = 'TECHNICAL',
  HR = 'HR',
  BEHAVIORAL = 'BEHAVIORAL',
}
```

**Gemini prompt structure:**
```
System: You are an interviewer for {company} hiring for {role}.
        Interview type: {type}. Ask one question at a time.
User: [previous Q&A context]
Assistant: [next question OR evaluation JSON]
```

### 2.5 ReadinessService

```typescript
interface ReadinessService {
  calculate(userId: string): Promise<ReadinessResult>;
  getRoadmap(userId: string): Promise<RoadmapItem[]>;
  getSuggestions(userId: string): Promise<AiSuggestion[]>;
}

interface ReadinessResult {
  overallScore: number;
  breakdown: {
    dsa: number;       // weight 0.30
    resume: number;    // weight 0.20
    interview: number; // weight 0.25
    github: number;    // weight 0.15
    leetcode: number;  // weight 0.10
  };
  weakAreas: WeakArea[];
  calculatedAt: Date;
}

interface WeakArea {
  module: string;
  score: number;
  recommendation: string;
}
```

**Score derivation:**
| Sub-score | Source |
|-----------|--------|
| DSA | `(acceptedProblems / totalAttempted) * difficultyWeight * 100` capped |
| Resume | Latest `ResumeAnalysis.atsScore` |
| Interview | Average of last 5 session `overallScore` |
| GitHub | Latest `GitHubAnalysis.score` |
| LeetCode | Normalized `(easy*1 + medium*2 + hard*3) / target * 100` |

---

## 3. Middleware Chain

```typescript
// apps/api/src/app.ts
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(requestIdMiddleware);
app.use(loggerMiddleware);
app.use('/api/v1', rateLimitMiddleware);

// Per-route
router.post('/login', validate(loginSchema), authController.login);
router.get('/dashboard', authenticate, dashboardController.get);
router.delete('/admin/users/:id', authenticate, requireRole('ADMIN'), adminController.deleteUser);
```

### authenticate middleware
```typescript
async function authenticate(req, res, next) {
  const token = extractBearerToken(req.headers.authorization);
  if (!token) throw new UnauthorizedError();
  const payload = tokenService.verifyAccessToken(token);
  req.user = await userService.findById(payload.sub);
  next();
}
```

---

## 4. Frontend Module Design

### 4.1 API Client (`lib/api-client.ts`)

```typescript
class ApiClient {
  private baseURL = import.meta.env.VITE_API_URL;

  async request<T>(path: string, options?: RequestInit): Promise<T> {
    const token = tokenStorage.getAccessToken();
    const response = await fetch(`${this.baseURL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers,
      },
    });
    if (response.status === 401) {
      await authStore.refreshToken();
      return this.request(path, options); // retry once
    }
    return handleResponse<T>(response);
  }
}
```

### 4.2 React Query Key Convention

```typescript
export const queryKeys = {
  dashboard: ['dashboard'] as const,
  problems: (filters: ProblemFilters) => ['dsa', 'problems', filters] as const,
  problem: (slug: string) => ['dsa', 'problem', slug] as const,
  submissions: (problemId: string) => ['dsa', 'submissions', problemId] as const,
  resumeLatest: ['resume', 'latest'] as const,
  interviewSession: (id: string) => ['interview', id] as const,
  readiness: ['readiness'] as const,
};
```

### 4.3 Protected Route Component

```typescript
function ProtectedRoute({ children, roles }: { children: ReactNode; roles?: Role[] }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
```

---

## 5. Shared Package Schemas (Zod)

```typescript
// packages/shared/src/schemas/auth.schema.ts
export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[a-z]/, 'Must contain lowercase')
    .regex(/[0-9]/, 'Must contain number'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
```

Shared between frontend form validation and backend `validate()` middleware.

---

## 6. Error Class Hierarchy

```typescript
class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown
  ) { super(message); }
}

class ValidationError extends AppError {
  constructor(details: FieldError[]) {
    super(400, 'VALIDATION_ERROR', 'Invalid input', details);
  }
}

class UnauthorizedError extends AppError { /* 401 */ }
class ForbiddenError extends AppError { /* 403 */ }
class NotFoundError extends AppError { /* 404 */ }
class ConflictError extends AppError { /* 409 */ }
class RateLimitError extends AppError { /* 429 */ }
class ExternalServiceError extends AppError { /* 502 */ }
```

---

## 7. Caching Strategy

| Key Pattern | TTL | Invalidate On |
|-------------|-----|---------------|
| `dashboard:{userId}` | 5 min | Any metric update |
| `readiness:{userId}` | 15 min | Module score change |
| `github:{userId}` | 1 hour | Manual refresh |
| `ratelimit:{userId}:{endpoint}` | 1 min | — |
| `hint:{userId}:{problemId}` | 24 hours | — |

---

## 8. Database Transaction Boundaries

| Operation | Transaction |
|-----------|-------------|
| Register user | Create User + default UserProfile |
| Submit DSA (accepted) | Update Submission + UserProblemProgress + ActivityLog |
| Complete interview | Update Session + InterviewQA batch + ActivityLog |
| Readiness recalc | Upsert ReadinessSnapshot |

---

## 9. Design Patterns Used

| Pattern | Location |
|---------|----------|
| Factory | Judge0 language ID mapping |
| Strategy | ATS scoring vs AI scoring |
| Observer-lite | Activity log on domain events |
| Repository | Prisma encapsulation (optional) |
| DTO | Zod schemas in shared package |
| Singleton | PrismaClient, RedisClient instances |

---

## 10. Configuration Schema

```typescript
// apps/api/src/config/env.ts
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  GEMINI_API_KEY: z.string(),
  JUDGE0_API_URL: z.string().url(),
  JUDGE0_API_KEY: z.string().optional(),
  AWS_REGION: z.string(),
  AWS_S3_BUCKET: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  FRONTEND_URL: z.string().url(),
});
```
