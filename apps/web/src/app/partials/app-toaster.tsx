'use client'

import { Toaster } from '@scaffold/ui/components/sonner'
import { useTheme } from 'next-themes'

/** The app's single toaster, following the next-themes setting. */
export function AppToaster() {
    const { theme } = useTheme()
    return <Toaster theme={theme === 'light' || theme === 'dark' ? theme : 'system'} position="top-right" closeButton />
}
