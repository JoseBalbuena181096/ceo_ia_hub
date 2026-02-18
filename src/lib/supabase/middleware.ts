import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
        console.error('Supabase Credentials Missing in Middleware!')
        // Allow request to proceed to allow debugging or showing checking env vars
        return response
    }

    const supabase = createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    try {
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (
            !user &&
            !request.nextUrl.pathname.startsWith('/login') &&
            !request.nextUrl.pathname.startsWith('/auth')
        ) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }

        // Check if user is blocked
        if (
            user &&
            !request.nextUrl.pathname.startsWith('/login') &&
            !request.nextUrl.pathname.startsWith('/auth')
        ) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('is_blocked')
                .eq('id', user.id)
                .single()

            if (profile?.is_blocked) {
                await supabase.auth.signOut()
                const url = request.nextUrl.clone()
                url.pathname = '/login'
                url.searchParams.set('error', 'Tu cuenta ha sido bloqueada. Contacta al administrador.')
                return NextResponse.redirect(url)
            }
        }
    } catch (e) {
        console.error('Middleware Supabase Error:', e)
        // On error, let the request proceed or handle gracefully
        return response
    }

    return response
}
