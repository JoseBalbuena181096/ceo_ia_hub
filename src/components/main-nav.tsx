import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { MobileNav } from '@/components/mobile-nav'
import { LogOut } from 'lucide-react'
import { ViadLogo } from '@/components/viad-logo'
import { ProfileDropdown } from '@/components/profile-dropdown'

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
        <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 border-b border-border/50 animate-viad-slide-down">
            <div className="container flex h-16 max-w-screen-2xl items-center mx-auto px-4 sm:px-6 lg:px-8">
                <MobileNav isAdmin={isAdmin} isLoggedIn={!!user} />

                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-8 flex items-center group">
                        <ViadLogo full className="h-5 w-auto transition-transform duration-300 group-hover:scale-105" />
                    </Link>
                    <nav className="flex items-center gap-1 text-sm">
                        <Link
                            href="/library"
                            className="relative px-3 py-2 rounded-lg font-medium text-foreground/60 hover:text-foreground hover:bg-viad-blue/8 transition-all duration-200"
                        >
                            Biblioteca
                        </Link>
                        <Link
                            href="/learning"
                            className="relative px-3 py-2 rounded-lg font-medium text-foreground/60 hover:text-foreground hover:bg-viad-blue/8 transition-all duration-200"
                        >
                            Micro-learning
                        </Link>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <Link href="/" className="flex items-center md:hidden">
                        <ViadLogo full className="h-4 w-auto" />
                    </Link>
                    <nav className="flex items-center gap-1.5">
                        {isAdmin && (
                            <Button asChild variant="default" size="sm" className="bg-viad-navy hover:bg-viad-navy-light shadow-sm shadow-viad-navy/20 font-medium text-xs tracking-wide uppercase">
                                <Link href="/admin">Panel Admin</Link>
                            </Button>
                        )}
                        {user && (
                            <ProfileDropdown />
                        )}
                        {!user ? (
                            <Button asChild variant="ghost" size="sm" className="font-medium">
                                <Link href="/login">Ingresar</Link>
                            </Button>
                        ) : (
                            <form action="/auth/signout" method="post">
                                <Button variant="ghost" size="icon" type="submit" className="hidden md:inline-flex h-9 w-9 text-foreground/40 hover:text-destructive hover:bg-destructive/8">
                                    <LogOut className="h-4 w-4" />
                                    <span className="sr-only">Salir</span>
                                </Button>
                            </form>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    )
}
