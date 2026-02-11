export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Trash2 } from 'lucide-react'
import { createCategory, deleteCategory } from '@/app/admin/categories/actions'
import { ClientForm } from '@/components/client-form'

export default async function CategoriesPage() {
    const supabase = await createClient()
    const { data: categories } = await supabase
        .from('prompt_categories')
        .select('*')
        .order('name', { ascending: true })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Gestión de Categorías</h1>
                <p className="text-muted-foreground">Administra las categorías disponibles para clasificación.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Agregar Categoría</CardTitle>
                        <CardDescription>Crea una nueva categoría para los prompts.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ClientForm action={createCategory} className="flex gap-2 items-end">
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="name">Nombre</Label>
                                <Input name="name" id="name" placeholder="Ej. Innovación" required />
                            </div>
                            <Button type="submit">Agregar</Button>
                        </ClientForm>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Categorías Existentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead className="w-[100px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories?.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell className="font-medium">{category.name}</TableCell>
                                        <TableCell>
                                            <ClientForm action={deleteCategory.bind(null, category.id)}>
                                                <Button variant="ghost" size="icon" className="text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </ClientForm>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
