# CEO AI Hub

Plataforma interna de gestión del conocimiento para el **Consorcio Educativo Oriente (CEO)**. Centraliza el manifiesto de IA, una biblioteca de prompts, un catálogo de micro-learning en video, accesos directos a herramientas (Gemini, NotebookLM, Workspace) y un panel de administración de usuarios.

## Tech Stack

- **Next.js 16** — App Router, React 19, TypeScript
- **Supabase** — Auth (email/password) + Postgres con Row Level Security
- **Tailwind CSS v4** + **shadcn/ui** (estilo new-york)
- **lucide-react** — Iconos
- **sonner** — Notificaciones toast

## Funcionalidades

### Usuarios

- **Biblioteca de Prompts** (`/library`) — Catálogo con búsqueda, filtrado por categoría y paginación
- **Micro-learning** (`/learning`) — Catálogo de videos con reproducción modal (YouTube/TikTok)
- **Búsqueda Global** (`/search`) — Busca prompts y videos simultáneamente desde el home
- **Perfil** (`/profile`) — Editar nombre y departamento, ver favoritos guardados
- **Favoritos** — Marcar prompts y videos con corazón, accesibles desde el perfil

### Administradores

- **Dashboard** (`/admin`) — Estadísticas generales
- **Gestión de Prompts** (`/admin/prompts`) — CRUD con paginación (20 por página)
- **Gestión de Videos** (`/admin/videos`) — CRUD con paginación (20 por página)
- **Categorías** (`/admin/categories`) — Categorías dinámicas para prompts y videos
- **Usuarios** (`/admin/users`) — Ver, bloquear y desbloquear usuarios

## Inicio rápido

### Requisitos previos

- Node.js 18+
- Proyecto en [Supabase](https://supabase.com) con las tablas configuradas

### Instalación

```bash
git clone <repo-url>
cd ceo_ia_hub
npm install
```

### Variables de entorno

Crear `.env.local` en la raíz:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

### Base de datos

Ejecutar en orden en Supabase Dashboard > SQL Editor:

1. `supabase/schema.sql` — Esquema base (profiles, prompts, videos, favorites)
2. `supabase/migrations/01_update_category_text.sql`
3. `supabase/migrations/02_create_categories_table.sql`
4. `supabase/migrations/03_update_video_category_text.sql`
5. `supabase/migrations/04_add_user_blocked_field.sql`
6. `supabase/migrations/05_fix_user_blocked_and_admin_policy.sql`
7. `supabase/migrations/06_create_favorites_table.sql`

### Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo (localhost:3000) |
| `npm run build` | Build de producción |
| `npm run lint` | Linter con ESLint |

## Estructura del proyecto

```
src/
├── app/
│   ├── admin/          # Panel de administración (protegido)
│   │   ├── categories/ # CRUD de categorías
│   │   ├── prompts/    # CRUD de prompts
│   │   ├── users/      # Gestión de usuarios
│   │   └── videos/     # CRUD de videos
│   ├── auth/           # Callback de autenticación
│   ├── learning/       # Catálogo de videos
│   ├── library/        # Catálogo de prompts
│   ├── login/          # Login y registro
│   ├── profile/        # Perfil de usuario y favoritos
│   └── search/         # Búsqueda global
├── components/
│   ├── ui/             # Componentes shadcn/ui
│   └── *.tsx           # Componentes custom (nav, cards, etc.)
├── lib/
│   ├── supabase/       # Clientes Supabase (server, client, middleware)
│   ├── constants.ts    # Contenido estático
│   └── utils.ts        # Utilidades
└── types/              # Tipos TypeScript
supabase/
├── schema.sql          # Esquema completo
└── migrations/         # Migraciones incrementales
```

## Roles y permisos

| Acción | Usuario | Admin |
|---|---|---|
| Ver prompts y videos | Si | Si |
| Buscar contenido | Si | Si |
| Editar perfil propio | Si | Si |
| Gestionar favoritos | Si | Si |
| CRUD prompts/videos | No | Si |
| Gestionar categorías | No | Si |
| Bloquear usuarios | No | Si |
