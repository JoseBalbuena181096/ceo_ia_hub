import type { Metadata } from 'next'
import Link from 'next/link'
import { login, signup, resetPassword } from './actions'

export const metadata: Metadata = { title: 'Iniciar Sesión' }
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SubmitButton } from '@/components/submit-button'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { ViadLogo } from '@/components/viad-logo'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ message?: string, error?: string }> }) {
    const params = await searchParams

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 hero-gradient" />
            <div className="absolute inset-0 geo-grid-dense hero-gradient-overlay" />
            <div className="absolute inset-0 noise-texture" />

            {/* Card */}
            <div className="relative z-10 w-full max-w-md mx-4 animate-viad-scale-in">
                <Card className="border-white/10 bg-white/95 dark:bg-card/95 backdrop-blur-xl shadow-2xl shadow-black/30">
                    <CardHeader className="text-center pb-2 pt-8">
                        <div className="mx-auto mb-5">
                            <ViadLogo full className="h-9 w-auto" />
                        </div>
                        <CardDescription className="text-muted-foreground/80 text-sm">
                            Acceso para personal del Consorcio
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-8">
                        {params?.error && (
                            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                {params.error}
                            </div>
                        )}
                        {params?.message && (
                            <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
                                <CheckCircle2 className="h-4 w-4 shrink-0" />
                                {params.message}
                            </div>
                        )}

                        <Tabs defaultValue="login" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-5 bg-muted/60">
                                <TabsTrigger value="login" className="text-xs font-medium tracking-wide uppercase">Iniciar Sesión</TabsTrigger>
                                <TabsTrigger value="register" className="text-xs font-medium tracking-wide uppercase">Registrarse</TabsTrigger>
                            </TabsList>

                            <TabsContent value="login">
                                <form className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-xs font-medium tracking-wide uppercase text-muted-foreground">Correo</Label>
                                        <Input id="email" name="email" type="email" placeholder="usuario@ceo.edu.mx" required className="h-11" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-xs font-medium tracking-wide uppercase text-muted-foreground">Contraseña</Label>
                                        <Input id="password" name="password" type="password" required className="h-11" />
                                    </div>
                                    <SubmitButton
                                        className="w-full bg-viad-navy hover:bg-viad-navy-light h-11 font-semibold tracking-wide shadow-lg shadow-viad-navy/20"
                                        loadingText="Ingresando..."
                                        formAction={login}
                                    >
                                        Entrar
                                    </SubmitButton>
                                    <div className="text-center">
                                        <SubmitButton
                                            variant="link"
                                            className="text-xs text-muted-foreground hover:text-foreground p-0 h-auto"
                                            loadingText="Enviando..."
                                            formAction={resetPassword}
                                        >
                                            ¿Olvidaste tu contraseña?
                                        </SubmitButton>
                                    </div>
                                </form>
                            </TabsContent>

                            <TabsContent value="register">
                                <form className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName" className="text-xs font-medium tracking-wide uppercase text-muted-foreground">Nombre Completo</Label>
                                        <Input id="fullName" name="fullName" placeholder="Ej. Juan Pérez" required className="h-11" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="department" className="text-xs font-medium tracking-wide uppercase text-muted-foreground">Departamento</Label>
                                        <Input id="department" name="department" placeholder="Ej. Secundaria, RRHH" required className="h-11" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-email" className="text-xs font-medium tracking-wide uppercase text-muted-foreground">Correo</Label>
                                        <Input id="signup-email" name="email" type="email" placeholder="tu@correo.com" required className="h-11" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-password" className="text-xs font-medium tracking-wide uppercase text-muted-foreground">Contraseña</Label>
                                        <Input id="signup-password" name="password" type="password" required className="h-11" />
                                    </div>
                                    <div className="text-[11px] text-muted-foreground/70 italic">
                                        * Tu cuenta será creada pero puede requerir validación.
                                    </div>
                                    <SubmitButton
                                        className="w-full bg-viad-navy hover:bg-viad-navy-light h-11 font-semibold tracking-wide shadow-lg shadow-viad-navy/20"
                                        loadingText="Creando cuenta..."
                                        formAction={signup}
                                    >
                                        Crear Cuenta
                                    </SubmitButton>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Footer text */}
                <p className="text-center mt-6 text-[11px] text-white/30 tracking-wider">
                    VIAD HUB &mdash; Consorcio Educativo de Oriente
                </p>
            </div>
        </div>
    )
}
