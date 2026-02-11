'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createPrompt(formData: FormData) {
    const supabase = createClient()
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const category = formData.get('category') as string
    const tagsString = formData.get('tags') as string

    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag !== '')

    const { error } = await (await supabase).from('prompts').insert({
        title,
        content,
        category: category as any,
        tags,
    })

    if (error) {
        console.error('Error creating prompt:', error)
        return { message: 'Error al crear el prompt' }
    }

    revalidatePath('/library')
    revalidatePath('/admin/prompts')
    return { message: 'Prompt creado exitosamente' }
}

export async function deletePrompt(id: string) {
    const supabase = createClient()
    const { error } = await (await supabase).from('prompts').delete().eq('id', id)

    if (error) {
        console.error('Error deleting prompt:', error)
        return { message: 'Error al eliminar' }
    }

    revalidatePath('/library')
    revalidatePath('/admin/prompts')
    return { message: 'Eliminado' }
}

export async function createVideo(formData: FormData) {
    const supabase = createClient()
    const title = formData.get('title') as string
    const url = formData.get('url') as string
    const category = formData.get('category') as string
    const duration = formData.get('duration') as string

    const { error } = await (await supabase).from('videos').insert({
        title,
        url,
        category: category as any,
        duration,
    })

    if (error) {
        console.error('Error creating video:', error)
        return { message: 'Error al crear el video' }
    }

    revalidatePath('/learning')
    revalidatePath('/admin/videos')
    return { message: 'Video creado exitosamente' }
}

export async function deleteVideo(id: string) {
    const supabase = createClient()
    const { error } = await (await supabase).from('videos').delete().eq('id', id)

    if (error) {
        console.error('Error deleting video:', error)
        return { message: 'Error al eliminar' }
    }

    revalidatePath('/learning')
    revalidatePath('/admin/videos')
    return { message: 'Eliminado' }
}
