import { login, signup } from './actions'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage({ searchParams }: { searchParams: { message?: string, error?: string } }) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-white font-bold text-xl">CEO</span>
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">CEO AI Hub</CardTitle>
                    <CardDescription>Acceso para personal del Consorcio</CardDescription>
                </CardHeader>
                <CardContent>
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
                                <Button formAction={login} className="w-full bg-blue-600 hover:bg-blue-700">
                                    Entrar
                                </Button>
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
                                <Button formAction={signup} className="w-full bg-green-600 hover:bg-green-700">
                                    Crear Cuenta
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>

                    {searchParams?.error && (
                        <div className="mt-4 text-sm text-red-500 text-center">{searchParams.error}</div>
                    )}
                    {searchParams?.message && (
                        <div className="mt-4 text-sm text-green-500 text-center">{searchParams.message}</div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
