import { getTranslations } from '@scaffold/i18n/server'
import { EmptyState } from '@scaffold/ui/layouts/empty-state'
import { SearchXIcon } from 'lucide-react'
import type { ReactNode } from 'react'

/** Vertically centered "nothing here" message; the route-level 404 and per-entity misses (an unknown id) both use it. */
export async function NotFoundContent({ children, title, description }: NotFoundContentProps) {
    const t = await getTranslations('global.notFound')
    return (
        <div className="flex flex-1 flex-col items-center justify-center">
            <EmptyState icon={SearchXIcon} title={title ?? t('title')} description={description ?? t('description')}>
                {children}
            </EmptyState>
        </div>
    )
}

interface NotFoundContentProps {
    title?: ReactNode
    description?: ReactNode
    /** Actions, e.g. a link back to the list. */
    children?: ReactNode
}
