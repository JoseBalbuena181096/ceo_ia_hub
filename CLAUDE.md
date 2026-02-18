# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CEO AI Hub — an internal knowledge management platform for "Consorcio Educativo Oriente" (CEO). It serves as an AI manifesto portal, a prompt library, a micro-learning video catalog, a quick-access tool center (Gemini, NotebookLM, Workspace), and a user management panel. The UI and content are in **Spanish**.

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

- **profiles** — extends `auth.users` via trigger (`handle_new_user`). Key fields: `is_admin` (boolean), `is_blocked` (boolean, default false), `full_name`, `department`.
- **prompts** — title, content, category (text, dynamic), tags (text[]), created_by.
- **prompt_categories** — dynamic category names (replaces the old hardcoded `PROMPT_CATEGORIES` constant).
- **videos** — title, url, category (text), duration.
- **favorites** — user_id, item_type (`'prompt'` | `'video'`), item_id. Unique constraint on `(user_id, item_type, item_id)`.

RLS policy pattern: SELECT for authenticated users; INSERT/UPDATE/DELETE restricted to admins (`profiles.is_admin = true`).

**Important RLS note for profiles:** There are two UPDATE policies — users can update their own profile (`auth.uid() = id`), and admins can update any profile (used for blocking/unblocking users).

**Favorites RLS:** Each user can only SELECT/INSERT/DELETE their own favorites (`auth.uid() = user_id`).

Schema lives in `supabase/schema.sql`; incremental changes in `supabase/migrations/`.

### Auth & Authorization

- Middleware (`src/middleware.ts`) enforces login on all routes except `/login`, `/auth`, and static assets.
- Admin guard in `src/app/admin/layout.tsx` checks `profiles.is_admin` and redirects non-admins to `/`.
- Two roles only: **Admin** (full CRUD via `/admin`) and **User** (read-only access to content, can manage own profile and favorites).
- Admins can block/unblock users via `/admin/users`. Blocked users have `is_blocked = true` in profiles.

### Route Structure

| Route | Purpose |
|---|---|
| `/` | Home — manifesto, tool links, global search |
| `/login` | Email/password login and signup |
| `/search` | Global search — queries prompts and videos in parallel, grouped results |
| `/library` | Prompt catalog with search, category filtering, pagination, and favorites |
| `/learning` | Video catalog with search, category filtering, pagination, and favorites |
| `/profile` | User profile — edit name/department, view favorited prompts and videos |
| `/admin` | Admin dashboard with stats (protected layout) |
| `/admin/prompts` | Manage prompts with pagination (list, create at `/admin/prompts/new`, edit at `/admin/prompts/[id]/edit`) |
| `/admin/videos` | Manage videos with pagination (list, create at `/admin/videos/new`, edit at `/admin/videos/[id]/edit`) |
| `/admin/categories` | Manage dynamic prompt/video categories |
| `/admin/users` | User management — view all users, block/unblock non-admin users |

### Server Actions

Server Actions (files named `actions.ts` with `'use server'`) handle all mutations:
- `src/app/admin/actions.ts` — CRUD for prompts and videos
- `src/app/admin/categories/actions.ts` — CRUD for categories
- `src/app/admin/users/actions.ts` — toggle block/unblock users (with admin verification)
- `src/app/login/actions.ts` — login/signup
- `src/app/profile/actions.ts` — update own profile (`updateProfile`), toggle favorites (`toggleFavorite`)

Actions call `revalidatePath()` on affected routes after mutations.

### Reusable Components

- `src/components/main-nav.tsx` — Main navigation bar with profile link (used on all pages)
- `src/components/mobile-nav.tsx` — Responsive mobile navigation with profile link
- `src/components/search.tsx` — Search input component for library/learning
- `src/components/home-search.tsx` — Global search on home page (redirects to `/search`)
- `src/components/prompt-card.tsx` — Card display for prompts (with copy and favorite button)
- `src/components/video-card.tsx` — Card display for videos (with modal playback and favorite button)
- `src/components/pagination.tsx` — Pagination controls for lists (used in library, learning, admin prompts, admin videos)
- `src/components/breadcrumb.tsx` — Breadcrumb navigation for admin pages
- `src/components/confirm-delete.tsx` — Confirmation dialog for destructive actions
- `src/components/submit-button.tsx` — Form submit button with loading state
- `src/components/client-form.tsx` — Client-side form wrapper

### Key Conventions

- Public pages (`/library`, `/learning`, `/search`, `/profile`) use `export const dynamic = 'force-dynamic'` to always fetch fresh data.
- Static content (manifesto text, external tool links) is in `src/lib/constants.ts`.
- shadcn/ui components are added via `npx shadcn@latest add <component>` and live in `src/components/ui/`.
- Custom components (cards, nav, search) live directly in `src/components/`.
- Null-safe access for optional DB fields: use `?? false` or `?? default` when reading fields that may be null (e.g., `is_blocked`).
- Server Actions that modify other users' data include defense-in-depth admin verification (not just RLS).
- Pagination pattern: `searchParams.page`, `PAGE_SIZE` constant (12 for public, 20 for admin), `.range(from, to)`, count query with `{ count: 'exact', head: true }`.
- Favorites pattern: cards receive optional `promptId`/`videoId` and `isFavorited` props. Pages fetch user favorites and pass them as a `Set<string>` for O(1) lookup.

## Migrations

Migrations are in `supabase/migrations/` and must be run manually in Supabase Dashboard > SQL Editor:

1. `01_update_category_text.sql` — Change prompt categories to text type
2. `02_create_categories_table.sql` — Create dynamic categories table
3. `03_update_video_category_text.sql` — Change video categories to text type
4. `04_add_user_blocked_field.sql` — Add `is_blocked` column to profiles
5. `05_fix_user_blocked_and_admin_policy.sql` — Fix: idempotent `is_blocked` column + admin UPDATE policy for profiles
6. `06_create_favorites_table.sql` — Create `favorites` table with RLS (user-scoped SELECT/INSERT/DELETE)

## Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
