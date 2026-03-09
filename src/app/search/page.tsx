import { createClient } from '@/lib/supabase/server'
import { PromptCard } from '@/components/prompt-card'
import { VideoCard } from '@/components/video-card'
import { MainNav } from '@/components/main-nav'
import { Search, BookOpen, Play } from 'lucide-react'
import Link from 'next/link'

import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Búsqueda Global' }
export const dynamic = 'force-dynamic'

export default async function SearchPage({
    searchParams,
}: {
    searchParams?: Promise<{ query?: string }>
}) {
    const params = await searchParams
    const query = params?.query || ''

    let prompts: any[] = []
    let videos: any[] = []
    let favoritePromptIds: Set<string> = new Set()
    let favoriteVideoIds: Set<string> = new Set()

    if (query) {
        const supabase = await createClient()

        const [promptsResult, videosResult] = await Promise.all([
            supabase
                .from('prompts')
                .select('*')
                .or(`title.ilike.%${query}%,content.ilike.%${query}%,description.ilike.%${query}%`)
                .order('created_at', { ascending: false })
                .limit(12),
            supabase
                .from('videos')
                .select('*')
                .ilike('title', `%${query}%`)
                .order('created_at', { ascending: false })
                .limit(12),
        ])

        prompts = promptsResult.data || []
        videos = videosResult.data || []

        // Fetch user favorites
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data: favs } = await supabase
                .from('favorites')
                .select('item_type, item_id')
                .eq('user_id', user.id)
            if (favs) {
                for (const f of favs) {
                    if (f.item_type === 'prompt') favoritePromptIds.add(f.item_id)
                    if (f.item_type === 'video') favoriteVideoIds.add(f.item_id)
                }
            }
        }
    }

    const totalResults = prompts.length + videos.length

    return (
        <>
            <MainNav />
            <div className="container py-8 md:py-12 mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-10 animate-viad-slide-up">
                    <div className="flex items-center gap-2.5 mb-2">
                        <div className="rounded-lg bg-viad-blue/10 p-2">
                            <Search className="h-5 w-5 text-viad-navy dark:text-viad-blue" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-heading font-bold tracking-tight">Búsqueda Global</h1>
                    </div>
                    {query ? (
                        <p className="text-muted-foreground text-sm mt-1 ml-[44px]">
                            <span className="font-semibold text-foreground/80">{totalResults}</span> resultado{totalResults !== 1 ? 's' : ''} para &quot;<span className="font-medium text-foreground/70">{query}</span>&quot;
                        </p>
                    ) : (
                        <p className="text-muted-foreground text-sm mt-1 ml-[44px]">
                            Usa el buscador del inicio para buscar prompts y videos.
                        </p>
                    )}
                </div>

                {/* Empty state */}
                {query && totalResults === 0 && (
                    <div className="text-center py-20 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border/60 animate-viad-fade-in">
                        <Search className="h-10 w-10 mx-auto mb-4 opacity-20" />
                        <p className="font-medium">No se encontraron resultados para &quot;{query}&quot;.</p>
                        <p className="text-sm mt-2 text-muted-foreground/70">Intenta con otros términos.</p>
                    </div>
                )}

                {/* Prompts section */}
                {prompts.length > 0 && (
                    <section className="mb-12 animate-viad-slide-up stagger-1">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-viad-blue" />
                                <h2 className="text-lg font-heading font-bold tracking-tight">Prompts ({prompts.length})</h2>
                            </div>
                            <Link href={`/library?query=${encodeURIComponent(query)}`} className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors tracking-wide uppercase">
                                Ver todos en Biblioteca
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {prompts.map((prompt) => (
                                <PromptCard
                                    key={prompt.id}
                                    title={prompt.title}
                                    description={prompt.description}
                                    content={prompt.content}
                                    category={prompt.category}
                                    tags={prompt.tags}
                                    promptId={prompt.id}
                                    isFavorited={favoritePromptIds.has(prompt.id)}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Videos section */}
                {videos.length > 0 && (
                    <section className="animate-viad-slide-up stagger-2">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <Play className="h-4 w-4 text-viad-purple" />
                                <h2 className="text-lg font-heading font-bold tracking-tight">Videos ({videos.length})</h2>
                            </div>
                            <Link href={`/learning?query=${encodeURIComponent(query)}`} className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors tracking-wide uppercase">
                                Ver todos en Micro-learning
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {videos.map((video) => (
                                <VideoCard
                                    key={video.id}
                                    title={video.title}
                                    url={video.url}
                                    category={video.category}
                                    duration={video.duration}
                                    videoId={video.id}
                                    isFavorited={favoriteVideoIds.has(video.id)}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </>
    )
}
