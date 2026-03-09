'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Search, ArrowRight } from 'lucide-react'

export function HomeSearch() {
    const [query, setQuery] = useState('')
    const router = useRouter()

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (query.trim()) {
            router.push(`/search?query=${encodeURIComponent(query.trim())}`)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-lg flex items-center gap-2">
            <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                <input
                    type="search"
                    placeholder="Buscar prompts, videos..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex h-12 w-full rounded-xl border border-border/60 bg-card px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-viad-blue/40 focus-visible:border-viad-blue/30 transition-all duration-200 pl-10 shadow-sm"
                />
            </div>
            <Button type="submit" size="lg" className="h-12 px-5 bg-viad-navy hover:bg-viad-navy-light shadow-sm shadow-viad-navy/10 rounded-xl font-medium tracking-wide">
                Buscar
                <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
        </form>
    )
}
