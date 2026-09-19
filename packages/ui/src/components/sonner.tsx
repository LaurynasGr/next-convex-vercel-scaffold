'use client'

import { cn } from '@scaffold/ui/lib/utils'
import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from 'lucide-react'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

/**
 * Sonner's toaster with lucide icons and Sonner's own rich colours per kind. Pass the active `theme` from the app's
 * theme provider; mount once near the root and fire messages with `toast` from 'sonner'.
 */
function Toaster({ className, ...props }: ToasterProps) {
    return (
        <Sonner
            richColors
            className={cn('toaster group', className)}
            icons={{
                success: <CircleCheckIcon className="size-4" />,
                info: <InfoIcon className="size-4" />,
                warning: <TriangleAlertIcon className="size-4" />,
                error: <OctagonXIcon className="size-4" />,
                loading: <Loader2Icon className="size-4 animate-spin" />,
            }}
            {...props}
        />
    )
}

export { Toaster }
