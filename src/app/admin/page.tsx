import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Video, Users, Plus, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
    const supabase = await createClient()

    const { count: promptsCount } = await supabase.from('prompts').select('*', { count: 'exact', head: true })
    const { count: videosCount } = await supabase.from('videos').select('*', { count: 'exact', head: true })
    const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })

    const { data: recentPrompts } = await supabase
        .from('prompts')
        .select('id, title, category, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

    const { data: recentVideos } = await supabase
        .from('videos')
        .select('id, title, category, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

    return (
        <div className="space-y-8 p-8 pt-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard General</h1>
                <p className="text-muted-foreground">Bienvenido al panel de administración del CEO AI Hub.</p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Prompts</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{promptsCount || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
                        <Video className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{videosCount || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Usuarios Registrados</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{usersCount || 0}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick actions */}
            <div className="flex flex-wrap gap-3">
                <Button asChild>
                    <Link href="/admin/prompts/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Prompt
                    </Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/admin/videos/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Video
                    </Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/admin/users">
                        <Users className="mr-2 h-4 w-4" />
                        Gestionar Usuarios
                    </Link>
                </Button>
            </div>

            {/* Recent activity */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base">Últimos Prompts</CardTitle>
                        <Button asChild variant="ghost" size="sm">
                            <Link href="/admin/prompts">
                                Ver todos <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {recentPrompts && recentPrompts.length > 0 ? (
                            <div className="space-y-3">
                                {recentPrompts.map((prompt) => (
                                    <div key={prompt.id} className="flex items-center justify-between text-sm">
                                        <div className="truncate flex-1 mr-4">
                                            <Link href={`/admin/prompts/${prompt.id}/edit`} className="font-medium hover:underline">
                                                {prompt.title}
                                            </Link>
                                            <p className="text-muted-foreground text-xs">{prompt.category}</p>
                                        </div>
                                        <span className="text-xs text-muted-foreground shrink-0">
                                            {new Date(prompt.created_at).toLocaleDateString('es-MX')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">Sin prompts aún.</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base">Últimos Videos</CardTitle>
                        <Button asChild variant="ghost" size="sm">
                            <Link href="/admin/videos">
                                Ver todos <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {recentVideos && recentVideos.length > 0 ? (
                            <div className="space-y-3">
                                {recentVideos.map((video) => (
                                    <div key={video.id} className="flex items-center justify-between text-sm">
                                        <div className="truncate flex-1 mr-4">
                                            <Link href={`/admin/videos/${video.id}/edit`} className="font-medium hover:underline">
                                                {video.title}
                                            </Link>
                                            <p className="text-muted-foreground text-xs">{video.category}</p>
                                        </div>
                                        <span className="text-xs text-muted-foreground shrink-0">
                                            {new Date(video.created_at).toLocaleDateString('es-MX')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">Sin videos aún.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
