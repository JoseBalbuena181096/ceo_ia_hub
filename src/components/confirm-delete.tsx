'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Trash2, Loader2 } from 'lucide-react'
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

interface ConfirmDeleteProps {
    action: (formData: FormData) => Promise<{ success: boolean; message: string } | undefined>
    itemName?: string
}

export function ConfirmDelete({ action, itemName }: ConfirmDeleteProps) {
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
                    <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
                    <AlertDialogDescription>
                        {itemName
                            ? <>Estás a punto de eliminar <strong>&quot;{itemName}&quot;</strong>. Esta acción no se puede deshacer.</>
                            : 'Esta acción no se puede deshacer. El elemento será eliminado permanentemente.'
                        }
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
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Eliminando...
                            </>
                        ) : (
                            'Eliminar'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
