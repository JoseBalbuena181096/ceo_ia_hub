'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { ShieldBan, ShieldCheck, Loader2 } from 'lucide-react'
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

interface ToggleBlockButtonProps {
    action: (formData: FormData) => Promise<{ success: boolean; message: string } | undefined>
    isBlocked: boolean
    userName: string
}

export function ToggleBlockButton({ action, isBlocked, userName }: ToggleBlockButtonProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleToggle() {
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
            toast.error('Error inesperado')
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant={isBlocked ? 'outline' : 'ghost'}
                    size="sm"
                    className={isBlocked ? 'text-green-600 hover:text-green-700' : 'text-red-600 hover:text-red-700'}
                >
                    {isBlocked ? (
                        <><ShieldCheck className="mr-1 h-4 w-4" /> Desbloquear</>
                    ) : (
                        <><ShieldBan className="mr-1 h-4 w-4" /> Bloquear</>
                    )}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {isBlocked ? 'Desbloquear usuario' : 'Bloquear usuario'}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {isBlocked
                            ? <><strong>{userName}</strong> podrá acceder nuevamente a la plataforma.</>
                            : <><strong>{userName}</strong> no podrá acceder a la plataforma mientras esté bloqueado.</>
                        }
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleToggle}
                        disabled={loading}
                        className={isBlocked ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                    >
                        {loading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</>
                        ) : (
                            isBlocked ? 'Desbloquear' : 'Bloquear'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
