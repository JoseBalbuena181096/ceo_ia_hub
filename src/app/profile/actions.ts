'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { success: false, message: 'No autenticado' }
    }

    const full_name = formData.get('full_name') as string
    const department = formData.get('department') as string

    const { error } = await (supabase as any).from('profiles').update({
        full_name: full_name || null,
        department: department || null,
        updated_at: new Date().toISOString(),
    }).eq('id', user.id)

    if (error) {
        console.error('Error updating profile:', error)
        return { success: false, message: 'Error al actualizar el perfil' }
    }

    revalidatePath('/profile')
    return { success: true, message: 'Perfil actualizado correctamente' }
}

export async function toggleFavorite(itemType: 'prompt' | 'video', itemId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { success: false, favorited: false, message: 'No autenticado' }
    }

    // Check if already favorited
    const { data: existing } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('item_type', itemType)
        .eq('item_id', itemId)
        .single()

    if (existing) {
        // Remove favorite
        const { error } = await (supabase as any)
            .from('favorites')
            .delete()
            .eq('id', existing.id)

        if (error) {
            console.error('Error removing favorite:', error)
            return { success: false, favorited: true, message: 'Error al quitar favorito' }
        }

        revalidatePath('/profile')
        revalidatePath('/library')
        revalidatePath('/learning')
        return { success: true, favorited: false, message: 'Eliminado de favoritos' }
    } else {
        // Add favorite
        const { error } = await (supabase as any)
            .from('favorites')
            .insert({
                user_id: user.id,
                item_type: itemType,
                item_id: itemId,
            })

        if (error) {
            console.error('Error adding favorite:', error)
            return { success: false, favorited: false, message: 'Error al agregar favorito' }
        }

        revalidatePath('/profile')
        revalidatePath('/library')
        revalidatePath('/learning')
        return { success: true, favorited: true, message: 'Agregado a favoritos' }
    }
}
