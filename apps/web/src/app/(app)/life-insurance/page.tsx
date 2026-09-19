import { getLocale, getTranslations } from '@scaffold/i18n/server'
import type { Metadata } from 'next'
import { pageTitle } from '@/lib/brand'
import { LifeInsurancePageContent } from './content'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('lifeInsurance')
    return { title: pageTitle(t('metadataTitle')) }
}

/** Placeholder: nothing to load yet, so there is no Suspense boundary; add one with the first query (see the home page). */
export default async function LifeInsurancePage() {
    const locale = await getLocale()
    return <LifeInsurancePageContent locale={locale} />
}
