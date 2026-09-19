import { getTranslations } from '@scaffold/i18n/server'
import { LayersIcon } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { APP_NAME } from '@/lib/brand'
import { LocaleToggle } from './locale-toggle'
import { ThemeToggle } from './theme-toggle'

/** Sticky top bar: brand and the module navigation on the left, language and theme toggles plus any page-specific actions on the right. */
export async function AppHeader({ nav, children }: AppHeaderProps) {
    const t = await getTranslations('global')
    return (
        <header className="sticky top-0 z-10 h-(--header-height) border-b bg-background/80 backdrop-blur">
            <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between gap-4 px-4">
                <div className="flex min-w-0 items-center gap-4">
                    <Link
                        href="/"
                        className="flex shrink-0 items-center gap-3 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    >
                        <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                            <LayersIcon className="size-5" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="whitespace-nowrap text-sm font-semibold leading-tight tracking-tight sm:text-base">
                                {APP_NAME}
                            </h1>
                            <p className="hidden text-xs text-muted-foreground md:block">{t('tagline')}</p>
                        </div>
                    </Link>
                    {nav}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    <LocaleToggle />
                    <ThemeToggle />
                    {children}
                </div>
            </div>
        </header>
    )
}

interface AppHeaderProps {
    /** Module navigation, rendered next to the brand. */
    nav?: ReactNode
    /** Right-hand extras next to the theme toggle (user menu, page actions). */
    children?: ReactNode
}
