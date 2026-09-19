import { cn } from '@scaffold/ui/lib/utils'
import type { ComponentProps } from 'react'

/** Centered, padded column that every page's content sits in; the app's main area itself is edge to edge. */
export function PageContainer({ className, ...props }: PageContainerProps) {
    return <div className={cn('flex flex-col gap-4 flex-1 mx-auto w-full max-w-[1600px] p-4', className)} {...props} />
}

export type PageContainerProps = ComponentProps<'div'>
