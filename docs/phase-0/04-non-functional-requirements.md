# Non-Functional Requirements

## InterviewGPT — Quality Attributes

**Version:** 1.0.0

---

## 1. Performance

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-P1 | API response time (non-AI endpoints) p95 | < 500 ms |
| NFR-P2 | API response time (AI endpoints) p95 | < 8 s |
| NFR-P3 | Frontend First Contentful Paint | < 1.5 s |
| NFR-P4 | Frontend Time to Interactive | < 3.5 s |
| NFR-P5 | Dashboard initial load (cached metrics) | < 2 s |
| NFR-P6 | DSA code submission round-trip (Judge0) | < 15 s |
| NFR-P7 | Resume PDF upload + analysis | < 30 s |
| NFR-P8 | Concurrent users (MVP target) | 500 simultaneous |
| NFR-P9 | Database query p95 | < 100 ms |

**Implementation:** Redis caching for dashboard metrics, GitHub data, readiness scores; connection pooling (PgBouncer in prod); React Query stale times; code splitting via Vite lazy routes.

---

## 2. Scalability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-S1 | Horizontal scaling of API servers | Stateless JWT; load balancer ready |
| NFR-S2 | Database | PostgreSQL with read replica path (documented, optional MVP) |
| NFR-S3 | File storage | S3 with CDN for static assets |
| NFR-S4 | Background jobs | BullMQ queue for Judge0 submissions, AI tasks (Phase 5+) |
| NFR-S5 | Rate limiting | Redis-backed; 100 req/min per user on API |

---

## 3. Availability & Reliability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-A1 | Uptime target (production) | 99.5% |
| NFR-A2 | Graceful degradation when AI unavailable | Show cached/fallback message |
| NFR-A3 | Graceful degradation when Judge0 unavailable | Queue submission, notify user |
| NFR-A4 | Health check endpoints | `/health`, `/ready` |
| NFR-A5 | Database migrations | Zero-downtime via Prisma migrate |

---

## 4. Security

| ID | Requirement | Implementation |
|----|-------------|----------------|
| NFR-SEC1 | Password storage | bcrypt (cost factor 12) |
| NFR-SEC2 | JWT signing | RS256 or HS256 with secret rotation docs |
| NFR-SEC3 | HTTPS only in production | Enforced at load balancer |
| NFR-SEC4 | CORS | Whitelist frontend origin only |
| NFR-SEC5 | Input validation | Zod on all API inputs |
| NFR-SEC6 | SQL injection prevention | Prisma parameterized queries |
| NFR-SEC7 | XSS prevention | React escaping; CSP headers |
| NFR-SEC8 | File upload validation | MIME check, size limit, virus scan hook (documented) |
| NFR-SEC9 | Rate limiting | express-rate-limit + Redis store |
| NFR-SEC10 | Secrets management | Environment variables; never committed |
| NFR-SEC11 | OAuth state parameter | CSRF protection for Google/GitHub OAuth |
| NFR-SEC12 | Refresh token rotation | Invalidate on reuse detection |

---

## 5. Maintainability

| ID | Requirement | Implementation |
|----|-------------|----------------|
| NFR-M1 | Code style | ESLint + Prettier; shared config in monorepo |
| NFR-M2 | Module boundaries | Feature folders; dependency injection for services |
| NFR-M3 | API versioning | `/api/v1/*` prefix |
| NFR-M4 | Error handling | Central error middleware; typed AppError hierarchy |
| NFR-M5 | Logging | Winston/Pino structured logs with request ID |
| NFR-M6 | Documentation | OpenAPI/Swagger for API (Phase 15) |

---

## 6. Usability & Accessibility

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-U1 | WCAG compliance | Level AA for core flows |
| NFR-U2 | Keyboard navigation | All interactive elements focusable |
| NFR-U3 | Screen reader support | ARIA labels on Shadcn components |
| NFR-U4 | Color contrast | Minimum 4.5:1 ratio |
| NFR-U5 | Loading states | Skeleton loaders on all async views |
| NFR-U6 | Empty states | Actionable CTAs when no data |

---

## 7. Compatibility

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-C1 | Browsers | Chrome 100+, Firefox 100+, Safari 15+, Edge 100+ |
| NFR-C2 | Mobile | iOS Safari 15+, Chrome Android 100+ |
| NFR-C3 | Node.js | 20 LTS |
| NFR-C4 | PostgreSQL | 15+ |
| NFR-C5 | Redis | 7+ |

---

## 8. Data & Privacy

| ID | Requirement | Implementation |
|----|-------------|----------------|
| NFR-D1 | Data retention | User can delete account; cascade delete PII |
| NFR-D2 | Resume storage | S3 private bucket; presigned URLs only |
| NFR-D3 | AI data handling | No PII in prompts where avoidable; log redaction |
| NFR-D4 | GDPR-ready patterns | Export user data endpoint (Phase 15) |
| NFR-D5 | Audit trail | Admin actions logged |

---

## 9. Testability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-T1 | Backend unit test coverage | > 70% on services |
| NFR-T2 | API integration tests | All auth + core CRUD paths |
| NFR-T3 | Frontend component tests | Critical UI flows (Vitest + Testing Library) |
| NFR-T4 | E2E smoke tests | Login → dashboard → DSA submit (Playwright, Phase 14) |

---

## 10. Observability

| ID | Requirement | Implementation |
|----|-------------|----------------|
| NFR-O1 | Request tracing | Correlation ID header `X-Request-Id` |
| NFR-O2 | Metrics | Prometheus-compatible `/metrics` (optional MVP) |
| NFR-O3 | Error tracking | Sentry integration hook (documented) |
| NFR-O4 | AI usage tracking | Token count logs per request |

---

## NFR Priority Matrix

```
                    IMPACT
                 High    Low
            ┌─────────┬─────────┐
      High  │ SEC, P  │ U, C    │
 EFFORT     ├─────────┼─────────┤
      Low   │ M, T    │ O, A    │
            └─────────┴─────────┘
```

**Phase 1 must implement:** NFR-SEC1–5, NFR-M1–4, NFR-P9 baseline, NFR-C1–5.
