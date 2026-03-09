import { createClient } from '@/lib/supabase/server'
import { PromptCard } from '@/components/prompt-card'
import { Search } from '@/components/search'
import { Badge } from '@/components/ui/badge'
import { MainNav } from '@/components/main-nav'
import { Pagination } from '@/components/pagination'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'

import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Biblioteca de Prompts' }
export const dynamic = 'force-dynamic'

const PAGE_SIZE = 12

export default async function LibraryPage({
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
    let countQuery = supabase.from('prompts').select('*', { count: 'exact', head: true })
    if (query) {
        countQuery = countQuery.or(`title.ilike.%${query}%,content.ilike.%${query}%,description.ilike.%${query}%`)
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
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to)

    if (query) {
        request = request.or(`title.ilike.%${query}%,content.ilike.%${query}%,description.ilike.%${query}%`)
    }
    if (category) {
        request = request.eq('category', category)
    }

    const { data: prompts } = await request

    // Fetch dynamic categories
    const { data: categoriesData } = await supabase
        .from('prompt_categories')
        .select('*')
        .order('name', { ascending: true })

    const categories = categoriesData?.map((c: { name: string }) => c.name) || []

    // Fetch user favorites
    const { data: { user } } = await supabase.auth.getUser()
    let favoriteIds: Set<string> = new Set()
    if (user) {
        const { data: favs } = await supabase
            .from('favorites')
            .select('item_id')
            .eq('user_id', user.id)
            .eq('item_type', 'prompt')
        if (favs) {
            favoriteIds = new Set(favs.map((f: { item_id: string }) => f.item_id))
        }
    }

    return (
        <>
        <MainNav />
        <div className="container py-8 md:py-12 mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-10 animate-viad-slide-up">
                <div>
                    <div className="flex items-center gap-2.5 mb-2">
                        <div className="rounded-lg bg-viad-blue/10 p-2">
                            <BookOpen className="h-5 w-5 text-viad-navy dark:text-viad-blue" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-heading font-bold tracking-tight">Biblioteca de Prompts</h1>
                    </div>
                    <p className="text-muted-foreground text-sm ml-[44px]">
                        Explora nuestra colección curada de prompts para optimizar tu trabajo.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Search placeholder="Buscar prompts..." />
                </div>
            </div>

            {/* Category filters */}
            <div className="flex flex-wrap gap-2 mb-8 animate-viad-fade-in stagger-1">
                <Link href="/library" className="transition-all duration-200">
                    <Badge
                        variant={!category ? "default" : "outline"}
                        className={`text-xs px-3 py-1.5 cursor-pointer tracking-wide transition-all duration-200 ${
                            !category
                                ? 'bg-viad-navy text-white shadow-sm shadow-viad-navy/20'
                                : 'hover:border-viad-blue/40 text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        Todos
                    </Badge>
                </Link>
                {categories.map((cat: string) => (
                    <Link key={cat} href={`/library?category=${cat}`} className="transition-all duration-200">
                        <Badge
                            variant={category === cat ? "default" : "outline"}
                            className={`text-xs px-3 py-1.5 cursor-pointer tracking-wide transition-all duration-200 ${
                                category === cat
                                    ? 'bg-viad-navy text-white shadow-sm shadow-viad-navy/20'
                                    : 'hover:border-viad-blue/40 text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {cat}
                        </Badge>
                    </Link>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {prompts && prompts.length > 0 ? (
                    prompts.map((prompt, i) => (
                        <div key={prompt.id} className={`animate-viad-slide-up stagger-${Math.min(i + 1, 8)}`}>
                            <PromptCard
                                title={prompt.title}
                                description={prompt.description}
                                content={prompt.content}
                                category={prompt.category}
                                tags={prompt.tags}
                                promptId={prompt.id}
                                isFavorited={favoriteIds.has(prompt.id)}
                            />
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-16 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border/60">
                        <BookOpen className="h-8 w-8 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No se encontraron prompts con tu búsqueda.</p>
                        {query && <p className="text-sm mt-2 text-muted-foreground/70">Intenta con otros términos.</p>}
                    </div>
                )}
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
        </>
    )
}
