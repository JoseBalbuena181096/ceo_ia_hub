import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MainNav } from '@/components/main-nav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ClientForm } from '@/components/client-form'
import { SubmitButton } from '@/components/submit-button'
import { updateProfile } from './actions'
import { User } from 'lucide-react'

import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Mi Perfil' }
export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <>
            <MainNav />
            <div className="container py-8 md:py-12 mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8 animate-viad-slide-up">
                    <div className="rounded-xl bg-viad-blue/10 p-3">
                        <User className="h-6 w-6 text-viad-navy dark:text-viad-blue" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-heading font-bold tracking-tight">Mi Perfil</h1>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                </div>

                {/* Profile form */}
                <Card className="mb-10 border-border/60 animate-viad-slide-up stagger-1">
                    <CardHeader>
                        <CardTitle className="font-heading text-lg">Información personal</CardTitle>
                        <CardDescription>
                            Actualiza tu nombre y departamento.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ClientForm action={updateProfile} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-medium tracking-wide uppercase text-muted-foreground">Correo electrónico</Label>
                                <Input
                                    id="email"
                                    value={user.email || ''}
                                    disabled
                                    className="bg-muted/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="full_name" className="text-xs font-medium tracking-wide uppercase text-muted-foreground">Nombre completo</Label>
                                <Input
                                    id="full_name"
                                    name="full_name"
                                    defaultValue={profile?.full_name || ''}
                                    placeholder="Tu nombre completo"
                                    className="h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="department" className="text-xs font-medium tracking-wide uppercase text-muted-foreground">Departamento</Label>
                                <Input
                                    id="department"
                                    name="department"
                                    defaultValue={profile?.department || ''}
                                    placeholder="Ej: Dirección, Ventas, RRHH..."
                                    className="h-11"
                                />
                            </div>

                            <SubmitButton
                                className="w-full bg-viad-navy hover:bg-viad-navy-light h-11 font-semibold tracking-wide shadow-sm shadow-viad-navy/20"
                                loadingText="Guardando..."
                            >
                                Guardar cambios
                            </SubmitButton>
                        </ClientForm>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
