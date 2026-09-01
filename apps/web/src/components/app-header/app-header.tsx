import { Layers } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { APP_NAME, APP_TAGLINE } from '@/lib/brand'
import { ThemeToggle } from './theme-toggle'

/** Sticky top bar: brand on the left, theme toggle plus any page-specific actions on the right. */
export function AppHeader({ children }: { children?: ReactNode }) {
    return (
        <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
            <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-8">
                <Link
                    href="/"
                    className="flex items-center gap-3 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                    <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                        <Layers className="size-5" />
                    </div>
                    <div>
                        <h1 className="whitespace-nowrap text-sm font-semibold leading-tight tracking-tight sm:text-base">
                            {APP_NAME}
                        </h1>
                        <p className="hidden text-xs text-muted-foreground sm:block">{APP_TAGLINE}</p>
                    </div>
                </Link>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    {children}
                </div>
            </div>
        </header>
    )
}
