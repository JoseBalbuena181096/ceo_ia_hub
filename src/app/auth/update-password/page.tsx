'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { SubmitButton } from '@/components/submit-button'
import { updatePassword } from '@/app/login/actions'
import { ViadLogo } from '@/components/viad-logo'

export default function UpdatePasswordPage() {
    const router = useRouter()
    const [error, setError] = useState('')

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
                    <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-viad-navy flex items-center justify-center">
                        <ViadLogo className="h-7 w-7" color="white" />
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
                            className="w-full bg-viad-navy hover:bg-viad-navy-light"
                            loadingText="Actualizando..."
                        >
                            Actualizar contraseña
                        </SubmitButton>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
