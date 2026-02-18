import { Skeleton } from '@/components/ui/skeleton'

export default function AdminLoading() {
    return (
        <div className="space-y-6 p-8 pt-6">
            <div>
                <Skeleton className="h-9 w-56 mb-2" />
                <Skeleton className="h-5 w-96" />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="rounded-lg border p-6 space-y-2">
                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-4" />
                        </div>
                        <Skeleton className="h-8 w-12" />
                    </div>
                ))}
            </div>
        </div>
    )
}
