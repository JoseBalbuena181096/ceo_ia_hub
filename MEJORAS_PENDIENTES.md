# Mejoras Pendientes — CEO AI Hub

Lista de mejoras y funcionalidades por implementar, organizadas por prioridad.

---

## Alta Prioridad

### 1. Bloquear acceso de usuarios bloqueados
- **Estado actual:** El campo `is_blocked` existe y el admin puede bloquearlo, pero el usuario bloqueado aún puede acceder a la plataforma.
- **Solución:** Verificar `is_blocked` en el middleware (`src/middleware.ts`) y redirigir a una página `/blocked` o mostrar un mensaje de acceso denegado.

### 2. Regenerar tipos de base de datos
- **Estado actual:** `src/types/database.types.ts` puede estar desactualizado respecto al schema real (falta `is_blocked`, etc.).
- **Solución:** Ejecutar `npx supabase gen types typescript` para regenerar los tipos y que el cliente browser tenga tipado correcto.

### 3. Búsqueda global funcional
- **Estado actual:** El home (`/`) tiene un placeholder de búsqueda global pero no busca en prompts ni videos simultáneamente.
- **Solución:** Implementar búsqueda que consulte ambas tablas y muestre resultados unificados.

---

## Media Prioridad

### 4. Perfil de usuario editable
- **Estado actual:** Los usuarios no pueden editar su nombre o departamento después del registro.
- **Solución:** Crear página `/profile` con formulario para editar `full_name` y `department`.

### 5. Favoritos / Guardados
- **Estado actual:** No existe manera de guardar prompts o videos favoritos.
- **Solución:** Crear tabla `favorites` (user_id, item_type, item_id) y botón de favorito en las cards.

### 6. Copiar prompt al portapapeles
- **Estado actual:** Los prompts se muestran pero no hay botón para copiarlos directamente.
- **Solución:** Agregar botón "Copiar" en `prompt-card.tsx` usando `navigator.clipboard.writeText()`.

### 7. Paginación en admin
- **Estado actual:** Las listas de prompts y videos en admin no tienen paginación (cargan todo).
- **Solución:** Aplicar el componente `pagination.tsx` existente a las páginas de admin.

### 8. Descripción en videos
- **Estado actual:** Los videos solo tienen título, URL, categoría y duración.
- **Solución:** Agregar campo `description` a la tabla `videos` y mostrarlo en la card.

---

## Baja Prioridad

### 9. Dashboard con métricas reales
- **Estado actual:** El dashboard admin muestra conteos básicos.
- **Solución:** Agregar métricas como: prompts más vistos, videos más reproducidos, usuarios activos recientes.

### 10. Exportar prompts
- **Estado actual:** No hay opción de exportar prompts.
- **Solución:** Botón para exportar prompts como JSON o CSV (individual o por categoría).

### 11. Modo oscuro
- **Estado actual:** Solo tema claro.
- **Solución:** Implementar toggle de tema con `next-themes` (shadcn/ui lo soporta nativamente).

### 12. Notificaciones para nuevos contenidos
- **Estado actual:** Los usuarios no saben cuándo hay nuevos prompts o videos.
- **Solución:** Indicador de "nuevo" basado en la fecha de último acceso del usuario vs. `created_at` del contenido.

### 13. Roles granulares
- **Estado actual:** Solo existen dos roles (Admin / Usuario).
- **Solución:** Agregar rol intermedio "Editor" que pueda crear contenido pero no gestionar usuarios ni categorías.

### 14. Auditoría de acciones admin
- **Estado actual:** No hay log de acciones administrativas.
- **Solución:** Crear tabla `audit_log` que registre quién hizo qué y cuándo (bloqueos, CRUD de contenido, etc.).

---

## Deuda Técnica

### 15. Tests
- **Estado actual:** No hay tests configurados.
- **Solución:** Configurar Vitest + Testing Library. Priorizar tests en server actions y middleware.

### 16. Validación de formularios
- **Estado actual:** Validación mínima en formularios de admin.
- **Solución:** Implementar validación con Zod en server actions y feedback visual en formularios.

### 17. Manejo de errores centralizado
- **Estado actual:** Cada action maneja errores de forma independiente.
- **Solución:** Crear helper `handleActionError()` que unifique el patrón de error handling y logging.

### 18. Tipos Supabase consistentes
- **Estado actual:** El server client usa `any` para evitar fricción de tipos en inserts.
- **Solución:** Investigar si las versiones actuales de `@supabase/ssr` resuelven el problema de tipos, y remover el cast a `any` si es posible.
