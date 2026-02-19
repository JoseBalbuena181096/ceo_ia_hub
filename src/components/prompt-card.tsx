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
        <Card className="flex flex-col h-full hover:shadow-md transition-shadow overflow-hidden">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg font-semibold leading-tight">{title}</CardTitle>
                    <div className="flex items-center gap-1 shrink-0">
                        {promptId && (
                            <button
                                onClick={handleFavorite}
                                disabled={favLoading}
                                className="p-1 rounded-md hover:bg-muted transition-colors disabled:opacity-50"
                                aria-label={favorited ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                            >
                                <Heart className={cn("h-4 w-4 transition-colors", favorited ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
                            </button>
                        )}
                        <Badge variant="outline">{category}</Badge>
                    </div>
                </div>
                {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {tags.map(tag => (
                            <span key={tag} className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
                {description && (
                    <p className="text-sm text-muted-foreground text-justify break-words overflow-hidden">{description}</p>
                )}
                <div className="bg-muted/50 p-3 rounded-md text-sm font-mono whitespace-pre-wrap max-h-[200px] overflow-y-auto relative group">
                    {content}
                </div>
            </CardContent>
            <CardFooter className="pt-0">
                <Button
                    variant="outline"
                    size="sm"
                    className={cn("w-full transition-all", copied && "bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-800")}
                    onClick={handleCopy}
                >
                    {copied ? (
                        <>
                            <Check className="mr-2 h-4 w-4 text-green-600 dark:text-green-400" />
                            <span className="text-green-600 dark:text-green-400">Copiado</span>
                        </>
                    ) : (
                        <>
                            <Copy className="mr-2 h-4 w-4" />
                            Copiar Prompt
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}
