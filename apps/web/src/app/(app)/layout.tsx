import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server'
import { api } from '@scaffold/core'
import { preloadQuery } from 'convex/nextjs'
import { AppHeader } from '@/components/app-header/app-header'
import { UserMenu } from './partials/user-menu'

/** Signed-in shell. The proxy redirects anonymous visitors to /login before this renders. */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const token = await convexAuthNextjsToken()
    const preloadedViewer = await preloadQuery(api.users.viewer, {}, { token })

    return (
        <>
            <AppHeader>
                <UserMenu preloadedViewer={preloadedViewer} />
            </AppHeader>
            <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-8">{children}</main>
        </>
    )
}
