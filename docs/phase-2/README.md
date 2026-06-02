# Phase 2 — Authentication System

**Status:** Complete — Awaiting approval before Phase 3

---

## Features Delivered

- Email/password register & login
- Logout with refresh token revocation
- Forgot & reset password flow
- JWT access tokens (15m) + refresh tokens (7d) with rotation
- HttpOnly secure cookies (`ig_access_token`, `ig_refresh_token`)
- Google OAuth 2.0
- `authenticate` + `requireRole` middleware
- Rate limiting (10/min auth, 100/min general)
- Admin user seed
- Frontend auth pages + protected routes

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/auth/register` | Public | Register student |
| POST | `/api/v1/auth/login` | Public | Login |
| POST | `/api/v1/auth/logout` | Cookie | Revoke refresh token |
| POST | `/api/v1/auth/refresh` | Cookie | Rotate tokens |
| POST | `/api/v1/auth/forgot-password` | Public | Send reset email |
| POST | `/api/v1/auth/reset-password` | Public | Reset password |
| GET | `/api/v1/auth/me` | Required | Current user |
| GET | `/api/v1/auth/google` | Public | Google OAuth redirect |
| GET | `/api/v1/auth/google/callback` | Public | OAuth callback |
| GET | `/api/v1/admin/ping` | Admin | RBAC test endpoint |

---

## Default Admin (after seed)

- Email: `admin@interviewgpt.dev`
- Password: `ChangeMeAdmin1` (from `.env`)

---

## Testing Checklist

See project [README.md](../../README.md) Phase 2 section.
