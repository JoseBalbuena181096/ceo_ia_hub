'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

export function HomeSearch() {
    const [query, setQuery] = useState('')
    const router = useRouter()

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (query.trim()) {
            router.push(`/library?query=${encodeURIComponent(query.trim())}`)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-lg flex items-center space-x-2">
            <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                    type="search"
                    placeholder="Buscar prompts, videos..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-8"
                />
            </div>
            <Button type="submit">Buscar</Button>
        </form>
    )
}
