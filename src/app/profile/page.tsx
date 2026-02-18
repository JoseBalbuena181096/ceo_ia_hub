import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MainNav } from '@/components/main-nav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ClientForm } from '@/components/client-form'
import { SubmitButton } from '@/components/submit-button'
import { PromptCard } from '@/components/prompt-card'
import { VideoCard } from '@/components/video-card'
import { updateProfile } from './actions'

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

    // Fetch favorites
    const { data: favorites } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    const promptFavIds = (favorites || []).filter((f: any) => f.item_type === 'prompt').map((f: any) => f.item_id)
    const videoFavIds = (favorites || []).filter((f: any) => f.item_type === 'video').map((f: any) => f.item_id)

    // Fetch favorite prompts
    let favPrompts: any[] = []
    if (promptFavIds.length > 0) {
        const { data } = await supabase
            .from('prompts')
            .select('*')
            .in('id', promptFavIds)
        favPrompts = data || []
    }

    // Fetch favorite videos
    let favVideos: any[] = []
    if (videoFavIds.length > 0) {
        const { data } = await supabase
            .from('videos')
            .select('*')
            .in('id', videoFavIds)
        favVideos = data || []
    }

    return (
        <>
            <MainNav />
            <div className="container py-8 md:py-12 mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <h1 className="text-3xl font-bold tracking-tight mb-8">Mi Perfil</h1>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Información personal</CardTitle>
                        <CardDescription>
                            Actualiza tu nombre y departamento.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ClientForm action={updateProfile} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo electrónico</Label>
                                <Input
                                    id="email"
                                    value={user.email || ''}
                                    disabled
                                    className="bg-muted"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="full_name">Nombre completo</Label>
                                <Input
                                    id="full_name"
                                    name="full_name"
                                    defaultValue={profile?.full_name || ''}
                                    placeholder="Tu nombre completo"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="department">Departamento</Label>
                                <Input
                                    id="department"
                                    name="department"
                                    defaultValue={profile?.department || ''}
                                    placeholder="Ej: Dirección, Ventas, RRHH..."
                                />
                            </div>

                            <SubmitButton className="w-full" loadingText="Guardando...">
                                Guardar cambios
                            </SubmitButton>
                        </ClientForm>
                    </CardContent>
                </Card>

                <section>
                    <h2 className="text-2xl font-bold tracking-tight mb-6">Mis favoritos</h2>

                    {favPrompts.length === 0 && favVideos.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                            <p>Aún no tienes favoritos.</p>
                            <p className="text-sm mt-2">Marca prompts o videos con el corazón para guardarlos aquí.</p>
                        </div>
                    )}

                    {favPrompts.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-4">Prompts ({favPrompts.length})</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {favPrompts.map((prompt: any) => (
                                    <PromptCard
                                        key={prompt.id}
                                        title={prompt.title}
                                        content={prompt.content}
                                        category={prompt.category}
                                        tags={prompt.tags}
                                        promptId={prompt.id}
                                        isFavorited={true}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {favVideos.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Videos ({favVideos.length})</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {favVideos.map((video: any) => (
                                    <VideoCard
                                        key={video.id}
                                        title={video.title}
                                        url={video.url}
                                        category={video.category}
                                        duration={video.duration}
                                        videoId={video.id}
                                        isFavorited={true}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </>
    )
}
