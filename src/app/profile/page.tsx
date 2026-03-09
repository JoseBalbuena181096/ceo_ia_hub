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
import { User, Heart, BookOpen, Play } from 'lucide-react'

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

                {/* Favorites */}
                <section className="animate-viad-slide-up stagger-2">
                    <div className="flex items-center gap-2.5 mb-6">
                        <Heart className="h-5 w-5 text-viad-orange" />
                        <h2 className="text-xl font-heading font-bold tracking-tight">Mis favoritos</h2>
                    </div>

                    {favPrompts.length === 0 && favVideos.length === 0 && (
                        <div className="text-center py-16 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border/60">
                            <Heart className="h-8 w-8 mx-auto mb-3 opacity-30" />
                            <p className="font-medium">Aún no tienes favoritos.</p>
                            <p className="text-sm mt-2 text-muted-foreground/70">Marca prompts o videos con el corazón para guardarlos aquí.</p>
                        </div>
                    )}

                    {favPrompts.length > 0 && (
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <BookOpen className="h-4 w-4 text-viad-blue" />
                                <h3 className="text-sm font-heading font-bold uppercase tracking-wider text-muted-foreground">Prompts ({favPrompts.length})</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {favPrompts.map((prompt: any) => (
                                    <PromptCard
                                        key={prompt.id}
                                        title={prompt.title}
                                        description={prompt.description}
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
                            <div className="flex items-center gap-2 mb-4">
                                <Play className="h-4 w-4 text-viad-purple" />
                                <h3 className="text-sm font-heading font-bold uppercase tracking-wider text-muted-foreground">Videos ({favVideos.length})</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
