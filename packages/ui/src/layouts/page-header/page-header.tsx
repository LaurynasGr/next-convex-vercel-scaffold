import { cn } from '@scaffold/ui/lib/utils'
import type { ReactNode } from 'react'

/** Title row at the top of a page: heading and description on the left, primary actions on the right. */
export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
    return (
        <div className={cn('flex flex-wrap items-start justify-between gap-4', className)}>
            <div>
                <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
                {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
    )
}

export interface PageHeaderProps {
    title: ReactNode
    description?: ReactNode
    actions?: ReactNode
    className?: string
}
