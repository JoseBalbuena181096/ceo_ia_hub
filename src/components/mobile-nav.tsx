'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, BookOpen, Play, User, Shield, LogOut, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'

interface MobileNavProps {
    isAdmin: boolean
    isLoggedIn: boolean
}

export function MobileNav({ isAdmin, isLoggedIn }: MobileNavProps) {
    const [open, setOpen] = useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Menú</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
                <SheetHeader>
                    <SheetTitle className="text-left font-heading font-bold tracking-tight">VIAD HUB</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-0.5 mt-6">
                    <Link
                        href="/"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-viad-blue/8 transition-colors"
                    >
                        <Home className="h-4 w-4 text-muted-foreground" />
                        Inicio
                    </Link>
                    <Link
                        href="/library"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-viad-blue/8 transition-colors"
                    >
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        Biblioteca
                    </Link>
                    <Link
                        href="/learning"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-viad-blue/8 transition-colors"
                    >
                        <Play className="h-4 w-4 text-muted-foreground" />
                        Micro-learning
                    </Link>

                    {isLoggedIn && (
                        <Link
                            href="/profile"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-viad-blue/8 transition-colors"
                        >
                            <User className="h-4 w-4 text-muted-foreground" />
                            Mi perfil
                        </Link>
                    )}

                    {isAdmin && (
                        <>
                            <div className="my-2 border-t border-border/40" />
                            <Link
                                href="/admin"
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-viad-navy hover:bg-viad-blue/10 dark:text-viad-blue dark:hover:bg-viad-blue/10 transition-colors"
                            >
                                <Shield className="h-4 w-4" />
                                Panel Admin
                            </Link>
                        </>
                    )}

                    <div className="my-2 border-t border-border/40" />

                    {isLoggedIn ? (
                        <form action="/auth/signout" method="post">
                            <button
                                type="submit"
                                className="w-full flex items-center gap-3 text-left rounded-lg px-3 py-2.5 text-sm font-medium text-destructive/80 hover:bg-destructive/5 transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                Cerrar sesión
                            </button>
                        </form>
                    ) : (
                        <Link
                            href="/login"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-viad-blue/8 transition-colors"
                        >
                            <User className="h-4 w-4 text-muted-foreground" />
                            Ingresar
                        </Link>
                    )}
                </nav>
            </SheetContent>
        </Sheet>
    )
}
