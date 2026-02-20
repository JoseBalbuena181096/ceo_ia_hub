'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
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
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Menú</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
                <SheetHeader>
                    <SheetTitle className="text-left">VIAD HUB IA</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 mt-6">
                    <Link
                        href="/"
                        onClick={() => setOpen(false)}
                        className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
                    >
                        Inicio
                    </Link>
                    <Link
                        href="/library"
                        onClick={() => setOpen(false)}
                        className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
                    >
                        Biblioteca
                    </Link>
                    <Link
                        href="/learning"
                        onClick={() => setOpen(false)}
                        className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
                    >
                        Micro-learning
                    </Link>

                    {isLoggedIn && (
                        <Link
                            href="/profile"
                            onClick={() => setOpen(false)}
                            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
                        >
                            Mi perfil
                        </Link>
                    )}

                    {isAdmin && (
                        <>
                            <div className="my-2 border-t" />
                            <Link
                                href="/admin"
                                onClick={() => setOpen(false)}
                                className="rounded-md px-3 py-2 text-sm font-medium text-viad-navy hover:bg-viad-blue/10 dark:text-viad-blue dark:hover:bg-viad-blue/10 transition-colors"
                            >
                                Panel Admin
                            </Link>
                        </>
                    )}

                    <div className="my-2 border-t" />

                    {isLoggedIn ? (
                        <form action="/auth/signout" method="post">
                            <button
                                type="submit"
                                className="w-full text-left rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                            >
                                Cerrar sesión
                            </button>
                        </form>
                    ) : (
                        <Link
                            href="/login"
                            onClick={() => setOpen(false)}
                            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
                        >
                            Ingresar
                        </Link>
                    )}
                </nav>
            </SheetContent>
        </Sheet>
    )
}
