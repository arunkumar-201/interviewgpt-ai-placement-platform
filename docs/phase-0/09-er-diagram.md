# ER Diagram

## InterviewGPT — Entity Relationships

**Version:** 1.0.0

---

## Full Entity-Relationship Diagram

```mermaid
erDiagram
    User ||--o| UserProfile : has
    User ||--o{ RefreshToken : has
    User ||--o{ PasswordReset : has
    User ||--o{ Submission : makes
    User ||--o{ UserProblemProgress : tracks
    User ||--o{ ResumeAnalysis : uploads
    User ||--o{ InterviewSession : starts
    User ||--o{ GitHubAnalysis : analyzes
    User ||--o| LeetCodeProfile : links
    User ||--o{ Bookmark : bookmarks
    User ||--o{ Notification : receives
    User ||--o{ ReadinessSnapshot : has
    User ||--o{ ActivityLog : generates

    DsaProblem ||--o{ TestCase : contains
    DsaProblem ||--o{ Submission : receives
    DsaProblem ||--o{ UserProblemProgress : tracked_by

    InterviewSession ||--o{ InterviewQA : contains

    Company ||--o{ CompanyQuestion : has
    Company ||--o{ InterviewSession : targets
    CompanyQuestion ||--o{ Bookmark : bookmarked_in

    User {
        string id PK
        string email UK
        string passwordHash
        string name
        string avatarUrl
        enum role
        enum authProvider
        string googleId UK
        boolean isActive
        boolean emailVerified
        datetime createdAt
        datetime updatedAt
    }

    UserProfile {
        string id PK
        string userId FK UK
        string bio
        string college
        int graduationYear
        string targetRole
        string githubUsername
        string leetcodeUsername
    }

    RefreshToken {
        string id PK
        string userId FK
        string tokenHash UK
        datetime expiresAt
        datetime revokedAt
    }

    PasswordReset {
        string id PK
        string userId FK
        string tokenHash UK
        datetime expiresAt
        datetime usedAt
    }

    DsaProblem {
        string id PK
        string slug UK
        string title
        text description
        enum difficulty
        enum topic
        json examples
        json starterCode
        boolean isPublished
    }

    TestCase {
        string id PK
        string problemId FK
        text input
        text expectedOutput
        boolean isHidden
        int order
    }

    Submission {
        string id PK
        string userId FK
        string problemId FK
        enum language
        text sourceCode
        enum status
        int runtimeMs
        int passedTests
        int totalTests
    }

    UserProblemProgress {
        string id PK
        string userId FK
        string problemId FK
        boolean isSolved
        enum bestStatus
        int attempts
        datetime solvedAt
    }

    ResumeAnalysis {
        string id PK
        string userId FK
        string s3Key
        string fileName
        string targetRole
        int atsScore
        text extractedText
        array skills
        json keywords
        json suggestions
    }

    InterviewSession {
        string id PK
        string userId FK
        enum type
        string targetRole
        enum company
        enum status
        int overallScore
        json summary
        datetime startedAt
        datetime completedAt
    }

    InterviewQA {
        string id PK
        string sessionId FK
        int order
        text question
        text answer
        int score
        text feedback
    }

    GitHubAnalysis {
        string id PK
        string userId FK
        string githubUsername
        int score
        int totalRepos
        int totalStars
        json repoAnalysis
        json commitAnalysis
        datetime analyzedAt
    }

    LeetCodeProfile {
        string id PK
        string userId FK UK
        string username
        int easySolved
        int mediumSolved
        int hardSolved
        int contestRating
        json topicProgress
        datetime lastSyncedAt
    }

    CompanyQuestion {
        string id PK
        string title
        enum company
        enum category
        enum difficulty
        array tags
        boolean isPublished
    }

    QuestionBookmark {
        string id PK
        string userId FK
        string questionId FK
        datetime createdAt
    }

    ReadinessSnapshot {
        string id PK
        string userId FK
        int overallScore
        int dsaScore
        int resumeScore
        int interviewScore
        int githubScore
        int leetcodeScore
        json weakAreas
        json roadmap
        datetime calculatedAt
    }

    ActivityLog {
        string id PK
        string userId FK
        enum type
        string title
        json metadata
        datetime createdAt
    }
```

---

## Relationship Cardinality Summary

| Relationship | Type | Description |
|--------------|------|-------------|
| User → UserProfile | 1:1 | Every user has one extended profile |
| User → RefreshToken | 1:N | Multiple devices/sessions |
| User → Submission | 1:N | Many code submissions |
| User ↔ DsaProblem | M:N | Via UserProblemProgress (unique pair) |
| DsaProblem → TestCase | 1:N | Visible + hidden test cases |
| User → InterviewSession | 1:N | Multiple mock interviews |
| InterviewSession → InterviewQA | 1:N | Ordered Q&A pairs |
| User ↔ CompanyQuestion | M:N | Via QuestionBookmark |
| User → ReadinessSnapshot | 1:N | Historical snapshots; latest used for dashboard |
| User → ActivityLog | 1:N | Chronological activity feed |

---

## Module Grouping (Visual)

```
┌─────────────────────────────────────────────────────────────┐
│                        AUTH DOMAIN                           │
│  User ── UserProfile                                         │
│    ├── RefreshToken                                          │
│    └── PasswordReset                                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        DSA DOMAIN                            │
│  DsaProblem ── TestCase                                      │
│       │                                                      │
│       ├── Submission ◄── User                                │
│       └── UserProblemProgress ◄── User                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     ANALYSIS DOMAIN                          │
│  User ── ResumeAnalysis                                      │
│      ── GitHubAnalysis                                       │
│      ── LeetCodeProfile                                      │
│      ── InterviewSession ── InterviewQA                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    PREPARATION DOMAIN                        │
│  CompanyQuestion ◄── QuestionBookmark ── User                │
│  User ── ReadinessSnapshot                                   │
│  User ── ActivityLog                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Cascade Delete Rules

| Parent | Child | On Delete |
|--------|-------|-----------|
| User | All user-owned records | CASCADE |
| DsaProblem | TestCase, Submission, UserProblemProgress | CASCADE |
| InterviewSession | InterviewQA | CASCADE |
| CompanyQuestion | QuestionBookmark | CASCADE |

---

## Unique Constraints

| Table | Constraint | Purpose |
|-------|------------|---------|
| User | email | One account per email |
| User | googleId | OAuth deduplication |
| UserProblemProgress | userId + problemId | One progress row per pair |
| QuestionBookmark | userId + questionId | No duplicate bookmarks |
| LeetCodeProfile | userId | One LeetCode link per user |
| DsaProblem | slug | SEO-friendly URLs |
