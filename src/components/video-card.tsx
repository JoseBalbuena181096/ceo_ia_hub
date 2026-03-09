'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Maximize2, Minimize2, Music, Heart, Clock } from "lucide-react"
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
                className="group overflow-hidden border-border/60 hover:border-viad-blue/30 hover:shadow-lg hover:shadow-viad-blue/5 transition-all duration-300 cursor-pointer"
                onClick={() => setOpen(true)}
            >
                {/* Thumbnail first for visual impact */}
                <CardContent className="p-0">
                    <div className="aspect-video w-full bg-viad-navy relative overflow-hidden">
                        {info?.thumbnailUrl ? (
                            <img
                                src={info.thumbnailUrl}
                                alt={title}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-viad-navy via-viad-navy-light to-viad-purple/40 flex flex-col items-center justify-center gap-3 px-5 py-4">
                                <div className="flex items-center gap-2">
                                    <Music className="h-5 w-5 text-viad-salmon" />
                                    <span className="text-white/80 font-heading font-bold text-sm tracking-wide">
                                        {info?.platform || 'Video'}
                                    </span>
                                </div>
                                <p className="text-white/70 text-sm font-medium text-center line-clamp-3 leading-snug">
                                    {title}
                                </p>
                            </div>
                        )}
                        {/* Play overlay */}
                        <div className="absolute inset-0 bg-viad-navy/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <div className="bg-white rounded-full p-3.5 shadow-xl shadow-black/20 scale-90 group-hover:scale-100 transition-transform duration-300">
                                <Play className="h-5 w-5 text-viad-navy fill-viad-navy ml-0.5" />
                            </div>
                        </div>
                        {/* Duration pill */}
                        {duration && (
                            <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-0.5 rounded-md flex items-center gap-1">
                                <Clock className="h-2.5 w-2.5" />
                                {duration}
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardHeader className="p-4 pt-3 pb-4">
                    <div className="flex justify-between items-start gap-2">
                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-medium border-viad-blue/20 text-viad-navy/60 dark:text-viad-blue/60 px-2 py-0.5 shrink-0">
                            {category}
                        </Badge>
                        {videoId && (
                            <button
                                onClick={handleFavorite}
                                disabled={favLoading}
                                className="p-1 rounded-lg hover:bg-muted transition-all duration-200 disabled:opacity-50"
                                aria-label={favorited ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                            >
                                <Heart className={cn(
                                    "h-4 w-4 transition-all duration-300",
                                    favorited
                                        ? "fill-viad-orange text-viad-orange scale-110"
                                        : "text-muted-foreground/50 group-hover:text-muted-foreground"
                                )} />
                            </button>
                        )}
                    </div>
                    <CardTitle className="text-sm font-heading font-bold line-clamp-2 leading-snug mt-1">{title}</CardTitle>
                </CardHeader>
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
                    <DialogHeader className="p-4 pb-2 shrink-0 border-b border-border/40">
                        <div className="flex items-center gap-2 pr-16">
                            <DialogTitle className="flex-1 font-heading text-base">{title}</DialogTitle>
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
                            <div className="flex items-center justify-center h-full bg-viad-navy text-white p-4 text-center flex-col gap-3">
                                <p className="text-white/70">Formato no soportado para preview.</p>
                                <a href={url} target="_blank" rel="noopener noreferrer" className="text-viad-blue hover:text-viad-blue/80 underline underline-offset-4 transition-colors">
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
