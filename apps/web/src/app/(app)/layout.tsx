import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server'
import { api } from '@scaffold/core'
import { preloadQuery } from 'convex/nextjs'
import { Suspense } from 'react'
import { AppHeader } from '@/components/app-header/app-header'
import { MainNav } from './partials/main-nav'
import { UserMenu } from './partials/user-menu'

/** The only part of the shell that waits on Convex; it streams in behind the skeleton. */
async function SuspendedUserMenu() {
    const token = await convexAuthNextjsToken()
    const preloadedViewer = await preloadQuery(api.users.viewer, {}, { token })
    return <UserMenu preloadedViewer={preloadedViewer} />
}

/** Signed-in shell. The proxy redirects anonymous visitors to /login before this renders. */
export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AppHeader nav={<MainNav />}>
                <Suspense fallback={<UserMenu preloadedViewer={null} />}>
                    <SuspendedUserMenu />
                </Suspense>
            </AppHeader>
            {/* Pages wrap themselves in PageContainer; section layouts (SidebarLayout) own the full width for their sidebar. */}
            {/* Outermost focus fallback for dialogs whose trigger disappeared (see ConfirmDialog); tables are the nearer one. */}
            <main tabIndex={-1} className="flex flex-col min-h-[calc(100svh-var(--header-height))] outline-none">
                {children}
            </main>
        </>
    )
}
