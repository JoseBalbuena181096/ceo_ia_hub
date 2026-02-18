import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { deleteVideo } from '@/app/admin/actions'
import { Plus, ExternalLink, Pencil } from 'lucide-react'
import { ConfirmDelete } from '@/components/confirm-delete'

export const dynamic = 'force-dynamic'

export default async function AdminVideosPage() {
    const supabase = createClient()
    const { data: videos } = await (await supabase)
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Gestión de Videos</h1>
                <Button asChild>
                    <Link href="/admin/videos/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Video
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Título</TableHead>
                            <TableHead>Categoría</TableHead>
                            <TableHead>Duración</TableHead>
                            <TableHead>URL</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {videos && videos.length > 0 ? (
                            videos.map((video) => (
                                <TableRow key={video.id}>
                                    <TableCell className="font-medium">{video.title}</TableCell>
                                    <TableCell>{video.category}</TableCell>
                                    <TableCell>{video.duration || '-'}</TableCell>
                                    <TableCell>
                                        <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                            Link <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </TableCell>
                                    <TableCell className="text-right flex items-center justify-end gap-1">
                                        <Button asChild variant="ghost" size="sm">
                                            <Link href={`/admin/videos/${video.id}/edit`}>
                                                <Pencil className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <ConfirmDelete
                                            action={deleteVideo.bind(null, video.id)}
                                            itemName={video.title}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <p className="text-muted-foreground mb-2">No hay videos registrados.</p>
                                    <Button asChild variant="outline" size="sm">
                                        <Link href="/admin/videos/new">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Agregar primer video
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
