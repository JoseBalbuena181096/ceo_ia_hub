'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Maximize2, Minimize2, Music, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { toggleFavorite } from "@/app/profile/actions"

interface VideoCardProps {
    title: string
    url: string
    category: string
    duration?: string | null
    videoId?: string
    isFavorited?: boolean
}

function getVideoInfo(url: string) {
    try {
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const videoId = url.includes('v=')
                ? url.split('v=')[1]?.split('&')[0]
                : url.split('/').pop()?.split('?')[0]
            return {
                embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1`,
                thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                platform: 'YouTube' as const,
            }
        } else if (url.includes('tiktok.com')) {
            const parts = url.split('/video/')
            if (parts.length > 1) {
                const videoId = parts[1].split('?')[0]
                return {
                    embedUrl: `https://www.tiktok.com/embed/v2/${videoId}`,
                    thumbnailUrl: null,
                    platform: 'TikTok' as const,
                }
            }
        }
    } catch (e) {
        console.error("Error parsing video URL", e)
    }
    return null
}

export function VideoCard({ title, url, category, duration, videoId, isFavorited = false }: VideoCardProps) {
    const [open, setOpen] = useState(false)
    const [expanded, setExpanded] = useState(false)
    const [favorited, setFavorited] = useState(isFavorited)
    const [favLoading, setFavLoading] = useState(false)
    const info = getVideoInfo(url)
    const isTikTok = info?.platform === 'TikTok'

    const handleFavorite = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!videoId || favLoading) return
        setFavLoading(true)
        const result = await toggleFavorite('video', videoId)
        if (result.success) {
            setFavorited(result.favorited)
            toast.success(result.message)
        } else {
            toast.error(result.message)
        }
        setFavLoading(false)
    }

    return (
        <>
            <Card
                className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
                onClick={() => setOpen(true)}
            >
                <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                        <Badge variant="secondary" className="mb-2">{category}</Badge>
                        <div className="flex items-center gap-2">
                            {duration && <span className="text-xs text-muted-foreground">{duration}</span>}
                            {videoId && (
                                <button
                                    onClick={handleFavorite}
                                    disabled={favLoading}
                                    className="p-1 rounded-md hover:bg-muted transition-colors disabled:opacity-50"
                                    aria-label={favorited ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                                >
                                    <Heart className={cn("h-4 w-4 transition-colors", favorited ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
                                </button>
                            )}
                        </div>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="aspect-video w-full bg-gray-900 relative overflow-hidden">
                        {info?.thumbnailUrl ? (
                            <img
                                src={info.thumbnailUrl}
                                alt={title}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center gap-3 px-5 py-4">
                                <div className="flex items-center gap-2">
                                    <Music className="h-5 w-5 text-[#ff0050]" />
                                    <span className="text-white font-semibold text-sm">
                                        {info?.platform || 'Video'}
                                    </span>
                                </div>
                                <p className="text-white text-base font-medium text-center line-clamp-3 leading-snug">
                                    {title}
                                </p>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-white/90 rounded-full p-3">
                                <Play className="h-6 w-6 text-gray-900 fill-gray-900" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setExpanded(false) }}>
                <DialogContent
                    className={
                        isTikTok
                            ? expanded
                                ? "max-w-[95vw] h-[95vh] max-h-[95vh] p-0 overflow-hidden flex flex-col"
                                : "max-w-sm sm:max-w-md p-0 overflow-hidden flex flex-col"
                            : expanded
                                ? "max-w-[95vw] h-[95vh] max-h-[95vh] p-0 overflow-hidden flex flex-col"
                                : "max-w-3xl p-0 overflow-hidden flex flex-col"
                    }
                >
                    <DialogHeader className="p-4 pb-2 shrink-0">
                        <div className="flex items-center gap-2 pr-16">
                            <DialogTitle className="flex-1">{title}</DialogTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 shrink-0"
                                onClick={() => setExpanded(!expanded)}
                            >
                                {expanded
                                    ? <Minimize2 className="h-4 w-4" />
                                    : <Maximize2 className="h-4 w-4" />
                                }
                                <span className="sr-only">
                                    {expanded ? 'Reducir' : 'Expandir'}
                                </span>
                            </Button>
                        </div>
                    </DialogHeader>
                    <div className={
                        isTikTok
                            ? expanded
                                ? "flex-1 min-h-0"
                                : "w-full aspect-[9/16] max-h-[70vh]"
                            : expanded
                                ? "flex-1 min-h-0"
                                : "aspect-video w-full"
                    }>
                        {info?.embedUrl ? (
                            <iframe
                                src={info.embedUrl}
                                className="w-full h-full border-0"
                                allowFullScreen
                                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full bg-gray-900 text-white p-4 text-center flex-col gap-2">
                                <p>Formato no soportado para preview.</p>
                                <a href={url} target="_blank" rel="noopener noreferrer" className="text-uo-sky underline">
                                    Abrir video original
                                </a>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
