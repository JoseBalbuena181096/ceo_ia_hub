'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
    currentPage: number
    totalPages: number
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    if (totalPages <= 1) return null

    function createPageUrl(page: number) {
        const params = new URLSearchParams(searchParams)
        params.set('page', page.toString())
        return `${pathname}?${params.toString()}`
    }

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            <Button
                variant="outline"
                size="sm"
                asChild
                disabled={currentPage <= 1}
            >
                {currentPage > 1 ? (
                    <Link href={createPageUrl(currentPage - 1)}>
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Anterior
                    </Link>
                ) : (
                    <span className="pointer-events-none opacity-50">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Anterior
                    </span>
                )}
            </Button>

            <span className="text-sm text-muted-foreground px-2">
                Página {currentPage} de {totalPages}
            </span>

            <Button
                variant="outline"
                size="sm"
                asChild
                disabled={currentPage >= totalPages}
            >
                {currentPage < totalPages ? (
                    <Link href={createPageUrl(currentPage + 1)}>
                        Siguiente
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                ) : (
                    <span className="pointer-events-none opacity-50">
                        Siguiente
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </span>
                )}
            </Button>
        </div>
    )
}
