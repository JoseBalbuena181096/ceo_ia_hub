import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, FileText, Video, LogOut, Tags, Users } from 'lucide-react'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = createClient()
    const { data: { user } } = await (await supabase).auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Check if admin
    const { data: profile } = await (await supabase)
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

    if (!profile?.is_admin) {
        redirect('/')
    }

    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            <aside className="w-full md:w-64 border-r bg-muted/40 p-6 flex flex-col gap-6">
                <div className="flex items-center gap-2 px-2">
                    <LayoutDashboard className="h-6 w-6 text-indigo-600" />
                    <span className="font-bold text-lg">Panel Admin</span>
                </div>
                <nav className="flex flex-col gap-2">
                    <Button asChild variant="ghost" className="justify-start">
                        <Link href="/admin">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                        </Link>
                    </Button>
                    <Button asChild variant="ghost" className="justify-start">
                        <Link href="/admin/prompts">
                            <FileText className="mr-2 h-4 w-4" />
                            Prompts
                        </Link>
                    </Button>
                    <Button asChild variant="ghost" className="justify-start">
                        <Link href="/admin/videos">
                            <Video className="mr-2 h-4 w-4" />
                            Videos
                        </Link>
                    </Button>
                    <Button asChild variant="ghost" className="justify-start">
                        <Link href="/admin/categories">
                            <Tags className="mr-2 h-4 w-4" />
                            Categorías
                        </Link>
                    </Button>
                    <Button asChild variant="ghost" className="justify-start">
                        <Link href="/admin/users">
                            <Users className="mr-2 h-4 w-4" />
                            Usuarios
                        </Link>
                    </Button>
                </nav>
                <div className="mt-auto">
                    <Button asChild variant="outline" className="w-full justify-start">
                        <Link href="/">
                            <LogOut className="mr-2 h-4 w-4" />
                            Volver al Sitio
                        </Link>
                    </Button>
                </div>
            </aside>
            <main className="flex-1 p-6 md:p-10">
                {children}
            </main>
        </div>
    )
}
