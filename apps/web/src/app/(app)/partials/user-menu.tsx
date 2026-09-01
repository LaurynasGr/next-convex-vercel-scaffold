'use client'

import { useAuthActions } from '@convex-dev/auth/react'
import type { api } from '@scaffold/core'
import { Button } from '@scaffold/ui/components/button'
import { type Preloaded, usePreloadedQuery } from 'convex/react'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

/** Avatar, email and sign-out; the viewer is preloaded on the server so it renders with the page. */
export function UserMenu({ preloadedViewer }: { preloadedViewer: Preloaded<typeof api.users.viewer> }) {
    const viewer = usePreloadedQuery(preloadedViewer)
    const { signOut } = useAuthActions()
    const router = useRouter()

    if (!viewer) return null
    return (
        <>
            {viewer.image && (
                // biome-ignore lint/performance/noImgElement: avatars are tiny and already served resized by Google.
                <img
                    src={viewer.image}
                    alt={viewer.name ?? viewer.email ?? 'Profile'}
                    // Google avatar URLs 403 when sent a referrer.
                    referrerPolicy="no-referrer"
                    className="size-7 rounded-full border"
                />
            )}
            <span className="hidden max-w-48 truncate text-xs text-muted-foreground sm:inline">
                {viewer.email ?? viewer.name ?? ''}
            </span>
            <Button
                variant="ghost"
                size="icon-sm"
                onClick={async () => {
                    await signOut()
                    router.replace('/login')
                }}
                title="Sign out"
                aria-label="Sign out"
            >
                <LogOut />
            </Button>
        </>
    )
}
