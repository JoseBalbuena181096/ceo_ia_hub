'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return redirect('/login?error=Credenciales inválidas')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string
    const department = formData.get('department') as string

    const headersList = await headers()
    const origin = headersList.get('origin') || headersList.get('x-forwarded-host')
        ? `https://${headersList.get('x-forwarded-host')}`
        : 'http://localhost:3000'

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                department: department,
            },
            emailRedirectTo: `${origin}/auth/callback`,
        },
    })

    if (error) {
        console.error(error)
        return redirect('/login?error=Error al crear cuenta. Intenta de nuevo.')
    }

    return redirect('/login?message=Cuenta creada. Revisa tu correo o inicia sesión.')
}
