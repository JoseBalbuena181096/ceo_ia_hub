import { createClient } from '@/lib/supabase/server'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { toggleBlockUser } from './actions'
import { ToggleBlockButton } from './toggle-block-button'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
    const supabase = await createClient()
    const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
                <p className="text-muted-foreground">Administra el acceso de los usuarios registrados.</p>
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
                                        <Badge variant={user.is_blocked ? 'destructive' : 'outline'}>
                                            {user.is_blocked ? 'Bloqueado' : 'Activo'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {!user.is_admin && (
                                            <ToggleBlockButton
                                                action={toggleBlockUser.bind(null, user.id)}
                                                isBlocked={user.is_blocked}
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
