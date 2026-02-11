import { createClient } from '@/lib/supabase/server'
import { VideoCard } from '@/components/video-card'

export const dynamic = 'force-dynamic'

export default async function LearningPage() {
    const supabase = createClient()

    const { data: videos, error } = await (await supabase)
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="container py-8 md:py-12 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Micro-learning</h1>
                    <p className="text-muted-foreground">
                        Hacks de IA y tutoriales rápidos en formato vertical.
                    </p>
                </div>
            </div>

            <div className="my-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {videos && videos.length > 0 ? (
                    videos.map((video) => (
                        <VideoCard
                            key={video.id}
                            title={video.title}
                            url={video.url}
                            category={video.category}
                            duration={video.duration}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        <p>No hay videos disponibles aún.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
