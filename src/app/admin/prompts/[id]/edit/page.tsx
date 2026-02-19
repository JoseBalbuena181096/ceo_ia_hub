import Link from 'next/link'
import { notFound } from 'next/navigation'
import { updatePrompt } from '@/app/admin/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/server'
import { ClientForm } from '@/components/client-form'
import { SubmitButton } from '@/components/submit-button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Breadcrumb } from '@/components/breadcrumb'

export const dynamic = 'force-dynamic'

export default async function EditPromptPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: prompt } = await supabase
        .from('prompts')
        .select('*')
        .eq('id', id)
        .single()

    if (!prompt) notFound()

    const { data: categories } = await supabase
        .from('prompt_categories')
        .select('*')
        .order('name', { ascending: true })

    return (
        <div className="max-w-2xl mx-auto">
            <Breadcrumb items={[
                { label: 'Dashboard', href: '/admin' },
                { label: 'Prompts', href: '/admin/prompts' },
                { label: 'Editar' },
            ]} />
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Editar Prompt</h1>
                <Button variant="outline" asChild>
                    <Link href="/admin/prompts">Cancelar</Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Detalles del Prompt</CardTitle>
                    <CardDescription>Modifica la información del prompt.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ClientForm action={updatePrompt.bind(null, id)} className="space-y-6" redirectPath="/admin/prompts">
                        <div className="space-y-2">
                            <Label htmlFor="title">Título</Label>
                            <Input id="title" name="title" defaultValue={prompt.title} required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea
                                id="description"
                                name="description"
                                defaultValue={prompt.description || ''}
                                placeholder="Breve descripción de qué hace este prompt..."
                                className="min-h-[80px] text-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Categoría</Label>
                            <Select name="category" defaultValue={prompt.category} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories?.map((cat: { id: string; name: string }) => (
                                        <SelectItem key={cat.id} value={cat.name}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tags">Etiquetas (separadas por coma)</Label>
                            <Input id="tags" name="tags" defaultValue={prompt.tags?.join(', ') || ''} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Contenido del Prompt</Label>
                            <Textarea
                                id="content"
                                name="content"
                                defaultValue={prompt.content}
                                className="min-h-[200px] font-mono text-sm"
                                required
                            />
                        </div>

                        <SubmitButton className="w-full" loadingText="Guardando cambios...">Guardar Cambios</SubmitButton>
                    </ClientForm>
                </CardContent>
            </Card>
        </div>
    )
}
