import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck } from 'lucide-react'
import { toggleBlockUser, updateUser, deleteUser } from './actions'
import { ToggleBlockButton } from './toggle-block-button'
import { DeleteUserButton } from './delete-user-button'
import { EditUserDialog } from './edit-user-dialog'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
    const supabase = await createClient()
    const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true })

    // Fetch auth users to get emails
    const adminClient = createAdminClient()
    const { data: authData } = await adminClient.auth.admin.listUsers()
    const emailMap = new Map<string, string>()
    authData?.users?.forEach(u => {
        if (u.email) emailMap.set(u.id, u.email)
    })

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
                    <p className="text-2xl font-bold text-viad-orange">{blockedCount}</p>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Correo</TableHead>
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
                                    <TableCell className="text-sm text-muted-foreground">
                                        {emailMap.get(user.id) || '-'}
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
                                        <div className="inline-flex items-center gap-1">
                                            <EditUserDialog
                                                action={updateUser.bind(null, user.id)}
                                                user={{
                                                    id: user.id,
                                                    full_name: user.full_name,
                                                    department: user.department,
                                                    is_admin: user.is_admin,
                                                }}
                                            />
                                            {!user.is_admin && (
                                                <>
                                                    <ToggleBlockButton
                                                        action={toggleBlockUser.bind(null, user.id)}
                                                        isBlocked={user.is_blocked ?? false}
                                                        userName={user.full_name || 'este usuario'}
                                                    />
                                                    <DeleteUserButton
                                                        action={deleteUser.bind(null, user.id)}
                                                        userName={user.full_name || 'este usuario'}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
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
