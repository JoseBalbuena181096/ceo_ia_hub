'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Pencil, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'

interface EditUserDialogProps {
    action: (formData: FormData) => Promise<{ success: boolean; message: string } | undefined>
    user: {
        id: string
        full_name: string | null
        department: string | null
    }
}

export function EditUserDialog({ action, user }: EditUserDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        try {
            const formData = new FormData(e.currentTarget)
            const result = await action(formData)
            if (result?.success) {
                toast.success(result.message)
                setOpen(false)
            } else if (result?.success === false) {
                toast.error(result.message)
            }
        } catch {
            toast.error('Error inesperado')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-viad-navy hover:text-viad-navy/80 hover:bg-blue-50">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Editar usuario</DialogTitle>
                    <DialogDescription>
                        Modifica los datos del perfil de {user.full_name || 'este usuario'}.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="full_name">Nombre completo</Label>
                        <Input
                            id="full_name"
                            name="full_name"
                            defaultValue={user.full_name ?? ''}
                            placeholder="Nombre del usuario"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="department">Departamento</Label>
                        <Input
                            id="department"
                            name="department"
                            defaultValue={user.department ?? ''}
                            placeholder="Departamento"
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</>
                            ) : (
                                'Guardar cambios'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
