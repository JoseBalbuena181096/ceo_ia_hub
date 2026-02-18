'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createCategory(formData: FormData) {
    const supabase = await createClient()
    const name = formData.get('name') as string

    if (!name) return

    const { error } = await supabase.from('prompt_categories').insert({ name })

    if (error) {
        console.error('Error creating category:', error)
        return { success: false, message: 'Error al crear la categoría' }
    }

    revalidatePath('/admin/categories')
    revalidatePath('/admin/prompts/new')
    revalidatePath('/library')
    return { success: true, message: 'Categoría creada correctamente' }
}

export async function deleteCategory(id: string, _formData: FormData) {
    const supabase = await createClient()

    const { error } = await supabase.from('prompt_categories').delete().eq('id', id)

    if (error) {
        console.error('Error deleting category:', error)
        return { success: false, message: 'Error al eliminar la categoría' }
    }

    revalidatePath('/admin/categories')
    revalidatePath('/admin/prompts/new')
    revalidatePath('/library')
    return { success: true, message: 'Categoría eliminada correctamente' }
}
