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
        return
    }

    revalidatePath('/admin/categories')
    revalidatePath('/admin/prompts/new')
    revalidatePath('/library')
}

export async function deleteCategory(id: string) {
    const supabase = await createClient()

    const { error } = await supabase.from('prompt_categories').delete().eq('id', id)

    if (error) {
        console.error('Error deleting category:', error)
        return
    }

    revalidatePath('/admin/categories')
    revalidatePath('/admin/prompts/new')
    revalidatePath('/library')
}
