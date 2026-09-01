import type { Metadata } from 'next'
import { AppHeader } from '@/components/app-header/app-header'
import { APP_NAME } from '@/lib/brand'
import { SignInContent } from './content'

export const metadata: Metadata = { title: `Sign in · ${APP_NAME}` }

export default function LoginPage() {
    return (
        <>
            <AppHeader />
            <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-8">
                <SignInContent />
            </main>
        </>
    )
}
