import { getTranslations } from '@scaffold/i18n/server'
import { PageContainer } from '@scaffold/ui/layouts/page-container'
import type { Metadata } from 'next'
import { AppHeader } from '@/components/app-header/app-header'
import { pageTitle } from '@/lib/brand'
import { SignInContent } from './content'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('auth')
    return { title: pageTitle(t('metadataTitle')) }
}

export default function LoginPage() {
    return (
        <>
            <AppHeader />
            <main className="flex min-h-[calc(100svh-var(--header-height))] flex-col">
                <PageContainer className="items-center justify-center">
                    <SignInContent />
                </PageContainer>
            </main>
        </>
    )
}
