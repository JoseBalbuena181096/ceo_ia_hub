import { createClient } from '@/lib/supabase/server'
import { PromptCard } from '@/components/prompt-card'
import { VideoCard } from '@/components/video-card'
import { MainNav } from '@/components/main-nav'
import { Search } from 'lucide-react'
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
                .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
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
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Búsqueda Global</h1>
                    {query ? (
                        <p className="text-muted-foreground mt-1">
                            {totalResults} resultado{totalResults !== 1 ? 's' : ''} para &quot;{query}&quot;
                        </p>
                    ) : (
                        <p className="text-muted-foreground mt-1">
                            Usa el buscador del inicio para buscar prompts y videos.
                        </p>
                    )}
                </div>

                {query && totalResults === 0 && (
                    <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                        <Search className="h-10 w-10 mx-auto mb-3 opacity-40" />
                        <p>No se encontraron resultados para &quot;{query}&quot;.</p>
                        <p className="text-sm mt-2">Intenta con otros términos.</p>
                    </div>
                )}

                {prompts.length > 0 && (
                    <section className="mb-12">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">Prompts ({prompts.length})</h2>
                            <Link href={`/library?query=${encodeURIComponent(query)}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Ver todos en Biblioteca
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {prompts.map((prompt) => (
                                <PromptCard
                                    key={prompt.id}
                                    title={prompt.title}
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

                {videos.length > 0 && (
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">Videos ({videos.length})</h2>
                            <Link href={`/learning?query=${encodeURIComponent(query)}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Ver todos en Micro-learning
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
