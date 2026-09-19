import { cn } from '@scaffold/ui/lib/utils'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

/** Centered card with an icon, a title, a line of copy and whatever comes next (actions, a feature list). */
export function EmptyState({ icon: Icon, title, description, children, className }: EmptyStateProps) {
    return (
        <div className={cn('mx-auto max-w-md text-center p-4 space-y-2', className)}>
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="size-7" />
            </div>
            <div>
                <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
                {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
            </div>
            {children}
        </div>
    )
}

export interface EmptyStateProps {
    icon: LucideIcon
    title: ReactNode
    description?: ReactNode
    children?: ReactNode
    className?: string
}
