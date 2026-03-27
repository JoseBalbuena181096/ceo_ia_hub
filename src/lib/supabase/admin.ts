import { createClient } from '@supabase/supabase-js'

/**
 * Admin Supabase client with service role key.
 * Server-side only — never import in client components.
 * Required env var: SUPABASE_SERVICE_ROLE_KEY (no NEXT_PUBLIC_ prefix).
 */
export function createAdminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    return createClient(url, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    })
}
