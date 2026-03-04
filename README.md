# VIAD HUB — Clínicas de Entrenamiento de IA

Plataforma interna de gestión del conocimiento en IA Generativa para el **Consorcio Educativo de Oriente (CEO)**. Centraliza una biblioteca de prompts, un catálogo de micro-learning en video, un chatbot conversacional (VIAD Bot) y un panel de administración.

**Producción:** [ceo-ia-hub-tu7s.vercel.app](https://ceo-ia-hub-tu7s.vercel.app)

## Tech Stack

- **Next.js 16** — App Router, React 19, TypeScript (strict mode)
- **Supabase** — Auth (email/password) + Postgres con Row Level Security
- **Tailwind CSS v4** + **shadcn/ui** (estilo new-york)
- **lucide-react** — Iconos
- **sonner** — Notificaciones toast

## Funcionalidades

### Usuarios

- **Biblioteca de Prompts** (`/library`) — Catálogo con búsqueda, filtrado por categoría, paginación y favoritos
- **Micro-learning** (`/learning`) — Catálogo de videos con reproducción modal (YouTube/TikTok)
- **Búsqueda Global** (`/search`) — Busca prompts y videos simultáneamente desde el home
- **Perfil** (`/profile`) — Editar nombre y departamento, ver favoritos guardados
- **Favoritos** — Marcar prompts y videos con corazón, accesibles desde el perfil
- **VIAD Bot** — Chatbot conversacional con IA que busca en la biblioteca, genera prompts y responde sobre IA Generativa

### Administradores

- **Dashboard** (`/admin`) — Estadísticas generales
- **Gestión de Prompts** (`/admin/prompts`) — CRUD con paginación (20 por página)
- **Gestión de Videos** (`/admin/videos`) — CRUD con paginación (20 por página)
- **Categorías** (`/admin/categories`) — Categorías dinámicas para prompts y videos
- **Usuarios** (`/admin/users`) — Ver, bloquear y desbloquear usuarios
- **Vectorización** (`/admin/prompts`) — Botón para vectorizar contenido (embeddings para RAG del chatbot)

### VIAD Bot (Chatbot)

- Chat widget flotante disponible en todas las páginas (esquina inferior derecha)
- Busca prompts y videos relevantes en la biblioteca usando RAG (búsqueda semántica)
- Genera prompts personalizados cuando no encuentra resultados
- Soporta adjuntar imágenes y PDFs
- Historial de conversaciones persistente
- Expandible/minimizable
- Backend: [agente_viad_hub](https://github.com/JoseBalbuena181096/agente_viad_hub)

## Inicio rápido

### Requisitos previos

- Node.js 18+
- Proyecto en [Supabase](https://supabase.com) con las tablas configuradas

### Instalación

```bash
git clone https://github.com/JoseBalbuena181096/ceo_ia_hub.git
cd ceo_ia_hub
npm install
```

### Variables de entorno

Crear `.env.local` en la raíz:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
NEXT_PUBLIC_VIAD_BOT_API_URL=https://tu-backend.up.railway.app
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
8. `supabase/migrations/07_create_conversations_and_messages.sql`
9. `supabase/migrations/08_create_prompt_embeddings.sql`
10. `supabase/migrations/09_create_video_embeddings.sql`
11. `supabase/migrations/10_add_vectorized_flag.sql`
12. `supabase/migrations/11_rpc_similarity_search.sql`
13. `supabase/migrations/12_update_vector_dimensions_3072.sql`

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
│   │   ├── prompts/    # CRUD de prompts + botón vectorizar
│   │   ├── users/      # Gestión de usuarios
│   │   └── videos/     # CRUD de videos
│   ├── auth/           # Callback de autenticación
│   ├── learning/       # Catálogo de videos
│   ├── library/        # Catálogo de prompts
│   ├── login/          # Login y registro
│   ├── profile/        # Perfil de usuario y favoritos
│   └── search/         # Búsqueda global
├── components/
│   ├── chat/           # VIAD Bot chat widget
│   │   ├── chat-widget.tsx    # Widget principal con SSE streaming
│   │   ├── chat-message.tsx   # Renderizado de mensajes con markdown
│   │   └── chat-provider.tsx  # Provider con dynamic import (no SSR)
│   ├── ui/             # Componentes shadcn/ui
│   └── *.tsx           # Componentes custom (nav, cards, etc.)
├── lib/
│   ├── supabase/       # Clientes Supabase (server, client, middleware)
│   ├── constants.ts    # Contenido estático
│   └── utils.ts        # Utilidades
└── types/              # Tipos TypeScript
supabase/
├── schema.sql          # Esquema completo
└── migrations/         # Migraciones incrementales (01-12)
```

## Roles y permisos

| Acción | Usuario | Admin |
|---|---|---|
| Ver prompts y videos | Sí | Sí |
| Buscar contenido | Sí | Sí |
| Usar VIAD Bot | Sí | Sí |
| Editar perfil propio | Sí | Sí |
| Gestionar favoritos | Sí | Sí |
| CRUD prompts/videos | No | Sí |
| Gestionar categorías | No | Sí |
| Bloquear usuarios | No | Sí |
| Vectorizar contenido | No | Sí |

## Arquitectura del sistema

```
┌─────────────────────┐     ┌──────────────────────┐
│   ceo_ia_hub        │     │  agente_viad_hub     │
│   (Next.js/Vercel)  │────▶│  (FastAPI/Railway)   │
│                     │ SSE │                      │
│   Chat Widget ◄─────│◄────│  LangGraph Agent     │
│   Biblioteca        │     │  Gemini 3 Flash      │
│   Micro-learning    │     │  RAG (embeddings)    │
└────────┬────────────┘     └──────────┬───────────┘
         │                             │
         └──────────┬──────────────────┘
                    ▼
         ┌─────────────────────┐
         │     Supabase        │
         │  Auth + Postgres    │
         │  (REST API + RLS)   │
         └─────────────────────┘
```
