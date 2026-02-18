import { Skeleton } from '@/components/ui/skeleton'

export default function LearningLoading() {
    return (
        <div className="container py-8 md:py-12 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <Skeleton className="h-9 w-48 mb-2" />
                    <Skeleton className="h-5 w-80" />
                </div>
                <Skeleton className="h-10 w-[300px]" />
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-7 w-20 rounded-full" />
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="rounded-lg border overflow-hidden">
                        <div className="p-4 space-y-2">
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-5 w-3/4" />
                        </div>
                        <Skeleton className="aspect-video w-full" />
                    </div>
                ))}
            </div>
        </div>
    )
}
