import Link from 'next/link'
import { createPrompt } from '@/app/admin/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/server'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export const dynamic = 'force-dynamic'

export default async function NewPromptPage() {
    const supabase = await createClient()
    const { data: categories } = await supabase
        .from('prompt_categories')
        .select('*')
        .order('name', { ascending: true })

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Crear Nuevo Prompt</h1>
                <Button variant="outline" asChild>
                    <Link href="/admin/prompts">Cancelar</Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Detalles del Prompt</CardTitle>
                    <CardDescription>Ingresa la información para agregar al catálogo.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={async (formData) => {
                        'use server'
                        await createPrompt(formData)
                    }} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Título</Label>
                            <Input id="title" name="title" placeholder="Ej. Generador de Correos RRHH" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Categoría</Label>
                            <Select name="category" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories?.map((cat: any) => (
                                        <SelectItem key={cat.id} value={cat.name}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tags">Etiquetas (separadas por coma)</Label>
                            <Input id="tags" name="tags" placeholder="ej. email, productividad, rrhh" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Contenido del Prompt</Label>
                            <Textarea
                                id="content"
                                name="content"
                                placeholder="Actúa como un experto en..."
                                className="min-h-[200px] font-mono text-sm"
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full">Guardar Prompt</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
