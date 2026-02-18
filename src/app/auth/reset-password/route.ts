import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    const { searchParams, origin } = request.nextUrl
    const code = searchParams.get('code')

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            return NextResponse.redirect(new URL('/auth/update-password', origin))
        }
    }

    return NextResponse.redirect(
        new URL('/login?error=Enlace inválido o expirado. Solicita uno nuevo.', origin)
    )
}
