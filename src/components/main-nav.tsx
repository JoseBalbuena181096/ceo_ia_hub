import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { MobileNav } from '@/components/mobile-nav'
import { User } from 'lucide-react'
import { ViadLogo } from '@/components/viad-logo'

export async function MainNav() {
    const supabase = createClient()
    const { data: { user } } = await (await supabase).auth.getUser()

    let isAdmin = false
    if (user) {
        const { data: profile } = await (await supabase)
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single()
        isAdmin = profile?.is_admin || false
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center mx-auto px-4 sm:px-6 lg:px-8">
                <MobileNav isAdmin={isAdmin} isLoggedIn={!!user} />

                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <ViadLogo className="h-5 w-auto" />
                        <span className="hidden font-bold sm:inline-block text-sm">
                            HUB IA
                        </span>
                    </Link>
                    <nav className="flex items-center gap-6 text-sm">
                        <Link href="/library" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            Biblioteca
                        </Link>
                        <Link href="/learning" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            Micro-learning
                        </Link>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <Link href="/" className="flex items-center gap-1.5 font-bold md:hidden">
                        <ViadLogo className="h-4 w-auto" />
                        <span className="text-sm">HUB IA</span>
                    </Link>
                    <nav className="flex items-center gap-2">
                        {isAdmin && (
                            <Button asChild variant="default" size="sm" className="bg-viad-navy hover:bg-viad-navy-light">
                                <Link href="/admin">Panel Admin</Link>
                            </Button>
                        )}
                        {user && (
                            <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
                                <Link href="/profile">
                                    <User className="mr-1 h-4 w-4" />
                                    Mi perfil
                                </Link>
                            </Button>
                        )}
                        {!user ? (
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/login">Ingresar</Link>
                            </Button>
                        ) : (
                            <form action="/auth/signout" method="post">
                                <Button variant="ghost" size="sm" type="submit" className="hidden md:inline-flex">
                                    Salir
                                </Button>
                            </form>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    )
}
