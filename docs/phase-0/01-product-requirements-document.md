# Product Requirements Document (PRD)

## InterviewGPT — AI Placement Preparation Platform

**Document Owner:** Product Team  
**Version:** 1.0.0  
**Status:** Draft for Review

---

## 1. Executive Summary

InterviewGPT is a flagship portfolio SaaS platform that consolidates placement preparation into a single, AI-enhanced experience. Students currently juggle LeetCode, resume builders, mock interview tools, and GitHub analytics across fragmented platforms. InterviewGPT unifies these workflows and adds intelligent scoring, personalized roadmaps, and company-specific preparation.

---

## 2. Problem Statement

| Pain Point | Current State | InterviewGPT Solution |
|------------|---------------|----------------------|
| Fragmented tools | 5+ apps for DSA, resume, interviews | Unified dashboard with cross-module scoring |
| No holistic readiness view | Students guess if they're "ready" | Placement Readiness Engine with weighted scores |
| Generic mock interviews | Static question banks | AI-driven, role/company-specific interviews |
| Resume ATS uncertainty | Manual keyword stuffing | AI resume analyzer with ATS score + suggestions |
| GitHub undervalued | Profiles ignored in prep | GitHub analyzer with contribution & quality metrics |
| Company-specific prep | Scattered blog posts | Curated company question bank with filters |

---

## 3. Product Vision

> *"One platform that tells every student exactly where they stand, what to fix, and how to get their dream offer."*

---

## 4. Goals & Success Metrics

### 4.1 Business Goals

- Demonstrate full-stack + AI + DevOps capability as a portfolio flagship
- Production-grade architecture suitable for real user onboarding
- Modular design enabling future monetization (freemium tiers)

### 4.2 User Goals

- Reduce time-to-placement-readiness through actionable insights
- Practice DSA with instant feedback and AI hints
- Improve resume and GitHub profile measurably
- Simulate real interviews with structured feedback

### 4.3 Key Performance Indicators (KPIs)

| Metric | Target (MVP) | Measurement |
|--------|--------------|-------------|
| User registration completion | > 85% | Funnel analytics |
| Daily active users (DAU) | Baseline TBD post-launch | Analytics |
| DSA submission success rate | Track per difficulty | Submissions table |
| Resume analysis completion | < 30s end-to-end | APM |
| Mock interview session completion | > 70% | Session analytics |
| Placement readiness score engagement | Weekly recalculation | Cron + user events |
| API p95 latency | < 500ms (non-AI) | APM |
| AI endpoint p95 latency | < 8s | APM |

---

## 5. Target Audience

- **Primary:** Final-year engineering students (CS/IT) preparing for campus/off-campus placements
- **Secondary:** Early-career professionals switching roles; placement cell coordinators (admin)
- **Geography:** India-first (company bank reflects Indian placement landscape); globally extensible

---

## 6. Product Scope

### 6.1 In Scope (MVP — Phases 1–15)

- Authentication (email + Google OAuth, JWT, roles)
- Marketing landing page
- Student dashboard with unified metrics
- DSA coding arena (Judge0 integration)
- Resume analyzer (PDF upload, ATS scoring, AI suggestions)
- AI mock interviewer (technical, HR, behavioral)
- GitHub profile analyzer
- LeetCode progress tracker (manual/API sync where feasible)
- Company question bank (7 launch companies)
- Placement readiness engine
- Admin panel (users, questions, analytics)
- Docker + CI/CD + deployment configs
- Test suite + documentation

### 6.2 Out of Scope (V1)

- Mobile native apps (responsive web only)
- Live 1:1 human mock interviews
- Payment/subscription billing (architecture预留, not implemented)
- Real-time collaborative coding
- Campus placement cell bulk onboarding
- Video/audio interview recording analysis

### 6.3 Future Considerations (V2+)

- Stripe/Razorpay subscriptions
- Peer mock interviews
- Mentor marketplace
- Company-specific study plans
- Mobile PWA with offline DSA practice

---

## 7. User Stories (Epic Level)

### Epic 1: Onboarding & Identity
- As a student, I want to register and log in with Google so I can start quickly.
- As a student, I want a personalized dashboard so I see my readiness at a glance.

### Epic 2: DSA Practice
- As a student, I want to solve coding problems in-browser so I can practice anywhere.
- As a student, I want AI hints when stuck so I learn without full solutions.

### Epic 3: Resume & Profile
- As a student, I want my resume scored for ATS so I know if recruiters will see it.
- As a student, I want my GitHub analyzed so I can improve project visibility.

### Epic 4: Interview Simulation
- As a student, I want mock interviews tailored to a company/role so practice feels realistic.
- As a student, I want detailed feedback and scores after each session.

### Epic 5: Strategic Preparation
- As a student, I want company-specific question lists so I prepare efficiently.
- As a student, I want a readiness score and roadmap so I know what to study next.

### Epic 6: Administration
- As an admin, I want to manage users and questions so the platform stays curated.

---

## 8. Assumptions & Dependencies

| Assumption | Dependency |
|------------|------------|
| Users have modern browsers (Chrome, Firefox, Safari, Edge) | Vite + React 18 |
| Judge0 API available (self-hosted or RapidAPI) | Phase 5 |
| Gemini API key with sufficient quota | Phases 5–7, 11 |
| AWS S3 bucket for file storage | Phase 6 |
| GitHub OAuth app for analyzer | Phase 8 |
| PostgreSQL + Redis available locally via Docker | Phase 1 |

---

## 9. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| AI API cost/latency | High | Redis caching, rate limits, prompt optimization |
| Judge0 downtime | Medium | Queue retries, graceful degradation UI |
| Resume parsing inaccuracy | Medium | Multi-parser fallback, user-editable extracted fields |
| Scope creep | High | Strict phase gates; STOP after each phase |
| Security (JWT, file uploads) | High | Helmet, rate limiting, S3 presigned URLs, input validation |

---

## 10. Release Strategy

| Release | Phases | Milestone |
|---------|--------|-----------|
| Alpha | 1–3 | Auth + landing page live |
| Beta | 4–7 | Core student features |
| RC | 8–11 | Full feature set |
| GA | 12–15 | Admin, DevOps, tests, docs |

---

## 11. Approval Criteria for Phase 0

- [ ] Stakeholder review of scope and architecture
- [ ] Database schema validated against all feature modules
- [ ] API design covers all Phase 2–12 endpoints
- [ ] Folder structure agreed for monorepo layout
- [ ] Roadmap timeline acceptable

**Proceed to Phase 1 upon explicit approval.**
