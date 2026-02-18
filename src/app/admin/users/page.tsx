import { createClient } from '@/lib/supabase/server'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck } from 'lucide-react'
import { toggleBlockUser } from './actions'
import { ToggleBlockButton } from './toggle-block-button'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
    const supabase = await createClient()
    const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true })

    const totalUsers = users?.length ?? 0
    const blockedCount = users?.filter(u => u.is_blocked ?? false).length ?? 0
    const adminCount = users?.filter(u => u.is_admin).length ?? 0

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
                <p className="text-muted-foreground">Administra el acceso de los usuarios registrados.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Total usuarios</p>
                    <p className="text-2xl font-bold">{totalUsers}</p>
                </div>
                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Administradores</p>
                    <p className="text-2xl font-bold">{adminCount}</p>
                </div>
                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Bloqueados</p>
                    <p className="text-2xl font-bold text-uo-red">{blockedCount}</p>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Departamento</TableHead>
                            <TableHead>Rol</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users && users.length > 0 ? (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        {user.full_name || 'Sin nombre'}
                                    </TableCell>
                                    <TableCell>{user.department || '-'}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.is_admin ? 'default' : 'secondary'}>
                                            {user.is_admin ? 'Admin' : 'Usuario'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={(user.is_blocked ?? false) ? 'destructive' : 'outline'}>
                                            {(user.is_blocked ?? false) ? 'Bloqueado' : 'Activo'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {user.is_admin ? (
                                            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                                <ShieldCheck className="h-3.5 w-3.5" />
                                                Protegido
                                            </span>
                                        ) : (
                                            <ToggleBlockButton
                                                action={toggleBlockUser.bind(null, user.id)}
                                                isBlocked={user.is_blocked ?? false}
                                                userName={user.full_name || 'este usuario'}
                                            />
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No hay usuarios registrados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
