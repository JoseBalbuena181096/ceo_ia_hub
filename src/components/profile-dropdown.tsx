'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { User, Heart, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ProfileDropdown() {
    const [open, setOpen] = useState(false)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        setOpen(true)
    }

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => setOpen(false), 200)
    }

    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Button
                variant="ghost"
                size="sm"
                className="hidden md:inline-flex text-foreground/60 hover:text-foreground hover:bg-viad-blue/8"
                asChild
            >
                <Link href="/profile">
                    <User className="mr-1.5 h-4 w-4" />
                    Mi perfil
                    <ChevronDown className={`ml-1 h-3 w-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                </Link>
            </Button>

            {open && (
                <div className="absolute right-0 top-full pt-1 z-50">
                    <div className="w-48 rounded-xl border border-border/60 bg-background/95 backdrop-blur-xl shadow-xl shadow-black/10 animate-viad-fade-in overflow-hidden">
                        <div className="p-1.5">
                            <Link
                                href="/profile"
                                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-viad-blue/8 transition-colors duration-150"
                            >
                                <User className="h-4 w-4 text-muted-foreground" />
                                Mi perfil
                            </Link>
                            <Link
                                href="/favorites"
                                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-viad-blue/8 transition-colors duration-150"
                            >
                                <Heart className="h-4 w-4 text-viad-orange" />
                                Mis favoritos
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
