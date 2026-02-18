'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface VideoCardProps {
    title: string
    url: string
    category: string
    duration?: string | null
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

export function VideoCard({ title, url, category, duration }: VideoCardProps) {
    const [open, setOpen] = useState(false)
    const info = getVideoInfo(url)

    return (
        <>
            <Card
                className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
                onClick={() => setOpen(true)}
            >
                <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                        <Badge variant="secondary" className="mb-2">{category}</Badge>
                        {duration && <span className="text-xs text-muted-foreground">{duration}</span>}
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
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
                                <span className="text-white/80 text-sm font-medium">
                                    {info?.platform || 'Video'}
                                </span>
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

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-3xl p-0 overflow-hidden">
                    <DialogHeader className="p-4 pb-0">
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>
                    <div className="aspect-video w-full">
                        {info?.embedUrl ? (
                            <iframe
                                src={info.embedUrl}
                                className="w-full h-full"
                                allowFullScreen
                                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full bg-gray-900 text-white p-4 text-center flex-col gap-2">
                                <p>Formato no soportado para preview.</p>
                                <a href={url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline">
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
