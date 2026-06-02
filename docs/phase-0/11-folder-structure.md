# Folder Structure

## InterviewGPT — Monorepo Layout

**Version:** 1.0.0  
**Package Manager:** npm workspaces

---

## Root Structure

```
interviewgpt/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Lint, test, build (Phase 13)
│       └── deploy.yml                # Deploy pipelines (Phase 13)
├── apps/
│   ├── web/                          # React frontend (Vite)
│   └── api/                          # Express backend
├── packages/
│   └── shared/                       # Shared types, Zod schemas, constants
├── docs/
│   └── phase-0/                      # Architecture docs (this phase)
├── docker/
│   ├── Dockerfile.api
│   ├── Dockerfile.web
│   └── nginx.conf                    # Optional prod web serving
├── .env.example
├── .gitignore
├── .prettierrc
├── .eslintrc.cjs
├── docker-compose.yml
├── docker-compose.prod.yml
├── package.json                      # Workspace root
├── turbo.json                        # Optional Turborepo config
├── tsconfig.base.json
└── README.md                         # Phase 15
```

---

## Frontend — `apps/web/`

```
apps/web/
├── public/
│   ├── favicon.ico
│   └── og-image.png
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── router.tsx                # React Router v6 routes
│   │   └── providers.tsx             # QueryClient, Theme, Auth providers
│   ├── assets/
│   │   └── images/
│   ├── components/
│   │   ├── ui/                       # Shadcn components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   └── common/
│   │       ├── Logo.tsx
│   │       ├── PageLoader.tsx
│   │       ├── EmptyState.tsx
│   │       ├── ErrorBoundary.tsx
│   │       └── MetricCard.tsx
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   ├── ForgotPasswordForm.tsx
│   │   │   │   └── GoogleAuthButton.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   ├── RegisterPage.tsx
│   │   │   │   └── ...
│   │   │   └── api/
│   │   │       └── auth.api.ts
│   │   ├── landing/
│   │   │   ├── components/
│   │   │   │   ├── Hero.tsx
│   │   │   │   ├── Features.tsx
│   │   │   │   ├── Testimonials.tsx
│   │   │   │   ├── Pricing.tsx
│   │   │   │   └── FAQ.tsx
│   │   │   └── pages/
│   │   │       └── LandingPage.tsx
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   ├── MetricsGrid.tsx
│   │   │   │   ├── ActivityChart.tsx
│   │   │   │   ├── TopicChart.tsx
│   │   │   │   └── ActivityFeed.tsx
│   │   │   ├── pages/
│   │   │   │   └── DashboardPage.tsx
│   │   │   └── api/
│   │   │       └── dashboard.api.ts
│   │   ├── dsa/
│   │   │   ├── components/
│   │   │   │   ├── ProblemList.tsx
│   │   │   │   ├── ProblemFilters.tsx
│   │   │   │   ├── CodeEditor.tsx
│   │   │   │   ├── SubmissionPanel.tsx
│   │   │   │   └── HintPanel.tsx
│   │   │   ├── pages/
│   │   │   │   ├── ProblemListPage.tsx
│   │   │   │   └── ProblemDetailPage.tsx
│   │   │   └── api/
│   │   │       └── dsa.api.ts
│   │   ├── resume/
│   │   ├── interview/
│   │   ├── github/
│   │   ├── leetcode/
│   │   ├── company-bank/
│   │   ├── readiness/
│   │   └── admin/
│   ├── hooks/
│   │   ├── useTheme.ts
│   │   └── useMediaQuery.ts
│   ├── lib/
│   │   ├── api-client.ts
│   │   ├── query-client.ts
│   │   ├── token-storage.ts
│   │   └── utils.ts
│   ├── stores/
│   │   └── ui.store.ts               # Sidebar, theme (Zustand)
│   ├── styles/
│   │   └── globals.css               # Tailwind directives
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── components.json                   # Shadcn config
├── tailwind.config.ts
├── postcss.config.js
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
└── package.json
```

---

## Backend — `apps/api/`

```
apps/api/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── config/
│   │   ├── env.ts                    # Zod-validated env
│   │   ├── cors.ts
│   │   └── constants.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── dashboard.controller.ts
│   │   ├── dsa.controller.ts
│   │   ├── resume.controller.ts
│   │   ├── interview.controller.ts
│   │   ├── github.controller.ts
│   │   ├── leetcode.controller.ts
│   │   ├── question.controller.ts
│   │   ├── readiness.controller.ts
│   │   └── admin.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── token.service.ts
│   │   ├── email.service.ts
│   │   ├── user.service.ts
│   │   ├── dashboard.service.ts
│   │   ├── dsa.service.ts
│   │   ├── judge0.service.ts
│   │   ├── resume.service.ts
│   │   ├── pdf-parser.service.ts
│   │   ├── s3.service.ts
│   │   ├── interview.service.ts
│   │   ├── gemini.service.ts
│   │   ├── github.service.ts
│   │   ├── leetcode.service.ts
│   │   ├── question.service.ts
│   │   ├── readiness.service.ts
│   │   ├── activity.service.ts
│   │   └── admin.service.ts
│   ├── routes/
│   │   ├── index.ts                  # Mount all v1 routes
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── dashboard.routes.ts
│   │   ├── dsa.routes.ts
│   │   ├── resume.routes.ts
│   │   ├── interview.routes.ts
│   │   ├── github.routes.ts
│   │   ├── leetcode.routes.ts
│   │   ├── question.routes.ts
│   │   ├── readiness.routes.ts
│   │   └── admin.routes.ts
│   ├── middleware/
│   │   ├── authenticate.ts
│   │   ├── requireRole.ts
│   │   ├── validate.ts
│   │   ├── errorHandler.ts
│   │   ├── rateLimiter.ts
│   │   ├── requestId.ts
│   │   └── logger.ts
│   ├── lib/
│   │   ├── prisma.ts                 # Singleton PrismaClient
│   │   ├── redis.ts                  # Singleton Redis client
│   │   └── logger.ts
│   ├── errors/
│   │   └── app.error.ts
│   ├── types/
│   │   └── express.d.ts              # Extend Request with user
│   ├── utils/
│   │   ├── pagination.ts
│   │   └── hash.ts
│   ├── app.ts                        # Express app setup
│   └── server.ts                     # Entry point
├── tests/
│   ├── unit/
│   ├── integration/
│   └── setup.ts
├── tsconfig.json
├── nodemon.json                      # Dev hot reload
└── package.json
```

---

## Shared Package — `packages/shared/`

```
packages/shared/
├── src/
│   ├── schemas/
│   │   ├── auth.schema.ts
│   │   ├── user.schema.ts
│   │   ├── dsa.schema.ts
│   │   ├── resume.schema.ts
│   │   ├── interview.schema.ts
│   │   └── index.ts
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── user.types.ts
│   │   ├── dsa.types.ts
│   │   ├── dashboard.types.ts
│   │   └── index.ts
│   ├── constants/
│   │   ├── enums.ts
│   │   ├── companies.ts
│   │   └── readiness-weights.ts
│   └── index.ts
├── tsconfig.json
└── package.json
```

---

## Naming Conventions

| Item | Convention | Example |
|------|------------|---------|
| React components | PascalCase | `MetricCard.tsx` |
| Hooks | camelCase, `use` prefix | `useAuth.ts` |
| API routes | kebab-case paths | `/api/v1/dsa/problems` |
| Services | camelCase + `.service.ts` | `auth.service.ts` |
| Controllers | camelCase + `.controller.ts` | `auth.controller.ts` |
| DB models | PascalCase (Prisma) | `DsaProblem` |
| Env vars | SCREAMING_SNAKE | `DATABASE_URL` |
| CSS | Tailwind utilities | No custom CSS unless needed |

---

## Import Aliases

```json
// apps/web/tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@interviewgpt/shared": ["../../packages/shared/src"]
    }
  }
}

// apps/api/tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@interviewgpt/shared": ["../../packages/shared/src"]
    }
  }
}
```

---

## File Creation Order (Phase 1)

1. Root `package.json` + workspaces
2. `packages/shared` — base types and schemas
3. `apps/api` — Express + Prisma skeleton
4. `apps/web` — Vite + Tailwind + Shadcn
5. `docker-compose.yml`
6. `.env.example`
