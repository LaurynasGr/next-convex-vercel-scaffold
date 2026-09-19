import { getLocale, getTranslations } from '@scaffold/i18n/server'
import type { Metadata } from 'next'
import { pageTitle } from '@/lib/brand'
import { HomeInsurancePageContent } from './content'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('homeInsurance')
    return { title: pageTitle(t('metadataTitle')) }
}

/** Placeholder: nothing to load yet, so there is no Suspense boundary; add one with the first query (see the home page). */
export default async function HomeInsurancePage() {
    const locale = await getLocale()
    return <HomeInsurancePageContent locale={locale} />
}
