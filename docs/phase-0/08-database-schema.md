# Database Schema

## InterviewGPT — Prisma Models

**Version:** 1.0.0  
**ORM:** Prisma  
**Database:** PostgreSQL 15+

---

## 1. Enums

```prisma
enum Role {
  STUDENT
  ADMIN
}

enum AuthProvider {
  EMAIL
  GOOGLE
}

enum Difficulty {
  EASY
  MEDIUM
  HARD
}

enum DsaTopic {
  ARRAYS
  STRINGS
  LINKED_LISTS
  TREES
  GRAPHS
  DP
  GREEDY
}

enum SubmissionStatus {
  PENDING
  ACCEPTED
  WRONG_ANSWER
  TIME_LIMIT_EXCEEDED
  MEMORY_LIMIT_EXCEEDED
  RUNTIME_ERROR
  COMPILE_ERROR
}

enum SupportedLanguage {
  JAVASCRIPT
  PYTHON
  JAVA
  CPP
  GO
}

enum InterviewType {
  TECHNICAL
  HR
  BEHAVIORAL
}

enum InterviewSessionStatus {
  IN_PROGRESS
  COMPLETED
  ABANDONED
}

enum QuestionCategory {
  DSA
  SYSTEM_DESIGN
  HR
  BEHAVIORAL
  APTITUDE
}

enum ActivityType {
  DSA_SUBMISSION
  RESUME_ANALYSIS
  INTERVIEW_COMPLETED
  GITHUB_SYNC
  LEETCODE_SYNC
  READINESS_UPDATED
}

enum NotificationType {
  SYSTEM
  DSA
  RESUME
  INTERVIEW
  READINESS
  ADMIN
}
```

---

## 2. Core Models

### User & Auth

```prisma
model User {
  id                String        @id @default(cuid())
  email             String        @unique
  passwordHash      String?       // null for OAuth-only users
  name              String
  avatarUrl         String?
  role              Role          @default(STUDENT)
  authProvider      AuthProvider  @default(EMAIL)
  googleId          String?       @unique
  isActive          Boolean       @default(true)
  emailVerified     Boolean       @default(false)
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt

  profile           UserProfile?
  refreshTokens     RefreshToken[]
  passwordResets    PasswordReset[]
  submissions       Submission[]
  problemProgress   UserProblemProgress[]
  resumeAnalyses    ResumeAnalysis[]
  interviewSessions InterviewSession[]
  githubAnalyses    GitHubAnalysis[]
  leetcodeProfile   LeetCodeProfile?
  bookmarks         Bookmark[]
  notifications     Notification[]
  activities        ActivityLog[]
  readinessSnapshots ReadinessSnapshot[]

  @@index([email])
  @@index([role])
}

model UserProfile {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  bio             String?
  college         String?
  graduationYear  Int?
  targetRole      String?  @default("SDE-1")
  githubUsername  String?
  leetcodeUsername String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model RefreshToken {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  tokenHash   String   @unique
  expiresAt   DateTime
  createdAt   DateTime @default(now())
  revokedAt   DateTime?

  @@index([userId])
}

model PasswordReset {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  tokenHash String   @unique
  expiresAt DateTime
  usedAt    DateTime?
  createdAt DateTime @default(now())

  @@index([userId])
}
```

### DSA Module

```prisma
model DsaProblem {
  id              String      @id @default(cuid())
  slug            String      @unique
  title           String
  description     String      @db.Text
  difficulty      Difficulty
  topic           DsaTopic
  constraints     String?     @db.Text
  examples        Json        // [{ input, output, explanation }]
  starterCode     Json        // { javascript: "...", python: "..." }
  timeLimitMs     Int         @default(2000)
  memoryLimitMb   Int         @default(256)
  isPublished     Boolean     @default(false)
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  testCases       TestCase[]
  submissions     Submission[]
  progress        UserProblemProgress[]

  @@index([difficulty])
  @@index([topic])
  @@index([isPublished])
}

model TestCase {
  id          String     @id @default(cuid())
  problemId   String
  problem     DsaProblem @relation(fields: [problemId], references: [id], onDelete: Cascade)
  input       String     @db.Text
  expectedOutput String  @db.Text
  isHidden    Boolean    @default(true)
  order       Int        @default(0)

  @@index([problemId])
}

model Submission {
  id          String           @id @default(cuid())
  userId      String
  user        User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  problemId   String
  problem     DsaProblem       @relation(fields: [problemId], references: [id], onDelete: Cascade)
  language    SupportedLanguage
  sourceCode  String           @db.Text
  status      SubmissionStatus @default(PENDING)
  runtimeMs   Int?
  memoryKb    Int?
  passedTests Int              @default(0)
  totalTests  Int              @default(0)
  errorMessage String?         @db.Text
  createdAt   DateTime         @default(now())

  @@index([userId, problemId])
  @@index([status])
  @@index([createdAt])
}

model UserProblemProgress {
  id          String     @id @default(cuid())
  userId      String
  user        User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  problemId   String
  problem     DsaProblem @relation(fields: [problemId], references: [id], onDelete: Cascade)
  isSolved    Boolean    @default(false)
  bestStatus  SubmissionStatus?
  attempts    Int        @default(0)
  solvedAt    DateTime?
  updatedAt   DateTime   @updatedAt

  @@unique([userId, problemId])
}
```

### Resume Module

```prisma
model ResumeAnalysis {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  s3Key         String
  fileName      String
  targetRole    String
  atsScore      Int      // 0-100
  extractedText String   @db.Text
  skills        String[]
  keywords      Json     // KeywordAnalysis[]
  sections      Json     // ParsedSections
  suggestions   Json     // AiSuggestion[]
  createdAt     DateTime @default(now())

  @@index([userId])
  @@index([createdAt])
}
```

### Interview Module

```prisma
model InterviewSession {
  id            String                 @id @default(cuid())
  userId        String
  user          User                   @relation(fields: [userId], references: [id], onDelete: Cascade)
  type          InterviewType
  targetRole    String
  companyId     String
  company       Company              @relation(fields: [companyId], references: [id])
  status        InterviewSessionStatus @default(IN_PROGRESS)
  overallScore  Int?                   // 0-100, set on complete
  summary       Json?                  // strengths, improvements
  questionCount Int                    @default(0)
  startedAt     DateTime               @default(now())
  completedAt   DateTime?

  questions     InterviewQA[]

  @@index([userId])
  @@index([status])
}

model InterviewQA {
  id          String           @id @default(cuid())
  sessionId   String
  session     InterviewSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  order       Int
  question    String           @db.Text
  answer      String?          @db.Text
  score       Int?             // 0-100
  feedback    String?          @db.Text
  createdAt   DateTime         @default(now())

  @@index([sessionId])
}
```

### GitHub Module

```prisma
model GitHubAnalysis {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  githubUsername  String
  score           Int      // 0-100
  totalRepos      Int
  totalStars      Int
  totalCommits    Int
  contributionData Json    // weekly contributions
  repoAnalysis    Json     // top repos with quality scores
  commitAnalysis  Json     // frequency, consistency metrics
  rawData         Json?    // cached GitHub API response (trimmed)
  analyzedAt      DateTime @default(now())

  @@index([userId])
  @@index([analyzedAt])
}
```

### LeetCode Module

```prisma
model LeetCodeProfile {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  username        String
  easySolved      Int      @default(0)
  mediumSolved    Int      @default(0)
  hardSolved      Int      @default(0)
  totalSolved     Int      @default(0)
  contestRating   Int?
  acceptanceRate  Float?
  topicProgress   Json     // { ARRAYS: 10, DP: 5, ... }
  lastSyncedAt    DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([username])
}
```

### Company & Question Bank

```prisma
model Company {
  id          String   @id @default(cuid())
  slug        String   @unique
  name        String
  logoUrl     String?
  description String?  @db.Text
  website     String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  questions   CompanyQuestion[]
  interviews  InterviewSession[]

  @@index([slug])
  @@index([isActive])
}

model CompanyQuestion {
  id          String           @id @default(cuid())
  title       String
  description String?          @db.Text
  companyId   String
  company     Company          @relation(fields: [companyId], references: [id], onDelete: Cascade)
  category    QuestionCategory
  topic       String?
  difficulty  Difficulty?
  tags        String[]
  sourceUrl   String?
  isPublished Boolean          @default(true)
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt

  bookmarks   Bookmark[]

  @@index([companyId])
  @@index([category])
  @@index([isPublished])
}

model Bookmark {
  id         String          @id @default(cuid())
  userId     String
  user       User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  questionId String
  question   CompanyQuestion @relation(fields: [questionId], references: [id], onDelete: Cascade)
  createdAt  DateTime        @default(now())

  @@unique([userId, questionId])
  @@index([userId])
}
```

### Notifications

```prisma
model Notification {
  id        String           @id @default(cuid())
  userId    String
  user      User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  type      NotificationType
  title     String
  message   String           @db.Text
  link      String?
  isRead    Boolean          @default(false)
  metadata  Json?
  createdAt DateTime         @default(now())
  readAt    DateTime?

  @@index([userId, isRead])
  @@index([userId, createdAt])
}
```

### Readiness & Activity

```prisma
model ReadinessSnapshot {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  overallScore  Int
  dsaScore      Int
  resumeScore   Int
  interviewScore Int
  githubScore   Int
  leetcodeScore Int
  weakAreas     Json     // WeakArea[]
  roadmap       Json     // RoadmapItem[]
  suggestions   Json     // AiSuggestion[]
  calculatedAt  DateTime @default(now())

  @@index([userId, calculatedAt])
}

model ActivityLog {
  id          String       @id @default(cuid())
  userId      String
  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  type        ActivityType
  title       String
  description String?
  metadata    Json?
  createdAt   DateTime     @default(now())

  @@index([userId, createdAt])
}
```

---

## 3. Index Strategy Summary

| Table | Index | Purpose |
|-------|-------|---------|
| User | email, role | Login, admin queries |
| Submission | userId+problemId, createdAt | History, dashboard |
| DsaProblem | topic, difficulty, isPublished | Filters |
| Company | slug, isActive | Lookup, filters |
| CompanyQuestion | companyId, category | Bank filters |
| Bookmark | userId | User bookmarks |
| Notification | userId+isRead, userId+createdAt | Inbox queries |
| ActivityLog | userId+createdAt DESC | Feed |
| ReadinessSnapshot | userId+calculatedAt DESC | Latest score |

---

## 4. Migration Strategy

1. Phase 1: Initial migration with User, UserProfile, RefreshToken, PasswordReset, Company, CompanyQuestion, Bookmark, Notification
2. Phase 5: DSA tables
3. Phase 6: ResumeAnalysis
4. Phase 7: InterviewSession, InterviewQA
5. Phase 8: GitHubAnalysis
6. Phase 9: LeetCodeProfile
7. Phase 10: CompanyQuestion, QuestionBookmark
8. Phase 11: ReadinessSnapshot, ActivityLog

Each phase adds only its tables — no big-bang migration.

---

## 5. Seed Data Plan

| Phase | Seed Content |
|-------|--------------|
| 2 | 1 admin user (env-based) |
| 5 | 20 DSA problems across 7 topics |
| 10 | 50+ company questions (7 companies) |
| 3 | Landing page testimonials (static frontend) |
