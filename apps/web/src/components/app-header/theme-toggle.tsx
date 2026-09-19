'use client'

import { useTranslations } from '@scaffold/i18n'
import { cn } from '@scaffold/ui/lib/utils'
import { type LucideIcon, MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useSyncExternalStore } from 'react'

/** next-themes' theme names; each doubles as its label's key under `global.theme`. */
const OPTIONS = [
    { value: 'light', icon: SunIcon },
    { value: 'system', icon: MonitorIcon },
    { value: 'dark', icon: MoonIcon },
] as const satisfies { value: string; icon: LucideIcon }[]

const subscribe = () => () => {}
/** False during SSR and hydration, true afterwards — the stored theme is only known on the client. */
const useMounted = () =>
    useSyncExternalStore(
        subscribe,
        () => true,
        () => false,
    )

export function ThemeToggle() {
    const t = useTranslations('global.theme')
    const { theme, setTheme } = useTheme()
    const mounted = useMounted()
    const current = mounted ? theme : undefined

    return (
        <fieldset aria-label={t('label')} className="flex items-center gap-0.5 rounded-full border bg-muted/50 p-0.5">
            {OPTIONS.map(({ value, icon: Icon }) => (
                <button
                    key={value}
                    type="button"
                    aria-pressed={current === value}
                    title={t(value)}
                    onClick={() => setTheme(value)}
                    className={cn(
                        'flex size-7 items-center justify-center rounded-full transition-colors',
                        current === value
                            ? 'bg-background text-foreground shadow-sm ring-1 ring-border'
                            : 'text-muted-foreground hover:text-foreground',
                    )}
                >
                    <Icon className="size-3.5" />
                    <span className="sr-only">{t(value)}</span>
                </button>
            ))}
        </fieldset>
    )
}
