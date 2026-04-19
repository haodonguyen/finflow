# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

No test suite is configured.

## Architecture

**Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, Drizzle ORM, Neon PostgreSQL, JWT auth.

### Auth pattern
Auth is custom JWT-based (no NextAuth). `lib/auth.ts` provides `getCurrentUser()` which reads a `token` httpOnly cookie and verifies the JWT. Server components call this directly — protected pages (e.g. `app/dashboard/page.tsx`) redirect to `/login` if null. No middleware-based route protection.

### Database
Drizzle ORM with `@neondatabase/serverless`. Schema defined in `lib/db/schema.ts` (tables: `users`, `transactions`, `budgets`). Connection initialized in `lib/db/index.ts`. Tables are created via a `GET /api/init-db` endpoint — this must be called once on a fresh database before the app works.

### Dashboard architecture
`app/dashboard/page.tsx` is a server component that does the auth check and passes the user to `app/dashboard/DashboardClient/DashboardClient.tsx`, a large client component that holds all transaction/budget state locally (no dedicated transactions/budgets API routes yet — data is managed client-side with state).

### Key directories
- `app/api/` — API routes: `auth/login`, `auth/register`, `auth/logout`, `users`, `init-db`
- `lib/` — `auth.ts` (JWT helpers), `db/` (Drizzle schema + connection)
- `components/` — `AnimatedBackground`, `GlassCard`, `AnimatedNumber` (shared UI primitives)

## Environment variables

```env
DATABASE_URL=              # Neon PostgreSQL pooled connection
DATABASE_URL_UNPOOLED=     # Neon PostgreSQL direct connection
POSTGRES_URL=              # Used by Drizzle (same as DATABASE_URL)
JWT_SECRET=                # JWT signing secret (falls back to hardcoded default if unset)
```

## Deployment

Primary deployment is Vercel (auto-deploys from `main`). Heroku is a secondary legacy target. See `CICD_SETUP.md` for details.
