import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface VideoCardProps {
    title: string
    url: string
    category: string
    duration?: string | null
}

export function VideoCard({ title, url, category, duration }: VideoCardProps) {
    const getEmbedUrl = (url: string) => {
        try {
            if (url.includes('youtube.com') || url.includes('youtu.be')) {
                const videoId = url.includes('v=') ? url.split('v=')[1]?.split('&')[0] : url.split('/').pop();
                return `https://www.youtube.com/embed/${videoId}`;
            } else if (url.includes('tiktok.com')) {
                // Extract video ID from TikTok URL
                // Format: https://www.tiktok.com/@user/video/723...
                const parts = url.split('/video/');
                if (parts.length > 1) {
                    const videoId = parts[1].split('?')[0];
                    return `https://www.tiktok.com/embed/v2/${videoId}`;
                }
            }
        } catch (e) {
            console.error("Error parsing video URL", e);
        }
        return null;
    }

    const embedUrl = getEmbedUrl(url);

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-200">
            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                    <Badge variant="secondary" className="mb-2">{category}</Badge>
                    {duration && <span className="text-xs text-muted-foreground">{duration}</span>}
                </div>
                <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="aspect-[9/16] w-full bg-black relative">
                    {embedUrl ? (
                        <iframe
                            src={embedUrl}
                            className="absolute inset-0 w-full h-full"
                            allowFullScreen
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-white p-4 text-center">
                            <p>Video no disponible o formato no soportado.</p>
                            <a href={url} target="_blank" className="text-blue-400 underline block mt-2">Ver original</a>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
