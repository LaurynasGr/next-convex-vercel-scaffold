'use client'

import { ConvexAuthNextjsProvider } from '@convex-dev/auth/nextjs'
import { ConvexReactClient } from 'convex/react'
import type { ReactNode } from 'react'
import { I18nProvider } from 'react-aria-components'

const url = process.env.NEXT_PUBLIC_CONVEX_URL
const convex = url ? new ConvexReactClient(url) : null

export function ConvexClientProvider({ children }: { children: ReactNode }) {
    if (!convex) {
        return (
            <div className="mx-auto max-w-xl p-8">
                <h1 className="text-xl font-semibold">Convex is not configured</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Set <code>NEXT_PUBLIC_CONVEX_URL</code> in <code>apps/web/.env.local</code> (see{' '}
                    <code>.env.example</code>) and restart the dev server.
                </p>
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
