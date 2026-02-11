import Link from 'next/link'
import { createVideo } from '@/app/admin/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function NewVideoPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Agregar Nuevo Video</h1>
                <Button variant="outline" asChild>
                    <Link href="/admin/videos">Cancelar</Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Detalles del Video</CardTitle>
                    <CardDescription>Ingresa la URL pública de YouTube o TikTok.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={async (formData) => {
                        'use server'
                        await createVideo(formData)
                    }} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Título</Label>
                            <Input id="title" name="title" placeholder="Ej. Hack para escritura rápida" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Categoría</Label>
                            <Select name="category" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Hacks">Hacks</SelectItem>
                                    <SelectItem value="Tutoriales">Tutoriales</SelectItem>
                                    <SelectItem value="Casos de Uso">Casos de Uso</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="url">URL (YouTube o TikTok)</Label>
                            <Input id="url" name="url" placeholder="https://www.tiktok.com/@..." required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="duration">Duración (opcional)</Label>
                            <Input id="duration" name="duration" placeholder="Ej. 1:30" />
                        </div>

                        <Button type="submit" className="w-full">Guardar Video</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
