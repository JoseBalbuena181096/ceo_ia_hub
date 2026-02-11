'use client'

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface PromptCardProps {
    title: string
    content: string
    category: string
    tags?: string[] | null
}

export function PromptCard({ title, content, category, tags }: PromptCardProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg font-semibold leading-tight">{title}</CardTitle>
                    <Badge variant="outline" className="shrink-0">{category}</Badge>
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
            <CardContent className="flex-1">
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
