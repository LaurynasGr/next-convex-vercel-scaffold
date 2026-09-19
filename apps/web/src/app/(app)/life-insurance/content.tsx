'use cache'

import type { Locale } from '@scaffold/i18n'
import { getTranslations } from '@scaffold/i18n/server'
import { EmptyState } from '@scaffold/ui/layouts/empty-state'
import { PageContainer } from '@scaffold/ui/layouts/page-container'
import { HeartPulseIcon } from 'lucide-react'

export async function LifeInsurancePageContent({ locale }: LifeInsurancePageContentProps) {
    const t = await getTranslations({ locale, namespace: 'lifeInsurance' })
    return (
        <PageContainer className="items-center justify-center">
            <EmptyState icon={HeartPulseIcon} title={t('title')} description={t('description')} />
        </PageContainer>
    )
}

interface LifeInsurancePageContentProps {
    /** Cached content cannot read the language cookie, so the page passes the language in. */
    locale: Locale
}
