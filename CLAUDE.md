# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CEO AI Hub — an internal knowledge management platform for "Consorcio Educativo Oriente" (CEO). It serves as an AI manifesto portal, a prompt library, a micro-learning video catalog, and a quick-access tool center (Gemini, NotebookLM, Workspace). The UI and content are in **Spanish**.

## Commands

- `npm run dev` — Start Next.js dev server (localhost:3000)
- `npm run build` — Production build
- `npm run lint` — ESLint (eslint-config-next with core-web-vitals + typescript)

There are no test scripts configured.

## Tech Stack

- **Next.js 16** with App Router, React 19, TypeScript (strict mode)
- **Supabase** for auth (email/password) and Postgres database with RLS
- **Tailwind CSS v4** + **shadcn/ui** (new-york style, `@/components/ui/`)
- **Icons:** lucide-react
- **Notifications:** sonner (toast)
- Path alias: `@/*` → `./src/*`

## Architecture

### Supabase Integration (3-client pattern)

- `src/lib/supabase/server.ts` — Server-side client (async, uses cookies). Used in Server Components and Server Actions.
- `src/lib/supabase/client.ts` — Browser client (typed with `Database`). Used in Client Components.
- `src/lib/supabase/middleware.ts` — Middleware client for session refresh. Redirects unauthenticated users to `/login` (except `/login` and `/auth` paths).

The server client is intentionally typed as `any` to bypass insert type friction; the browser client uses the `Database` type from `src/types/database.types.ts`.

### Database Tables (Supabase)

- **profiles** — extends `auth.users` via trigger (`handle_new_user`). Key field: `is_admin` (boolean).
- **prompts** — title, content, category (text, dynamic), tags (text[]), created_by.
- **prompt_categories** — dynamic category names (replaces the old hardcoded `PROMPT_CATEGORIES` constant).
- **videos** — title, url, category (text), duration.

RLS policy pattern: SELECT for authenticated users; INSERT/UPDATE/DELETE restricted to admins (`profiles.is_admin = true`).

Schema lives in `supabase/schema.sql`; incremental changes in `supabase/migrations/`.

### Auth & Authorization

- Middleware (`src/middleware.ts`) enforces login on all routes except `/login`, `/auth`, and static assets.
- Admin guard in `src/app/admin/layout.tsx` checks `profiles.is_admin` and redirects non-admins to `/`.
- Two roles only: **Admin** (full CRUD via `/admin`) and **User** (read-only access to content).

### Route Structure

| Route | Purpose |
|---|---|
| `/` | Home — manifesto, tool links, global search placeholder |
| `/login` | Email/password login and signup |
| `/library` | Prompt catalog with search and category filtering |
| `/learning` | Video catalog with search and category filtering |
| `/admin` | Admin dashboard (protected layout) |
| `/admin/prompts` | Manage prompts (list, create at `/admin/prompts/new`) |
| `/admin/videos` | Manage videos (list, create at `/admin/videos/new`) |
| `/admin/categories` | Manage dynamic prompt/video categories |

### Server Actions

Server Actions (files named `actions.ts` with `'use server'`) handle all mutations:
- `src/app/admin/actions.ts` — CRUD for prompts and videos
- `src/app/admin/categories/actions.ts` — CRUD for categories
- `src/app/login/actions.ts` — login/signup

Actions call `revalidatePath()` on affected routes after mutations.

### Key Conventions

- Public pages (`/library`, `/learning`) use `export const dynamic = 'force-dynamic'` to always fetch fresh data.
- Static content (manifesto text, external tool links) is in `src/lib/constants.ts`.
- shadcn/ui components are added via `npx shadcn@latest add <component>` and live in `src/components/ui/`.
- Custom components (cards, nav, search) live directly in `src/components/`.

## Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
