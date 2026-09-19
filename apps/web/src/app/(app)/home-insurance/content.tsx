'use cache'

import type { Locale } from '@scaffold/i18n'
import { getTranslations } from '@scaffold/i18n/server'
import { EmptyState } from '@scaffold/ui/layouts/empty-state'
import { PageContainer } from '@scaffold/ui/layouts/page-container'
import { HouseIcon } from 'lucide-react'

export async function HomeInsurancePageContent({ locale }: HomeInsurancePageContentProps) {
    const t = await getTranslations({ locale, namespace: 'homeInsurance' })
    return (
        <PageContainer className="items-center justify-center">
            <EmptyState icon={HouseIcon} title={t('title')} description={t('description')} />
        </PageContainer>
    )
}

interface HomeInsurancePageContentProps {
    /** Cached content cannot read the language cookie, so the page passes the language in. */
    locale: Locale
}
