'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { SubmitButton } from '@/components/submit-button'
import { updatePassword } from '@/app/login/actions'

export default function ResetPasswordPage() {
    const router = useRouter()
    const [error, setError] = useState('')
    const [ready, setReady] = useState(false)

    useEffect(() => {
        // Supabase sends the recovery code in the URL.
        // The browser client auto-detects tokens from the URL hash/params
        // and exchanges them for a session.
        const supabase = createClient()
        supabase.auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY') {
                setReady(true)
            }
        })

        // Also check if we already have a session (e.g. code was already exchanged server-side)
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) setReady(true)
        })
    }, [])

    async function handleSubmit(formData: FormData) {
        setError('')
        const result = await updatePassword(formData)

        if (result.success) {
            toast.success(result.message)
            router.push('/')
        } else {
            setError(result.message)
        }
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-uo-navy flex items-center justify-center">
                        <span className="text-white font-bold text-xl">CEO</span>
                    </div>
                    <CardTitle className="text-2xl font-bold">Nueva contraseña</CardTitle>
                    <CardDescription>Ingresa tu nueva contraseña</CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    {!ready ? (
                        <div className="text-center py-4 text-muted-foreground">
                            <p>Verificando enlace...</p>
                            <p className="text-sm mt-2">Si no carga, el enlace puede haber expirado.</p>
                        </div>
                    ) : (
                        <form action={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Nueva contraseña</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Mínimo 6 caracteres"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <SubmitButton
                                className="w-full bg-uo-navy hover:bg-uo-navy-light"
                                loadingText="Actualizando..."
                            >
                                Actualizar contraseña
                            </SubmitButton>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
