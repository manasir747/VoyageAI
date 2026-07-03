# VoyageAI Foundation

This repository is structured as a production-ready monorepo foundation for VoyageAI.

## Why this shape

- `apps/web` isolates the Next.js frontend so UI, routing, and presentation concerns stay separate from backend APIs.
- `apps/api` keeps the FastAPI service independent so backend deployment, scaling, and Python dependencies remain decoupled.
- `docker` and `docker-compose.yml` provide environment parity for local development and future production images.
- Root-level tooling keeps formatting, git hooks, and shared TypeScript compiler settings centralized.
- Empty feature directories are intentionally present so implementation can start without reshaping the repository again.

## What is already set up

- Next.js 15 App Router foundation for the frontend.
- TypeScript compiler and alias configuration for the web app.
- Tailwind CSS and ShadCN UI wiring for future component work.
- Framer Motion, GSAP, Three.js, React Three Fiber, Zustand, TanStack Query, React Hook Form, and Zod declared in the web package manifest.
- FastAPI application scaffold for the backend.
- Environment variable examples for both services.
- ESLint, Prettier, Husky, and lint-staged at the repo level.

## What is intentionally not built yet

- No product UI.
- No business logic.
- No API domains beyond the minimal backend bootstrap.
- No database migrations or persistence layer implementation.

## Install note

The dependencies are declared in the manifests, but they still need to be installed before the apps can run.
