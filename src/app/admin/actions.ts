'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createPrompt(formData: FormData) {
    const supabase = await createClient()
    const title = formData.get('title') as string
    const description = (formData.get('description') as string) || null
    const content = formData.get('content') as string
    const category = formData.get('category') as string
    const tagsString = formData.get('tags') as string

    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag !== '')

    // Cast to any to bypass strict type checking on insert
    const { error } = await (supabase as any).from('prompts').insert({
        title,
        description,
        content,
        category: category,
        tags,
    })

    if (error) {
        console.error('Error creating prompt:', error)
        return { success: false, message: 'Error al crear el prompt' }
    }

    revalidatePath('/library')
    revalidatePath('/admin/prompts')
    return { success: true, message: 'Prompt creado correctamente' }
}

export async function updatePrompt(id: string, formData: FormData) {
    const supabase = await createClient()
    const title = formData.get('title') as string
    const description = (formData.get('description') as string) || null
    const content = formData.get('content') as string
    const category = formData.get('category') as string
    const tagsString = formData.get('tags') as string

    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag !== '')

    const { error } = await (supabase as any).from('prompts').update({
        title,
        description,
        content,
        category,
        tags,
    }).eq('id', id)

    if (error) {
        console.error('Error updating prompt:', error)
        return { success: false, message: 'Error al actualizar el prompt' }
    }

    revalidatePath('/library')
    revalidatePath('/admin/prompts')
    return { success: true, message: 'Prompt actualizado correctamente' }
}

export async function deletePrompt(id: string, _formData: FormData) {
    const supabase = await createClient()
    const { error } = await (supabase as any).from('prompts').delete().eq('id', id)

    if (error) {
        console.error('Error deleting prompt:', error)
        return { success: false, message: 'Error al eliminar el prompt' }
    }

    revalidatePath('/library')
    revalidatePath('/admin/prompts')
    return { success: true, message: 'Prompt eliminado correctamente' }
}

export async function createVideo(formData: FormData) {
    const supabase = await createClient()
    const title = formData.get('title') as string
    const url = formData.get('url') as string
    const category = formData.get('category') as string
    const duration = formData.get('duration') as string

    const { error } = await (supabase as any).from('videos').insert({
        title,
        url,
        category: category,
        duration,
    })

    if (error) {
        console.error('Error creating video:', error)
        return { success: false, message: 'Error al crear el video' }
    }

    revalidatePath('/learning')
    revalidatePath('/admin/videos')
    return { success: true, message: 'Video registrado correctamente' }
}

export async function updateVideo(id: string, formData: FormData) {
    const supabase = await createClient()
    const title = formData.get('title') as string
    const url = formData.get('url') as string
    const category = formData.get('category') as string
    const duration = formData.get('duration') as string

    const { error } = await (supabase as any).from('videos').update({
        title,
        url,
        category,
        duration: duration || null,
    }).eq('id', id)

    if (error) {
        console.error('Error updating video:', error)
        return { success: false, message: 'Error al actualizar el video' }
    }

    revalidatePath('/learning')
    revalidatePath('/admin/videos')
    return { success: true, message: 'Video actualizado correctamente' }
}

export async function deleteVideo(id: string, _formData: FormData) {
    const supabase = await createClient()
    const { error } = await (supabase as any).from('videos').delete().eq('id', id)

    if (error) {
        console.error('Error deleting video:', error)
        return { success: false, message: 'Error al eliminar el video' }
    }

    revalidatePath('/learning')
    revalidatePath('/admin/videos')
    return { success: true, message: 'Video eliminado correctamente' }
}
