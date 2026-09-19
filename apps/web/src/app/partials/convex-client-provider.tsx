'use client'

import { ConvexAuthNextjsProvider } from '@convex-dev/auth/nextjs'
import { useTranslations } from '@scaffold/i18n'
import { ConvexReactClient } from 'convex/react'
import type { ReactNode } from 'react'
import { I18nProvider } from 'react-aria-components'

const url = process.env.NEXT_PUBLIC_CONVEX_URL
const convex = url ? new ConvexReactClient(url) : null

export function ConvexClientProvider({ children }: ConvexClientProviderProps) {
    const t = useTranslations('global.convexNotConfigured')
    if (!convex) {
        return (
            <div className="mx-auto max-w-xl p-8">
                <h1 className="text-xl font-semibold">{t('title')}</h1>
                <p className="mt-2 text-sm text-muted-foreground">{t.rich('description')}</p>
            </div>
        )
    }
    return (
        <ConvexAuthNextjsProvider client={convex}>
            {/* Pin react-aria date/time fields to DD/MM/YYYY and 24h regardless of browser locale. */}
            <I18nProvider locale="en-GB">{children}</I18nProvider>
        </ConvexAuthNextjsProvider>
    )
}

interface ConvexClientProviderProps {
    children: ReactNode
}
