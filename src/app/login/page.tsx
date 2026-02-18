import type { Metadata } from 'next'
import { login, signup } from './actions'

export const metadata: Metadata = { title: 'Iniciar Sesión' }
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SubmitButton } from '@/components/submit-button'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ message?: string, error?: string }> }) {
    const params = await searchParams

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center">
                        <span className="text-white font-bold text-xl">CEO</span>
                    </div>
                    <CardTitle className="text-2xl font-bold">CEO AI Hub</CardTitle>
                    <CardDescription>Acceso para personal del Consorcio</CardDescription>
                </CardHeader>
                <CardContent>
                    {params?.error && (
                        <div className="mb-4 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            {params.error}
                        </div>
                    )}
                    {params?.message && (
                        <div className="mb-4 flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
                            <CheckCircle2 className="h-4 w-4 shrink-0" />
                            {params.message}
                        </div>
                    )}

                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                            <TabsTrigger value="register">Registrarse</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login">
                            <form className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Correo</Label>
                                    <Input id="email" name="email" type="email" placeholder="usuario@ceo.edu.mx" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Contraseña</Label>
                                    <Input id="password" name="password" type="password" required />
                                </div>
                                <SubmitButton
                                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                                    loadingText="Ingresando..."
                                    formAction={login}
                                >
                                    Entrar
                                </SubmitButton>
                            </form>
                        </TabsContent>

                        <TabsContent value="register">
                            <form className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Nombre Completo</Label>
                                    <Input id="fullName" name="fullName" placeholder="Ej. Juan Pérez" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="department">Departamento</Label>
                                    <Input id="department" name="department" placeholder="Ej. Secundaria, RRHH" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-email">Correo</Label>
                                    <Input id="signup-email" name="email" type="email" placeholder="tu@correo.com" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-password">Contraseña</Label>
                                    <Input id="signup-password" name="password" type="password" required />
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    * Tu cuenta será creada pero puede requerir validación.
                                </div>
                                <SubmitButton
                                    className="w-full bg-green-600 hover:bg-green-700"
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
        </div>
    )
}
