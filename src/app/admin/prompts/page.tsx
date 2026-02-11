import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { deletePrompt } from '@/app/admin/actions'
import { Plus, Trash2 } from 'lucide-react'
import { ClientForm } from '@/components/client-form'

export const dynamic = 'force-dynamic'

export default async function AdminPromptsPage() {
    const supabase = createClient()
    const { data: prompts } = await (await supabase)
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Gestión de Prompts</h1>
                <Button asChild>
                    <Link href="/admin/prompts/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Prompt
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Título</TableHead>
                            <TableHead>Categoría</TableHead>
                            <TableHead>Tags</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {prompts && prompts.length > 0 ? (
                            prompts.map((prompt) => (
                                <TableRow key={prompt.id}>
                                    <TableCell className="font-medium">{prompt.title}</TableCell>
                                    <TableCell>{prompt.category}</TableCell>
                                    <TableCell>{prompt.tags?.join(', ')}</TableCell>
                                    <TableCell className="text-right">
                                        <ClientForm action={deletePrompt.bind(null, prompt.id)}>
                                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </ClientForm>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No hay prompts registrados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
