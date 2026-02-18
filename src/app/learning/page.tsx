import { createClient } from '@/lib/supabase/server'
import { VideoCard } from '@/components/video-card'
import { Search } from '@/components/search'
import { Badge } from '@/components/ui/badge'
import { MainNav } from '@/components/main-nav'
import { Pagination } from '@/components/pagination'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 12

export default async function LearningPage({
    searchParams,
}: {
    searchParams?: Promise<{
        query?: string
        category?: string
        page?: string
    }>
}) {
    const params = await searchParams
    const query = params?.query || ''
    const category = params?.category || ''
    const currentPage = Math.max(1, parseInt(params?.page || '1'))

    const supabase = await createClient()

    // Count total for pagination
    let countQuery = supabase.from('videos').select('*', { count: 'exact', head: true })
    if (query) {
        countQuery = countQuery.ilike('title', `%${query}%`)
    }
    if (category) {
        countQuery = countQuery.eq('category', category)
    }
    const { count } = await countQuery

    const totalPages = Math.ceil((count || 0) / PAGE_SIZE)

    // Fetch paginated data
    const from = (currentPage - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    let request = supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to)

    if (query) {
        request = request.ilike('title', `%${query}%`)
    }
    if (category) {
        request = request.eq('category', category)
    }

    const { data: videos } = await request

    const { data: categoriesData } = await supabase
        .from('prompt_categories')
        .select('*')
        .order('name', { ascending: true })

    const categories = categoriesData?.map((c: { name: string }) => c.name) || []

    return (
        <>
        <MainNav />
        <div className="container py-8 md:py-12 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Micro-learning</h1>
                    <p className="text-muted-foreground">
                        Hacks de IA y tutoriales rápidos en formato vertical.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Search placeholder="Buscar videos..." />
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
                <Link href="/learning" className={!category ? "opacity-100" : "opacity-60 hover:opacity-100"}>
                    <Badge variant={!category ? "default" : "outline"} className="text-sm px-3 py-1 cursor-pointer">
                        Todos
                    </Badge>
                </Link>
                {categories.map((cat: string) => (
                    <Link key={cat} href={`/learning?category=${cat}`} className={category === cat ? "opacity-100" : "opacity-60 hover:opacity-100"}>
                        <Badge variant={category === cat ? "default" : "outline"} className="text-sm px-3 py-1 cursor-pointer">
                            {cat}
                        </Badge>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {videos && videos.length > 0 ? (
                    videos.map((video) => (
                        <VideoCard
                            key={video.id}
                            title={video.title}
                            url={video.url}
                            category={video.category}
                            duration={video.duration}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                        <p>No se encontraron videos con tu búsqueda.</p>
                        {query && <p className="text-sm mt-2">Intenta con otros términos.</p>}
                    </div>
                )}
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
        </>
    )
}
