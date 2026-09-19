'use client'

import { useAuthActions } from '@convex-dev/auth/react'
import { useDevSignInEnabled } from '@scaffold/core/hooks'
import { useTranslations } from '@scaffold/i18n'
import { GoogleLogo } from './google-logo'

// Styled per Google's sign-in branding guidelines: official light/dark button
// colors, the untouched "G" logo, and an approved label.
export function GoogleSignInButton() {
    const t = useTranslations('auth')
    const { signIn } = useAuthActions()
    return (
        <button
            type="button"
            onClick={() => void signIn('google')}
            className="flex h-10 w-full items-center justify-center gap-3 rounded-md border border-[#747775] bg-white px-3 text-sm font-medium text-[#1f1f1f] transition-colors hover:bg-[#f8f9fa] focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none dark:border-[#8e918f] dark:bg-[#131314] dark:text-[#e3e3e3] dark:hover:bg-[#1e1f20]"
        >
            <GoogleLogo />
            {t('continueWithGoogle')}
        </button>
    )
}

export function DevSignInButton() {
    const t = useTranslations('auth')
    const { signIn } = useAuthActions()
    // Local deployments can offer a Google-less shortcut (DEV_SIGN_IN_AS); never in production builds.
    const enabled = useDevSignInEnabled() && process.env.NODE_ENV !== 'production'
    if (!enabled) return null
    return (
        <button
            type="button"
            onClick={() => void signIn('dev')}
            className="text-xs text-muted-foreground underline-offset-4 hover:underline"
        >
            {t('devSignIn')}
        </button>
    )
}
