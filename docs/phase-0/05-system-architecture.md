# System Architecture

## InterviewGPT — C4 Model Overview

**Version:** 1.0.0

---

## 1. Context Diagram (C4 Level 1)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              EXTERNAL ACTORS                                 │
├──────────────┬──────────────┬──────────────┬──────────────┬───────────────┤
│   Student    │    Admin     │ Google OAuth │ GitHub OAuth │  Gemini API   │
│   (Browser)  │  (Browser)   │              │              │               │
└──────┬───────┴──────┬───────┴──────┬───────┴──────┬───────┴───────┬───────┘
       │              │              │              │               │
       │  HTTPS       │  HTTPS       │  OAuth       │  OAuth        │  REST
       ▼              ▼              ▼              ▼               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                         INTERVIEWGPT PLATFORM                               │
│                                                                             │
│   ┌─────────────────┐         ┌─────────────────┐                          │
│   │  React SPA      │ ◄─────► │  Express API    │                          │
│   │  (Vite/Vercel)  │   REST  │  (Node/AWS)     │                          │
│   └─────────────────┘         └────────┬────────┘                          │
│                                        │                                    │
└────────────────────────────────────────┼────────────────────────────────────┘
                                         │
              ┌──────────────────────────┼──────────────────────────┐
              ▼                          ▼                          ▼
       ┌─────────────┐           ┌─────────────┐           ┌─────────────┐
       │ PostgreSQL  │           │    Redis    │           │   AWS S3    │
       │  (RDS)      │           │  (ElastiCache)          │  (Files)    │
       └─────────────┘           └─────────────┘           └─────────────┘
                                         │
                                         ▼
                                  ┌─────────────┐
                                  │   Judge0    │
                                  │  (External) │
                                  └─────────────┘
```

---

## 2. Container Diagram (C4 Level 2)

| Container | Technology | Responsibility |
|-----------|------------|----------------|
| **Web App** | React + Vite + Tailwind + Shadcn | UI, client-side routing, React Query data fetching |
| **API Server** | Express + TypeScript | REST API, auth, business logic, AI orchestration |
| **Worker** (optional Phase 5+) | BullMQ consumer | Async Judge0 submissions, heavy AI jobs |
| **PostgreSQL** | Prisma ORM | Persistent relational data |
| **Redis** | ioredis | Session cache, rate limits, GitHub/readiness cache |
| **S3** | AWS SDK v3 | Resume PDFs, generated reports |
| **CI/CD** | GitHub Actions | Lint, test, build, deploy |

---

## 3. Deployment Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         PRODUCTION                                │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────┐      ┌─────────────┐      ┌─────────────┐     │
│   │   Vercel    │      │  AWS ALB    │      │  AWS RDS    │     │
│   │  (Frontend) │─────►│  EC2/ECS    │─────►│ PostgreSQL  │     │
│   │  CDN Edge   │ API  │  (Backend)  │      └─────────────┘     │
│   └─────────────┘      └──────┬──────┘                           │
│                               │                                   │
│                               ├──► ElastiCache (Redis)            │
│                               ├──► S3 (resumes)                   │
│                               └──► Secrets Manager                │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                      LOCAL DEVELOPMENT                            │
├──────────────────────────────────────────────────────────────────┤
│   docker-compose.yml                                              │
│   ├── postgres:5432                                               │
│   ├── redis:6379                                                  │
│   ├── api:4000  (hot reload)                                      │
│   └── web:5173  (Vite dev server)                                 │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. Architectural Style

| Pattern | Application |
|---------|-------------|
| **Monorepo** | `apps/web`, `apps/api`, `packages/shared` |
| **Layered backend** | Routes → Controllers → Services → Repositories (Prisma) |
| **Feature-based frontend** | `features/auth`, `features/dsa`, etc. |
| **BFF-lite** | API aggregates dashboard metrics in single endpoint |
| **CQRS-lite** | Read-heavy dashboard uses cached aggregates |
| **Event-driven (future)** | Readiness recalc on submission events |

---

## 5. Technology Decision Records (Summary)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Monorepo tool | npm workspaces + Turborepo (optional) | Simple; shared types package |
| ORM | Prisma | Type-safe, migrations, great TS DX |
| Auth | JWT + refresh rotation | Stateless API; OAuth for Google |
| UI library | Shadcn + Tailwind | Premium look; full control |
| State (server) | React Query | Cache, invalidation, loading states |
| State (client) | Zustand (minimal) | Theme, sidebar collapse only |
| AI provider | Gemini | Cost-effective; strong reasoning |
| Code execution | Judge0 | Industry standard; multi-language |
| Validation | Zod (shared package) | Single source of truth FE/BE |

---

## 6. Security Architecture

```
Request
   │
   ▼
┌──────────────┐
│ Rate Limiter │ (Redis)
└──────┬───────┘
       ▼
┌──────────────┐
│   Helmet     │ (Security headers)
└──────┬───────┘
       ▼
┌──────────────┐
│     CORS     │
└──────┬───────┘
       ▼
┌──────────────┐
│ Auth Middleware │ (JWT verify)
└──────┬───────┘
       ▼
┌──────────────┐
│ Role Guard   │ (STUDENT | ADMIN)
└──────┬───────┘
       ▼
┌──────────────┐
│ Zod Validate │
└──────┬───────┘
       ▼
   Controller
```

---

## 7. Data Flow — Placement Readiness Score

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ DSA Module  │  │   Resume    │  │  Interview  │  │   GitHub    │
│  (30%)      │  │   (20%)     │  │   (25%)     │  │   (15%)     │
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │              │              │              │
       └──────────────┴──────────────┴──────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ Readiness Engine │
                    │  Weighted Score  │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        Weak Areas    Learning Roadmap   AI Suggestions
              │              │              │
              └──────────────┴──────────────┘
                             ▼
                      Dashboard Metric
```

---

## 8. Integration Points

| External Service | Protocol | Auth | Used In |
|------------------|----------|------|---------|
| Google OAuth | OAuth 2.0 | Client ID/Secret | Phase 2 |
| GitHub OAuth | OAuth 2.0 | Client ID/Secret | Phase 8 |
| Gemini API | REST | API Key | Phases 5–7, 11 |
| Judge0 | REST | API Key / self-hosted | Phase 5 |
| AWS S3 | SDK | IAM credentials | Phase 6 |
| LeetCode (unofficial) | GraphQL/scrape | Username | Phase 9 |

---

## 9. Environment Separation

| Environment | Frontend | Backend | Database |
|-------------|----------|---------|----------|
| Development | localhost:5173 | localhost:4000 | Docker PostgreSQL |
| Staging | Vercel preview | AWS staging ECS | RDS staging |
| Production | Vercel prod | AWS prod ECS | RDS prod |

---

## 10. Architecture Principles

1. **API-first** — Frontend consumes documented REST; mobile-ready path
2. **Fail closed** — Auth errors deny access; no partial data leaks
3. **Idempotent writes** — Submissions, analyses use unique constraints
4. **Cache invalidation** — Explicit React Query keys + Redis TTLs
5. **Progressive enhancement** — Core flows work without AI if degraded
