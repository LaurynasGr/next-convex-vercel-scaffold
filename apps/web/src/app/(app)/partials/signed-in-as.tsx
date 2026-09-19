'use client'

import type { api } from '@scaffold/core'
import { useOptionalPreloadedQuery } from '@scaffold/core/hooks'
import { useTranslations } from '@scaffold/i18n'
import { Skeleton } from '@scaffold/ui/components/skeleton'
import type { Preloaded } from 'convex/react'

/** Who is signed in; a skeleton line of the same height while the viewer is still preloading (null). */
export function SignedInAs({ preloadedViewer }: SignedInAsProps) {
    const t = useTranslations('home')
    const viewer = useOptionalPreloadedQuery(preloadedViewer)

    if (preloadedViewer === null) return <Skeleton className="mx-auto h-5 w-56" />
    if (!viewer) return null
    return (
        <p className="text-sm text-muted-foreground">
            {t.rich('signedInAs', { user: viewer.email ?? viewer.name ?? viewer._id })}
        </p>
    )
}

interface SignedInAsProps {
    /** null while the page's Suspense fallback is showing. */
    preloadedViewer: Preloaded<typeof api.users.viewer> | null
}
