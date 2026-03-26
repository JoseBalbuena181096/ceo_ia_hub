import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MainNav } from '@/components/main-nav'
import { PromptCard } from '@/components/prompt-card'
import { VideoCard } from '@/components/video-card'
import { Heart, BookOpen, Play } from 'lucide-react'

import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Mis Favoritos' }
export const dynamic = 'force-dynamic'

export default async function FavoritesPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Fetch favorites
    const { data: favorites } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    const promptFavIds = (favorites || []).filter((f: any) => f.item_type === 'prompt').map((f: any) => f.item_id)
    const videoFavIds = (favorites || []).filter((f: any) => f.item_type === 'video').map((f: any) => f.item_id)

    let favPrompts: any[] = []
    if (promptFavIds.length > 0) {
        const { data } = await supabase
            .from('prompts')
            .select('*')
            .in('id', promptFavIds)
        favPrompts = data || []
    }

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
            <div className="container py-8 md:py-12 mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8 animate-viad-slide-up">
                    <div className="rounded-xl bg-viad-orange/10 p-3">
                        <Heart className="h-6 w-6 text-viad-orange" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-heading font-bold tracking-tight">Mis Favoritos</h1>
                        <p className="text-sm text-muted-foreground">Tus prompts y videos guardados</p>
                    </div>
                </div>

                {favPrompts.length === 0 && favVideos.length === 0 && (
                    <div className="text-center py-16 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border/60 animate-viad-slide-up stagger-1">
                        <Heart className="h-8 w-8 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">Aún no tienes favoritos.</p>
                        <p className="text-sm mt-2 text-muted-foreground/70">Marca prompts o videos con el corazón para guardarlos aquí.</p>
                    </div>
                )}

                {favPrompts.length > 0 && (
                    <section className="mb-10 animate-viad-slide-up stagger-1">
                        <div className="flex items-center gap-2 mb-4">
                            <BookOpen className="h-4 w-4 text-viad-blue" />
                            <h2 className="text-sm font-heading font-bold uppercase tracking-wider text-muted-foreground">Prompts ({favPrompts.length})</h2>
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
                    </section>
                )}

                {favVideos.length > 0 && (
                    <section className="animate-viad-slide-up stagger-2">
                        <div className="flex items-center gap-2 mb-4">
                            <Play className="h-4 w-4 text-viad-purple" />
                            <h2 className="text-sm font-heading font-bold uppercase tracking-wider text-muted-foreground">Videos ({favVideos.length})</h2>
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
                    </section>
                )}
            </div>
        </>
    )
}
