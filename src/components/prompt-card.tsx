'use client'

import { useState } from "react"
import { toast } from "sonner"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, Check, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { toggleFavorite } from "@/app/profile/actions"

interface PromptCardProps {
    title: string
    description?: string | null
    content: string
    category: string
    tags?: string[] | null
    promptId?: string
    isFavorited?: boolean
}

export function PromptCard({ title, description, content, category, tags, promptId, isFavorited = false }: PromptCardProps) {
    const [copied, setCopied] = useState(false)
    const [favorited, setFavorited] = useState(isFavorited)
    const [favLoading, setFavLoading] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(content)
        setCopied(true)
        toast.success('Prompt copiado al portapapeles')
        setTimeout(() => setCopied(false), 2000)
    }

    const handleFavorite = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!promptId || favLoading) return
        setFavLoading(true)
        const result = await toggleFavorite('prompt', promptId)
        if (result.success) {
            setFavorited(result.favorited)
            toast.success(result.message)
        } else {
            toast.error(result.message)
        }
        setFavLoading(false)
    }

    return (
        <Card className="group flex flex-col h-full overflow-hidden border-border/60 hover:border-viad-blue/30 hover:shadow-lg hover:shadow-viad-blue/5 transition-all duration-300 accent-border-left">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-base font-heading font-bold leading-tight tracking-tight">{title}</CardTitle>
                    <div className="flex items-center gap-1.5 shrink-0">
                        {promptId && (
                            <button
                                onClick={handleFavorite}
                                disabled={favLoading}
                                className="p-1.5 rounded-lg hover:bg-muted transition-all duration-200 disabled:opacity-50"
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
                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-medium border-viad-blue/20 text-viad-navy/60 dark:text-viad-blue/60 px-2 py-0.5">
                            {category}
                        </Badge>
                    </div>
                </div>
                {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {tags.map(tag => (
                            <span key={tag} className="text-[10px] text-muted-foreground/70 bg-muted/60 px-2 py-0.5 rounded-full">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
                {description && (
                    <p className="text-sm text-muted-foreground leading-relaxed text-justify break-words overflow-hidden">{description}</p>
                )}
                <div className="relative bg-viad-navy/[0.03] dark:bg-white/[0.04] border border-border/40 p-3.5 rounded-lg text-[13px] font-mono whitespace-pre-wrap max-h-[200px] overflow-y-auto leading-relaxed">
                    {content}
                </div>
            </CardContent>
            <CardFooter className="pt-0 pb-4">
                <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                        "w-full transition-all duration-300 font-medium text-xs tracking-wide",
                        copied
                            ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400"
                            : "hover:bg-viad-navy hover:text-white hover:border-viad-navy dark:hover:bg-viad-blue dark:hover:text-viad-navy dark:hover:border-viad-blue"
                    )}
                    onClick={handleCopy}
                >
                    {copied ? (
                        <>
                            <Check className="mr-2 h-3.5 w-3.5" />
                            Copiado
                        </>
                    ) : (
                        <>
                            <Copy className="mr-2 h-3.5 w-3.5" />
                            Copiar Prompt
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}
