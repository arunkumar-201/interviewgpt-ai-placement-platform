# InterviewGPT

AI-powered placement preparation platform — DSA practice, resume analysis, mock interviews, GitHub insights, and placement readiness scoring.

**Current phase:** Phase 2 — Authentication System ✅

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Shadcn UI, Framer Motion, React Query |
| Backend | Node.js 20, Express, TypeScript |
| Database | PostgreSQL 15 + Prisma ORM |
| Cache | Redis 7 |
| Monorepo | npm workspaces |

---

## Prerequisites

- **Node.js** 20 LTS or later
- **npm** 10+
- **Docker Desktop** (for PostgreSQL and Redis)

---

## Installation

### 1. Clone and install dependencies

```bash
git clone <repository-url>
cd interviewgpt
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` if needed. Defaults work for local Docker setup.

### 3. Start PostgreSQL and Redis

```bash
docker compose up -d postgres redis
```

Wait until both services are healthy:

```bash
docker compose ps
```

### 4. Push database schema

```bash
npm run db:push
```

Generate Prisma client (also runs automatically on install):

```bash
npm run db:generate
```

### 5. Seed default data (companies)

```bash
npm run db:seed -w @interviewgpt/api
```

### 6. Start development servers

```bash
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| API | http://localhost:4000 |
| Health check | http://localhost:4000/api/v1/health |
| Readiness check | http://localhost:4000/api/v1/ready |
| Prisma Studio | `npm run db:studio` |

---

## Docker (Full Stack)

Run API, web, PostgreSQL, and Redis together:

```bash
docker compose up --build
```

---

## Project Structure

```
interviewgpt/
├── apps/
│   ├── api/          # Express + Prisma backend
│   └── web/          # React + Vite frontend
├── packages/
│   └── shared/       # Shared types, Zod schemas, constants
├── docker/           # Dockerfiles
├── docs/             # Architecture & phase documentation
├── docker-compose.yml
├── .env.example
└── package.json
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start API + Web concurrently |
| `npm run build` | Build all workspaces |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Create and run migrations |
| `npm run db:studio` | Open Prisma Studio |
| `npm run lint` | Type-check all packages |

---

## Phase 2 Testing Checklist

- [ ] Register new student at `/register` → redirects to `/dashboard`
- [ ] Logout → cookies cleared, redirects to `/login`
- [ ] Login with registered credentials → dashboard loads
- [ ] `GET /api/v1/auth/me` returns user when cookies set
- [ ] Forgot password logs reset URL in API terminal (dev)
- [ ] Reset password with token from URL → can login with new password
- [ ] Access `/dashboard` without auth → redirects to `/login`
- [ ] Admin login (`admin@interviewgpt.dev`) → `GET /api/v1/admin/ping` succeeds
- [ ] Student login → `GET /api/v1/admin/ping` returns 403
- [ ] Google OAuth works when `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
- [ ] Rate limit: 11 rapid login attempts → 429 response

---

## Phase 1 Testing Checklist

- [ ] `npm install` completes without errors
- [ ] `docker compose up -d postgres redis` starts databases
- [ ] `npm run db:push` applies schema successfully
- [ ] `npm run db:seed -w @interviewgpt/api` seeds 7 companies
- [ ] `npm run dev` starts API on port 4000 and Web on port 5173
- [ ] `GET http://localhost:4000/api/v1/health` returns `{ status: "ok" }`
- [ ] `GET http://localhost:4000/api/v1/ready` shows `db: connected`, `redis: connected`
- [ ] Frontend at http://localhost:5173 shows system status card with all green
- [ ] Shadcn UI components render (Button, Card, Input)
- [ ] Shared package `@interviewgpt/shared` imports work in API and Web

---

## Documentation

Architecture and planning docs: [`docs/phase-0/`](./docs/phase-0/)

---

## License

Private — portfolio project.
