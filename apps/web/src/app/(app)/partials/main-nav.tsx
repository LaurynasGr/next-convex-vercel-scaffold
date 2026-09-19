'use client'

import { useTranslations } from '@scaffold/i18n'
import { cn } from '@scaffold/ui/lib/utils'
import { HeartPulseIcon, HouseIcon, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

/** The insurance types; `key` is the label's key under `nav`. The brand in the header links home. */
const ITEMS = [
    { key: 'lifeInsurance', href: '/life-insurance', icon: HeartPulseIcon },
    { key: 'homeInsurance', href: '/home-insurance', icon: HouseIcon },
] as const satisfies {
    key: string
    href: string
    icon: LucideIcon
}[]

function isActive(item: (typeof ITEMS)[number], pathname: string) {
    return pathname === item.href || pathname.startsWith(`${item.href}/`)
}

/** Module switcher in the header; the current module is highlighted from the pathname. */
export function MainNav() {
    const t = useTranslations('nav')
    const pathname = usePathname()
    return (
        <nav aria-label={t('main')} className="flex items-center gap-1">
            {ITEMS.map((item) => {
                const Icon = item.icon
                const active = isActive(item, pathname)
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                            'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
                            active
                                ? 'bg-muted text-foreground'
                                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                        )}
                    >
                        <Icon className="size-4" />
                        {t(item.key)}
                    </Link>
                )
            })}
        </nav>
    )
}
