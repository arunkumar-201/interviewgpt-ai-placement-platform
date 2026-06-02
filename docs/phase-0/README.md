# InterviewGPT — Phase 0: Architecture & Planning

> **Status:** Complete — Awaiting approval before Phase 1  
> **Version:** 1.0.0  
> **Last Updated:** June 2, 2026

---

## Overview

InterviewGPT is an AI-powered placement preparation platform designed to help students systematically improve DSA skills, interview performance, resume quality, GitHub profile strength, and overall placement readiness.

This phase establishes the architectural foundation, requirements, and development roadmap for all subsequent phases.

---

## Deliverables Index

| # | Document | Description |
|---|----------|-------------|
| 1 | [Product Requirements Document](./01-product-requirements-document.md) | Vision, goals, scope, success metrics |
| 2 | [User Personas](./02-user-personas.md) | Primary and secondary user profiles |
| 3 | [Functional Requirements](./03-functional-requirements.md) | Feature-level requirements by module |
| 4 | [Non-Functional Requirements](./04-non-functional-requirements.md) | Performance, security, scalability |
| 5 | [System Architecture](./05-system-architecture.md) | C4-style architecture overview |
| 6 | [High-Level Design](./06-high-level-design.md) | Component interactions and data flow |
| 7 | [Low-Level Design](./07-low-level-design.md) | Module internals, patterns, contracts |
| 8 | [Database Schema](./08-database-schema.md) | Prisma models and table definitions |
| 9 | [ER Diagram](./09-er-diagram.md) | Entity-relationship diagram (Mermaid) |
| 10 | [API Design](./10-api-design.md) | REST endpoints, request/response schemas |
| 11 | [Folder Structure](./11-folder-structure.md) | Monorepo layout and conventions |
| 12 | [Development Roadmap](./12-development-roadmap.md) | Phase-by-phase timeline and milestones |

---

## Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Frontend | React, TypeScript, Vite, Tailwind CSS, Shadcn UI, Framer Motion, React Query |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT + Google OAuth |
| Cache | Redis |
| Storage | AWS S3 |
| AI | Google Gemini API |
| Deployment | Docker, GitHub Actions, Vercel (frontend), AWS (backend) |

---

## Design Inspiration

PhonePe · Cred · Stripe · Notion · Linear · Vercel — premium SaaS aesthetic with dark/light modes, micro-interactions, and data-rich dashboards.

---

## Next Step

**Phase 1 — Project Foundation:** Frontend/backend scaffolding, Docker, environment configuration.

Approve Phase 0 to proceed.
