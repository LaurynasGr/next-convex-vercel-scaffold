'use cache'

import type { api } from '@scaffold/core'
import type { Locale } from '@scaffold/i18n'
import { getTranslations } from '@scaffold/i18n/server'
import { EmptyState } from '@scaffold/ui/layouts/empty-state'
import { PageContainer } from '@scaffold/ui/layouts/page-container'
import type { Preloaded } from 'convex/react'
import { LayersIcon } from 'lucide-react'
import { SignedInAs } from './partials/signed-in-as'

/** The whole page for a given viewer, or its skeleton state for `null`; cached per distinct props. */
export async function HomePageContent({ preloadedViewer, locale }: HomePageContentProps) {
    const t = await getTranslations({ locale, namespace: 'home' })
    return (
        <PageContainer className="items-center justify-center">
            <EmptyState icon={LayersIcon} title={t('title')} description={t('description')}>
                <SignedInAs preloadedViewer={preloadedViewer} />
            </EmptyState>
        </PageContainer>
    )
}

interface HomePageContentProps {
    /** null while the viewer is still loading. */
    preloadedViewer: Preloaded<typeof api.users.viewer> | null
    /** Cached content cannot read the language cookie, so the page passes the language in. */
    locale: Locale
}
