import Link from 'next/link'
import { notFound } from 'next/navigation'
import { updateVideo } from '@/app/admin/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

export default async function EditVideoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: video } = await supabase
        .from('videos')
        .select('*')
        .eq('id', id)
        .single()

    if (!video) notFound()

    const { data: categories } = await supabase
        .from('prompt_categories')
        .select('*')
        .order('name', { ascending: true })

    return (
        <div className="max-w-2xl mx-auto">
            <Breadcrumb items={[
                { label: 'Dashboard', href: '/admin' },
                { label: 'Videos', href: '/admin/videos' },
                { label: 'Editar' },
            ]} />
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Editar Video</h1>
                <Button variant="outline" asChild>
                    <Link href="/admin/videos">Cancelar</Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Detalles del Video</CardTitle>
                    <CardDescription>Modifica la información del video.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ClientForm action={updateVideo.bind(null, id)} className="space-y-6" redirectPath="/admin/videos">
                        <div className="space-y-2">
                            <Label htmlFor="title">Título</Label>
                            <Input id="title" name="title" defaultValue={video.title} required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Categoría</Label>
                            <Select name="category" defaultValue={video.category} required>
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
                            <Label htmlFor="url">URL (YouTube o TikTok)</Label>
                            <Input id="url" name="url" defaultValue={video.url} required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="duration">Duración (opcional)</Label>
                            <Input id="duration" name="duration" defaultValue={video.duration || ''} />
                        </div>

                        <SubmitButton className="w-full" loadingText="Guardando cambios...">Guardar Cambios</SubmitButton>
                    </ClientForm>
                </CardContent>
            </Card>
        </div>
    )
}
