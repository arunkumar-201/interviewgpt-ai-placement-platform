# Phase 5 — DSA Coding Arena

## API Endpoints (authenticated)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/problems` | List problems |
| GET | `/api/v1/problems/:slug` | Problem detail |
| POST | `/api/v1/problems/run` | Run code (slug in JSON body) |
| POST | `/api/v1/problems/submit` | Submit code (slug in JSON body) |
| POST | `/api/v1/problems/:slug/run` | Run code |
| POST | `/api/v1/problems/:slug/submit` | Submit code |
| GET | `/api/v1/problems/:slug/submissions` | Submission history |

Legacy alias: `/api/v1/dsa/problems/*` (same handlers).

## Execution

- **Judge0** (Docker): `judge0-server:2358` inside compose network; `localhost:2358` on host
- **Local fallback**: Python/JS via subprocess when Judge0 unreachable (`JUDGE0_LOCAL_FALLBACK=true`, default in development)

## Seed

50 LeetCode-style problems with full descriptions, hints, editorial, companies, and test cases:

```bash
npm run db:push
npm run db:seed
```

## Verify

```bash
curl http://localhost:4000/api/v1/ready
npx tsx apps/api/scripts/verify-execution.ts
```
