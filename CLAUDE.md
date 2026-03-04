# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**VIAD HUB** — Clínicas de Entrenamiento de IA. Internal knowledge management platform for the **Consorcio Educativo de Oriente (CEO)**. Features a prompt library, micro-learning video catalog, VIAD Bot conversational chatbot, and admin panel. UI and content are in **Spanish**.

**Production:** https://ceo-ia-hub-tu7s.vercel.app
**Backend (VIAD Bot):** https://web-production-ccc6a.up.railway.app (repo: agente_viad_hub)

## Commands

- `npm run dev` — Start Next.js dev server (localhost:3000)
- `npm run build` — Production build
- `npm run lint` — ESLint (eslint-config-next with core-web-vitals + typescript)

No test scripts configured.

## Tech Stack

- **Next.js 16** with App Router, React 19, TypeScript (strict mode)
- **Supabase** for auth (email/password) and Postgres database with RLS
- **Tailwind CSS v4** + **shadcn/ui** (new-york style, `@/components/ui/`)
- **Icons:** lucide-react
- **Notifications:** sonner (toast)
- **Fonts:** Monda (body, local TTF), Nexa family (headings, local OTF), JetBrains Mono (code, Google)
- Path alias: `@/*` → `./src/*`

## Brand / Visual Identity

- **Name:** VIAD HUB
- **Subtitle:** Clínicas de Entrenamiento de IA — Consorcio Educativo de Oriente
- **Primary color:** `#00205c` (VIAD Navy) — CSS token `viad-navy`
- **Secondary color:** `#94c9ed` (VIAD Light Blue) — CSS token `viad-blue`
- **Accent colors:** `viad-orange` (#e25027), `viad-purple` (#87497a), `viad-salmon` (#f4c0b5), `viad-lavender` (#c0b0d7)
- **Logo component:** `src/components/viad-logo.tsx` — SVG wordmark "VIAD"
- **Favicon:** `src/app/icon.tsx` — dynamic "V" on navy background
- **Institutional banner:** `public/consorcio-banner.png` — logos of UO, CSA, UO Global, CHDH, IADEU

## Architecture

### Supabase Integration (3-client pattern)

- `src/lib/supabase/server.ts` — Server-side client (async, uses cookies). Used in Server Components and Server Actions.
- `src/lib/supabase/client.ts` — Browser client (typed with `Database`). Used in Client Components.
- `src/lib/supabase/middleware.ts` — Middleware client for session refresh. Redirects unauthenticated users to `/login` (except `/login` and `/auth` paths).

The server client is intentionally typed as `any` to bypass insert type friction; the browser client uses the `Database` type from `src/types/database.types.ts`.

### Database Tables (Supabase)

- **profiles** — extends `auth.users` via trigger (`handle_new_user`). Key fields: `is_admin`, `is_blocked`, `full_name`, `department`.
- **prompts** — title, content, category (text), tags (text[]), created_by, `vectorized` (boolean).
- **prompt_categories** — dynamic category names.
- **videos** — title, url, category (text), duration, `vectorized` (boolean).
- **favorites** — user_id, item_type (`'prompt'` | `'video'`), item_id.
- **conversations** — id, user_id, title, created_at, updated_at (for VIAD Bot).
- **messages** — id, conversation_id, role, content, created_at (for VIAD Bot).
- **prompt_embeddings** — id, prompt_id, embedding VECTOR(3072), content, metadata.
- **video_embeddings** — id, video_id, embedding VECTOR(3072), content, metadata.

RLS policy pattern: SELECT for authenticated users; INSERT/UPDATE/DELETE restricted to admins.

### Auth & Authorization

- Middleware (`src/middleware.ts`) enforces login on all routes except `/login`, `/auth`, and static assets.
- Admin guard in `src/app/admin/layout.tsx` checks `profiles.is_admin` and redirects non-admins to `/`.
- Two roles: **Admin** (full CRUD) and **User** (read-only content, manage own profile/favorites, use chatbot).

### VIAD Bot (Chat Widget)

- **Components:** `src/components/chat/chat-widget.tsx`, `chat-message.tsx`, `chat-provider.tsx`
- **API URL:** env var `NEXT_PUBLIC_VIAD_BOT_API_URL`
- **SSE Streaming:** Parses Server-Sent Events from the backend. Normalizes `\r\n` to `\n` for sse-starlette compatibility.
- **Events:** `token`, `tool_call`, `tool_result`, `metadata`, `error`, `done`
- **Auth:** userId passed from server layout → ChatProvider → ChatWidget as prop
- **Features:** File attachments (images, PDFs), conversation history, expand/minimize, markdown rendering
- **Dynamic import:** `ssr: false` to avoid hydration issues

### Route Structure

| Route | Purpose |
|---|---|
| `/` | Home — VIAD HUB logo, institutional banner, CTA buttons |
| `/login` | Email/password login and signup |
| `/search` | Global search — queries prompts and videos in parallel |
| `/library` | Prompt catalog with search, category filtering, pagination, favorites |
| `/learning` | Video catalog with search, category filtering, pagination, favorites |
| `/profile` | User profile — edit name/department, view favorites |
| `/admin` | Admin dashboard with stats |
| `/admin/prompts` | Manage prompts (CRUD + vectorize button) |
| `/admin/videos` | Manage videos (CRUD) |
| `/admin/categories` | Manage dynamic categories |
| `/admin/users` | User management — block/unblock |

### Server Actions

- `src/app/admin/actions.ts` — CRUD for prompts and videos
- `src/app/admin/categories/actions.ts` — CRUD for categories
- `src/app/admin/users/actions.ts` — toggle block/unblock users
- `src/app/login/actions.ts` — login/signup
- `src/app/profile/actions.ts` — update profile, toggle favorites

### Key Conventions

- Public pages use `export const dynamic = 'force-dynamic'`.
- Static content (manifesto, tool links) in `src/lib/constants.ts`.
- shadcn/ui components: `npx shadcn@latest add <component>`.
- Null-safe access: `?? false` or `?? default` for nullable DB fields.
- Pagination: `searchParams.page`, `PAGE_SIZE` (12 public, 20 admin), `.range(from, to)`.
- Brand colors use `viad-*` prefix (e.g., `bg-viad-navy`, `text-viad-blue`).

## Migrations

Migrations in `supabase/migrations/`, run manually in Supabase SQL Editor:

1. `01_update_category_text.sql` — Prompt categories to text type
2. `02_create_categories_table.sql` — Dynamic categories table
3. `03_update_video_category_text.sql` — Video categories to text type
4. `04_add_user_blocked_field.sql` — `is_blocked` column on profiles
5. `05_fix_user_blocked_and_admin_policy.sql` — Idempotent fix + admin UPDATE policy
6. `06_create_favorites_table.sql` — Favorites with RLS
7. `07_create_conversations_and_messages.sql` — Chat conversations and messages tables
8. `08_create_prompt_embeddings.sql` — Vector embeddings for prompts
9. `09_create_video_embeddings.sql` — Vector embeddings for videos
10. `10_add_vectorized_flag.sql` — `vectorized` boolean on prompts/videos
11. `11_rpc_similarity_search.sql` — RPC functions for similarity search
12. `12_update_vector_dimensions_3072.sql` — Update vectors from 768 to 3072 dimensions

## Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_VIAD_BOT_API_URL` — Backend URL for VIAD Bot (Railway)
