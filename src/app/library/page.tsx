import { createClient } from '@/lib/supabase/server'
import { PromptCard } from '@/components/prompt-card'
import { Search } from '@/components/search'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function LibraryPage({
    searchParams,
}: {
    searchParams?: {
        query?: string
        category?: string
    }
}) {
    const query = searchParams?.query || ''
    const category = searchParams?.category || ''

    const supabase = await createClient()

    let request = (await supabase)
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false })

    if (query) {
        // Simple search on title or content
        request = request.textSearch('title', query, { type: 'websearch', config: 'english' }).or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    }

    if (category) {
        request = request.eq('category', category)
    }

    const { data: prompts } = await request

    const categories = ['Académico', 'Ventas', 'RRHH', 'Directivo']

    return (
        <div className="container py-8 md:py-12 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Biblioteca de Prompts</h1>
                    <p className="text-muted-foreground">
                        Explora nuestra colección curada de prompts para optimizar tu trabajo.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Search placeholder="Buscar prompts..." />
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
                <Link href="/library" className={!category ? "opacity-100" : "opacity-60 hover:opacity-100"}>
                    <Badge variant={!category ? "default" : "outline"} className="text-sm px-3 py-1 cursor-pointer">
                        Todos
                    </Badge>
                </Link>
                {categories.map((cat) => (
                    <Link key={cat} href={`/library?category=${cat}`} className={category === cat ? "opacity-100" : "opacity-60 hover:opacity-100"}>
                        <Badge variant={category === cat ? "default" : "outline"} className="text-sm px-3 py-1 cursor-pointer">
                            {cat}
                        </Badge>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {prompts && prompts.length > 0 ? (
                    prompts.map((prompt) => (
                        <PromptCard
                            key={prompt.id}
                            title={prompt.title}
                            content={prompt.content}
                            category={prompt.category}
                            tags={prompt.tags}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                        <p>No se encontraron prompts con tu búsqueda.</p>
                        {query && <p className="text-sm mt-2">Intenta con otros términos.</p>}
                    </div>
                )}
            </div>
        </div>
    )
}
