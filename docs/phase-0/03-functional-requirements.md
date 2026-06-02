# Functional Requirements

## InterviewGPT — Feature Specifications by Module

**Version:** 1.0.0

---

## FR-0: Global / Cross-Cutting

| ID | Requirement | Priority | Phase |
|----|-------------|----------|-------|
| FR-0.1 | System shall support responsive layouts (mobile, tablet, desktop) | Must | All |
| FR-0.2 | System shall provide consistent error messages and toast notifications | Must | 1+ |
| FR-0.3 | System shall enforce TypeScript strict mode across frontend and backend | Must | 1 |
| FR-0.4 | System shall log structured JSON logs on backend | Should | 1 |
| FR-0.5 | System shall support light and dark themes | Should | 3+ |

---

## FR-1: Authentication & Authorization (Phase 2)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1.1 | User shall register with email, password, and name | Must |
| FR-1.2 | User shall log in with email and password | Must |
| FR-1.3 | User shall log in via Google OAuth | Must |
| FR-1.4 | User shall log out and invalidate refresh token | Must |
| FR-1.5 | User shall request password reset via email link | Must |
| FR-1.6 | User shall reset password with valid token | Must |
| FR-1.7 | System shall issue JWT access token (15 min) and refresh token (7 days) | Must |
| FR-1.8 | System shall protect API routes requiring authentication | Must |
| FR-1.9 | System shall enforce role-based access: `STUDENT`, `ADMIN` | Must |
| FR-1.10 | Default role on registration shall be `STUDENT` | Must |
| FR-1.11 | Frontend shall redirect unauthenticated users from protected routes | Must |
| FR-1.12 | Password shall meet minimum complexity (8+ chars, upper, lower, number) | Must |

---

## FR-2: Landing Page (Phase 3)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-2.1 | Public landing page with hero, CTA to register/login | Must |
| FR-2.2 | Features section highlighting 5 core modules | Must |
| FR-2.3 | Testimonials carousel (static seed data) | Should |
| FR-2.4 | Pricing section (3 tiers — display only in MVP) | Should |
| FR-2.5 | FAQ accordion | Must |
| FR-2.6 | Footer with links, social, legal placeholders | Must |
| FR-2.7 | Framer Motion scroll and entrance animations | Should |
| FR-2.8 | Page shall achieve Lighthouse performance score > 85 | Should |

---

## FR-3: Dashboard (Phase 4)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-3.1 | Authenticated layout with collapsible sidebar and top navbar | Must |
| FR-3.2 | Profile section showing avatar, name, email | Must |
| FR-3.3 | Metrics cards: Problems Solved, Resume Score, Interview Score, GitHub Score, Placement Readiness | Must |
| FR-3.4 | Charts: weekly activity, topic progress (Recharts) | Must |
| FR-3.5 | Activity feed of recent submissions, analyses, interviews | Must |
| FR-3.6 | Sidebar navigation to all modules | Must |
| FR-3.7 | Dashboard data shall refresh via React Query with stale-while-revalidate | Must |

---

## FR-4: DSA Coding Arena (Phase 5)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-4.1 | Problem list with pagination, search, difficulty filter | Must |
| FR-4.2 | Topic filters: Arrays, Strings, Linked Lists, Trees, Graphs, DP, Greedy | Must |
| FR-4.3 | Problem detail page with description, constraints, examples | Must |
| FR-4.4 | Monaco-based code editor with language selection | Must |
| FR-4.5 | Supported languages: JavaScript, Python, Java, C++, Go | Must |
| FR-4.6 | Submit code to Judge0; run against visible + hidden test cases | Must |
| FR-4.7 | Display verdict: Accepted, Wrong Answer, TLE, MLE, Runtime Error, CE | Must |
| FR-4.8 | Submission history per user per problem | Must |
| FR-4.9 | AI hint generation via Gemini (rate-limited, no full solution) | Must |
| FR-4.10 | Admin can CRUD problems (Phase 12) | Must |

---

## FR-5: Resume Analyzer (Phase 6)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-5.1 | Upload PDF resume (max 5 MB) to S3 | Must |
| FR-5.2 | Parse resume text from PDF | Must |
| FR-5.3 | Calculate ATS compatibility score (0–100) | Must |
| FR-5.4 | Extract skills, experience, education sections | Must |
| FR-5.5 | Keyword analysis vs. target role (user-selectable) | Must |
| FR-5.6 | AI-generated improvement suggestions via Gemini | Must |
| FR-5.7 | Store analysis history per user | Must |
| FR-5.8 | Display previous analyses on dashboard metric | Must |

---

## FR-6: AI Mock Interviewer (Phase 7)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-6.1 | Interview types: Technical, HR, Behavioral | Must |
| FR-6.2 | User selects target role (e.g., SDE-1, SDE-2) | Must |
| FR-6.3 | User selects target company from supported list | Must |
| FR-6.4 | AI asks sequential questions via Gemini | Must |
| FR-6.5 | User submits text answers per question | Must |
| FR-6.6 | AI evaluates each answer with score and feedback | Must |
| FR-6.7 | Session summary: overall score, strengths, improvements | Must |
| FR-6.8 | Store session history with Q&A transcript | Must |

---

## FR-7: GitHub Analyzer (Phase 8)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-7.1 | Connect GitHub via OAuth | Must |
| FR-7.2 | Fetch public repos, commits, contributions | Must |
| FR-7.3 | Calculate GitHub score (0–100) based on weighted criteria | Must |
| FR-7.4 | Repository quality analysis (README, stars, activity) | Must |
| FR-7.5 | Commit frequency and consistency metrics | Must |
| FR-7.6 | Visual analytics charts on profile page | Must |
| FR-7.7 | Cache GitHub data in Redis (TTL 1 hour) | Should |

---

## FR-8: LeetCode Tracker (Phase 9)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-8.1 | User links LeetCode username | Must |
| FR-8.2 | Display problem statistics (easy/medium/hard solved) | Must |
| FR-8.3 | Show contest rating if available | Should |
| FR-8.4 | Topic-wise progress breakdown | Must |
| FR-8.5 | Submission analytics (acceptance rate trends) | Should |
| FR-8.6 | Feed data into Placement Readiness Engine | Must |

---

## FR-9: Company Question Bank (Phase 10)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-9.1 | Seed questions for: Google, Amazon, Microsoft, Adobe, Atlassian, Goldman Sachs, Infosys | Must |
| FR-9.2 | Filter by company | Must |
| FR-9.3 | Filter by topic (DSA, System Design, HR, etc.) | Must |
| FR-9.4 | Full-text search on question title/tags | Must |
| FR-9.5 | Bookmark questions per user | Must |
| FR-9.6 | View bookmarked list | Must |

---

## FR-10: Placement Readiness Engine (Phase 11)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-10.1 | Compute composite readiness score (0–100) from weighted sub-scores | Must |
| FR-10.2 | Weights: DSA 30%, Resume 20%, Interview 25%, GitHub 15%, LeetCode 10% | Must |
| FR-10.3 | Detect weak areas below threshold (< 60) | Must |
| FR-10.4 | Generate personalized learning roadmap | Must |
| FR-10.5 | AI-powered weekly suggestions via Gemini | Must |
| FR-10.6 | Recalculate on relevant module completion | Must |

---

## FR-11: Admin Panel (Phase 12)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-11.1 | Admin-only route guard | Must |
| FR-11.2 | User list with search, role filter, deactivate | Must |
| FR-11.3 | DSA problem CRUD | Must |
| FR-11.4 | Company question CRUD | Must |
| FR-11.5 | Platform analytics: registrations, submissions, active users | Must |
| FR-11.6 | Export reports as CSV | Should |

---

## FR-12: DevOps (Phase 13)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-12.1 | Docker Compose for local dev (postgres, redis, api, web) | Must |
| FR-12.2 | GitHub Actions CI: lint, test, build | Must |
| FR-12.3 | Vercel deployment config for frontend | Must |
| FR-12.4 | AWS deployment guide for backend + RDS | Must |

---

## Requirement Traceability

```
Persona → Epic → FR-ID → Phase → API Endpoint → DB Table
```

All FR IDs map to API endpoints documented in `10-api-design.md` and tables in `08-database-schema.md`.
