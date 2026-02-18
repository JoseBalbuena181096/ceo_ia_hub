'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SubmitButtonProps {
    children: React.ReactNode
    className?: string
    loadingText?: string
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    formAction?: (formData: FormData) => void
}

export function SubmitButton({ children, className, loadingText = 'Procesando...', variant = 'default', formAction }: SubmitButtonProps) {
    const { pending } = useFormStatus()

    return (
        <Button
            type="submit"
            disabled={pending}
            variant={variant}
            className={cn(className)}
            formAction={formAction}
        >
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {loadingText}
                </>
            ) : (
                children
            )}
        </Button>
    )
}
