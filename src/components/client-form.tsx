"use client"

import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface ClientFormProps {
    action: (formData: FormData) => Promise<{ success: boolean; message: string } | undefined>
    children: React.ReactNode
    className?: string
    redirectPath?: string
}

export function ClientForm({ action, children, className, redirectPath }: ClientFormProps) {
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        const result = await action(formData)

        if (result?.success) {
            toast.success(result.message)
            if (redirectPath) {
                router.push(redirectPath)
            }
        } else if (result?.success === false) {
            toast.error(result.message)
        }
    }

    return (
        <form action={handleSubmit} className={className}>
            {children}
        </form>
    )
}
