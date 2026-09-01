'use client'

import { cn } from '@scaffold/ui/lib/utils'
import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useSyncExternalStore } from 'react'

const OPTIONS: { value: string; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'Light theme', icon: Sun },
    { value: 'system', label: 'Follow system theme', icon: Monitor },
    { value: 'dark', label: 'Dark theme', icon: Moon },
]

const subscribe = () => () => {}
/** False during SSR and hydration, true afterwards — the stored theme is only known on the client. */
const useMounted = () =>
    useSyncExternalStore(
        subscribe,
        () => true,
        () => false,
    )

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const mounted = useMounted()
    const current = mounted ? theme : undefined

    return (
        <fieldset aria-label="Theme" className="flex items-center gap-0.5 rounded-full border bg-muted/50 p-0.5">
            {OPTIONS.map(({ value, label, icon: Icon }) => (
                <button
                    key={value}
                    type="button"
                    aria-pressed={current === value}
                    title={label}
                    onClick={() => setTheme(value)}
                    className={cn(
                        'flex size-7 items-center justify-center rounded-full transition-colors',
                        current === value
                            ? 'bg-background text-foreground shadow-sm ring-1 ring-border'
                            : 'text-muted-foreground hover:text-foreground',
                    )}
                >
                    <Icon className="size-3.5" />
                    <span className="sr-only">{label}</span>
                </button>
            ))}
        </fieldset>
    )
}
