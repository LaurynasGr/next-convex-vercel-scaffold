import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server'
import { api } from '@scaffold/core'
import type { Locale } from '@scaffold/i18n'
import { getLocale, getTranslations } from '@scaffold/i18n/server'
import { preloadQuery } from 'convex/nextjs'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { pageTitle } from '@/lib/brand'
import { HomePageContent } from './content'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('home')
    return { title: pageTitle(t('metadataTitle')) }
}

async function SuspendedHomePage({ locale }: SuspendedPageProps) {
    const token = await convexAuthNextjsToken()
    const preloadedViewer = await preloadQuery(api.users.viewer, {}, { token })
    return <HomePageContent preloadedViewer={preloadedViewer} locale={locale} />
}

interface SuspendedPageProps {
    locale: Locale
}

export default async function HomePage() {
    const locale = await getLocale()
    return (
        <Suspense fallback={<HomePageContent preloadedViewer={null} locale={locale} />}>
            <SuspendedHomePage locale={locale} />
        </Suspense>
    )
}
