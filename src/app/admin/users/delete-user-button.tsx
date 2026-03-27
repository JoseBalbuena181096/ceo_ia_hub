'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Trash2, Loader2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface DeleteUserButtonProps {
    action: (formData: FormData) => Promise<{ success: boolean; message: string } | undefined>
    userName: string
}

export function DeleteUserButton({ action, userName }: DeleteUserButtonProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleDelete() {
        setLoading(true)
        try {
            const formData = new FormData()
            const result = await action(formData)
            if (result?.success) {
                toast.success(result.message)
            } else if (result?.success === false) {
                toast.error(result.message)
            }
        } catch {
            toast.error('Error inesperado al eliminar')
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        Eliminar usuario permanentemente
                    </AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="space-y-2">
                            <p>
                                Estás a punto de eliminar a <strong>{userName}</strong>. Esta acción
                                eliminará permanentemente:
                            </p>
                            <ul className="list-disc pl-5 text-sm space-y-1">
                                <li>Su perfil y cuenta de acceso</li>
                                <li>Todas sus conversaciones y mensajes</li>
                                <li>Todos sus favoritos guardados</li>
                            </ul>
                            <p className="font-semibold text-red-600">
                                Esta acción no se puede deshacer.
                            </p>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                    >
                        {loading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Eliminando...</>
                        ) : (
                            'Sí, eliminar usuario'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
