'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

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

export async function updateUser(userId: string, formData: FormData) {
    const supabase = await createClient()

    // Verify caller is admin
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

    const fullName = formData.get('full_name') as string
    const department = formData.get('department') as string

    const { error } = await (supabase as any).from('profiles').update({
        full_name: fullName || null,
        department: department || null,
    }).eq('id', userId)

    if (error) {
        console.error('Error updating user:', error)
        return { success: false, message: 'Error al actualizar el usuario' }
    }

    revalidatePath('/admin/users')
    return { success: true, message: 'Usuario actualizado correctamente' }
}

export async function deleteUser(userId: string, _formData: FormData) {
    const supabase = await createClient()

    // Verify caller is admin
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

    // Prevent deleting yourself
    if (userId === currentUser.id) {
        return { success: false, message: 'No puedes eliminar tu propia cuenta' }
    }

    // Prevent deleting other admins
    const { data: targetProfile } = await supabase
        .from('profiles')
        .select('is_admin, full_name')
        .eq('id', userId)
        .single()
    if (!targetProfile) {
        return { success: false, message: 'Usuario no encontrado' }
    }
    if (targetProfile.is_admin) {
        return { success: false, message: 'No se puede eliminar a un administrador' }
    }

    // Delete the auth user via admin API — this cascades:
    // auth.users → profiles (trigger/FK) → favorites, conversations → messages
    const adminClient = createAdminClient()
    const { error: authError } = await adminClient.auth.admin.deleteUser(userId)

    if (authError) {
        console.error('Error deleting auth user:', authError)
        // Fallback: try deleting profile directly (cascades favorites, conversations, messages)
        const { error: profileError } = await (supabase as any)
            .from('profiles')
            .delete()
            .eq('id', userId)
        if (profileError) {
            console.error('Error deleting profile:', profileError)
            return { success: false, message: 'Error al eliminar el usuario' }
        }
    }

    revalidatePath('/admin/users')
    return { success: true, message: 'Usuario eliminado permanentemente' }
}
