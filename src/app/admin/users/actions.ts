'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function toggleBlockUser(userId: string, _formData: FormData) {
    const supabase = await createClient()

    // Verify the caller is an admin (defense in depth — RLS also enforces this)
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) {
        return { success: false, message: 'No autenticado' }
    }
    const { data: callerProfile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', currentUser.id)
        .single()
    if (!callerProfile?.is_admin) {
        return { success: false, message: 'No tienes permisos de administrador' }
    }

    // Get current blocked status
    const { data: profile } = await supabase
        .from('profiles')
        .select('is_blocked, is_admin')
        .eq('id', userId)
        .single()

    if (!profile) {
        return { success: false, message: 'Usuario no encontrado' }
    }

    if (profile.is_admin) {
        return { success: false, message: 'No se puede bloquear a un administrador' }
    }

    const newStatus = !(profile.is_blocked ?? false)

    const { error } = await (supabase as any).from('profiles').update({
        is_blocked: newStatus,
    }).eq('id', userId)

    if (error) {
        console.error('Error toggling user block:', error)
        return { success: false, message: 'Error al actualizar el estado del usuario' }
    }

    revalidatePath('/admin/users')
    return {
        success: true,
        message: newStatus ? 'Usuario bloqueado' : 'Usuario desbloqueado',
    }
}
