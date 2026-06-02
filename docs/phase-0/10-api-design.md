# API Design

## InterviewGPT — REST API Specification

**Base URL:** `/api/v1`  
**Version:** 1.0.0  
**Auth:** Bearer JWT (except public routes)

---

## 1. Conventions

| Convention | Value |
|------------|-------|
| Content-Type | `application/json` |
| Pagination | `?page=1&limit=20` → `{ data, meta: { page, limit, total, totalPages } }` |
| Sorting | `?sort=createdAt&order=desc` |
| Filtering | Query params per resource |
| Success wrapper | `{ success: true, data: T }` |
| Error wrapper | `{ success: false, error: { code, message, details? } }` |
| Timestamps | ISO 8601 UTC |

---

## 2. Authentication APIs (Phase 2)

### POST `/auth/register`
Register a new student account.

**Body:**
```json
{
  "name": "Arjun Sharma",
  "email": "arjun@example.com",
  "password": "SecurePass1"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "name": "...", "email": "...", "role": "STUDENT" },
    "accessToken": "...",
    "refreshToken": "...",
    "expiresIn": 900
  }
}
```

---

### POST `/auth/login`
**Body:** `{ "email", "password" }`  
**Response 200:** Same as register

---

### POST `/auth/logout`
**Auth:** Required  
**Body:** `{ "refreshToken": "..." }`  
**Response 204:** No content

---

### POST `/auth/refresh`
**Body:** `{ "refreshToken": "..." }`  
**Response 200:** `{ accessToken, refreshToken, expiresIn }`

---

### POST `/auth/forgot-password`
**Body:** `{ "email": "..." }`  
**Response 200:** `{ message: "If email exists, reset link sent" }` (always 200)

---

### POST `/auth/reset-password`
**Body:** `{ "token": "...", "password": "..." }`  
**Response 200:** `{ message: "Password updated" }`

---

### GET `/auth/google`
Redirect to Google OAuth consent URL.

---

### GET `/auth/google/callback`
OAuth callback. Redirects to frontend with tokens.

---

### GET `/auth/me`
**Auth:** Required  
**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "...",
    "email": "...",
    "role": "STUDENT",
    "avatarUrl": null,
    "profile": { "targetRole": "SDE-1", "college": "..." }
  }
}
```

---

## 3. User APIs

### PATCH `/users/profile`
**Auth:** Required  
**Body:** `{ "name?", "bio?", "college?", "graduationYear?", "targetRole?", "githubUsername?", "leetcodeUsername?" }`  
**Response 200:** Updated profile

---

### DELETE `/users/account`
**Auth:** Required  
**Response 204:** Account deleted (cascade)

---

## 4. Dashboard API (Phase 4)

### GET `/dashboard`
**Auth:** Required  
**Response 200:**
```json
{
  "success": true,
  "data": {
    "metrics": {
      "problemsSolved": 42,
      "resumeScore": 78,
      "interviewScore": 65,
      "githubScore": 72,
      "placementReadiness": 71
    },
    "charts": {
      "weeklyActivity": [{ "date": "2026-05-26", "count": 5 }],
      "topicProgress": [{ "topic": "ARRAYS", "solved": 10, "total": 15 }]
    },
    "recentActivity": [
      {
        "id": "...",
        "type": "DSA_SUBMISSION",
        "title": "Solved Two Sum",
        "createdAt": "2026-06-01T10:00:00Z"
      }
    ]
  }
}
```

---

## 5. DSA APIs (Phase 5)

### GET `/dsa/problems`
**Auth:** Required  
**Query:** `page`, `limit`, `difficulty`, `topic`, `search`, `status` (solved|unsolved)  
**Response 200:** Paginated problem list

---

### GET `/dsa/problems/:slug`
**Auth:** Required  
**Response 200:** Problem detail (no hidden test cases)

---

### POST `/dsa/problems/:id/submit`
**Auth:** Required  
**Body:**
```json
{
  "language": "python",
  "sourceCode": "def solution(nums): ..."
}
```
**Response 200:**
```json
{
  "success": true,
  "data": {
    "submissionId": "...",
    "status": "ACCEPTED",
    "passedTests": 12,
    "totalTests": 12,
    "runtimeMs": 45,
    "memoryKb": 14336
  }
}
```

---

### GET `/dsa/problems/:id/submissions`
**Auth:** Required  
**Response 200:** User's submission history for problem

---

### POST `/dsa/problems/:id/hint`
**Auth:** Required  
**Body:** `{ "context": "Tried brute force, TLE" }`  
**Response 200:** `{ "hint": "Consider using a hash map..." }`

---

## 6. Resume APIs (Phase 6)

### POST `/resume/upload-url`
**Auth:** Required  
**Body:** `{ "fileName": "resume.pdf", "contentType": "application/pdf" }`  
**Response 200:** `{ "uploadUrl": "...", "s3Key": "..." }`

---

### POST `/resume/analyze`
**Auth:** Required  
**Body:** `{ "s3Key": "...", "targetRole": "SDE-1" }`  
**Response 200:** Full analysis result

---

### GET `/resume/analyses`
**Auth:** Required  
**Response 200:** List of past analyses

---

### GET `/resume/analyses/latest`
**Auth:** Required  
**Response 200:** Latest analysis or 404

---

## 7. Interview APIs (Phase 7)

### POST `/interviews/sessions`
**Auth:** Required  
**Body:**
```json
{
  "type": "TECHNICAL",
  "targetRole": "SDE-1",
  "company": "GOOGLE"
}
```
**Response 201:** Session with first question

---

### GET `/interviews/sessions`
**Auth:** Required  
**Response 200:** Paginated session list

---

### GET `/interviews/sessions/:id`
**Auth:** Required  
**Response 200:** Session with all Q&A

---

### POST `/interviews/sessions/:id/answer`
**Auth:** Required  
**Body:** `{ "answer": "I would use a hash map because..." }`  
**Response 200:** Evaluation + next question (or completion signal)

---

### POST `/interviews/sessions/:id/complete`
**Auth:** Required  
**Response 200:** Session summary with overall score

---

## 8. GitHub APIs (Phase 8)

### GET `/github/auth`
**Auth:** Required  
**Response 302:** Redirect to GitHub OAuth

---

### GET `/github/callback`
OAuth callback handler

---

### POST `/github/analyze`
**Auth:** Required  
**Body:** `{ "username": "octocat" }` (optional if linked in profile)  
**Response 200:** GitHub analysis result

---

### GET `/github/latest`
**Auth:** Required  
**Response 200:** Latest cached analysis

---

## 9. LeetCode APIs (Phase 9)

### POST `/leetcode/link`
**Auth:** Required  
**Body:** `{ "username": "leetcode_user" }`  
**Response 200:** Synced profile

---

### GET `/leetcode/profile`
**Auth:** Required  
**Response 200:** LeetCode stats + topic progress

---

### POST `/leetcode/sync`
**Auth:** Required  
**Response 200:** Fresh sync from LeetCode

---

## 10. Company Question Bank APIs (Phase 10)

### GET `/questions`
**Auth:** Required  
**Query:** `company`, `category`, `topic`, `difficulty`, `search`, `page`, `limit`  
**Response 200:** Paginated questions

---

### GET `/questions/:id`
**Auth:** Required  
**Response 200:** Question detail

---

### POST `/questions/:id/bookmark`
**Auth:** Required  
**Response 201:** Bookmark created

---

### DELETE `/questions/:id/bookmark`
**Auth:** Required  
**Response 204**

---

### GET `/questions/bookmarks`
**Auth:** Required  
**Response 200:** User's bookmarked questions

---

## 11. Readiness APIs (Phase 11)

### GET `/readiness`
**Auth:** Required  
**Response 200:** Latest readiness snapshot

---

### POST `/readiness/recalculate`
**Auth:** Required  
**Response 200:** Fresh calculation

---

### GET `/readiness/roadmap`
**Auth:** Required  
**Response 200:** `{ roadmap: RoadmapItem[] }`

---

### GET `/readiness/suggestions`
**Auth:** Required  
**Response 200:** AI-generated weekly suggestions

---

## 12. Admin APIs (Phase 12)

**All require `role: ADMIN`**

### GET `/admin/users`
**Query:** `search`, `role`, `page`, `limit`  
**Response 200:** User list

---

### PATCH `/admin/users/:id`
**Body:** `{ "role?", "isActive?" }`  
**Response 200:** Updated user

---

### CRUD `/admin/dsa/problems`
Standard REST: GET list, POST create, PATCH update, DELETE

---

### CRUD `/admin/questions`
Company question management

---

### GET `/admin/analytics`
**Response 200:**
```json
{
  "totalUsers": 1250,
  "activeUsers7d": 340,
  "totalSubmissions": 8900,
  "registrationsByDay": []
}
```

---

### GET `/admin/reports/export`
**Query:** `type=users|submissions`  
**Response 200:** CSV file download

---

## 13. Health & Utility

### GET `/health`
**Auth:** None  
**Response 200:** `{ "status": "ok", "timestamp": "..." }`

---

### GET `/ready`
**Auth:** None  
**Response 200:** `{ "status": "ready", "db": "connected", "redis": "connected" }`

---

## 14. HTTP Status Code Matrix

| Code | Usage |
|------|-------|
| 200 | Successful GET, PATCH |
| 201 | Successful POST (created) |
| 204 | Successful DELETE, logout |
| 400 | Validation error |
| 401 | Missing/invalid token |
| 403 | Insufficient role |
| 404 | Resource not found |
| 409 | Conflict (duplicate email) |
| 429 | Rate limited |
| 500 | Internal server error |
| 502 | External service failure |

---

## 15. Rate Limits

| Endpoint Group | Limit |
|----------------|-------|
| Auth (login/register) | 10 req/min per IP |
| AI endpoints (hint, interview, suggestions) | 20 req/hour per user |
| DSA submit | 30 req/hour per user |
| General API | 100 req/min per user |

---

## 16. API Versioning Strategy

- Current: `/api/v1`
- Breaking changes → `/api/v2` with 6-month deprecation window
- Non-breaking additions allowed in v1
