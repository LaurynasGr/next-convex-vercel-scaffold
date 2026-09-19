'use client'

import { LOCALES, type Locale, useLocale, useTranslations } from '@scaffold/i18n'
import { cn } from '@scaffold/ui/lib/utils'
import { useTransition } from 'react'
import { setLocale } from '@/i18n/actions'

/** Each language's flag; the label is `global.language.<locale>`. */
const FLAGS: Record<Locale, string> = { en: '🇬🇧', lt: '🇱🇹' }

/** Language switch in the header: one flag + code per language (the flag alone is tofu on some platforms), the current one pressed. */
export function LocaleToggle() {
    const t = useTranslations('global.language')
    const current = useLocale()
    const [pending, startTransition] = useTransition()

    return (
        <fieldset
            aria-label={t('label')}
            aria-busy={pending || undefined}
            className="flex items-center gap-0.5 rounded-full border bg-muted/50 p-0.5"
        >
            {LOCALES.map((locale) => (
                <button
                    key={locale}
                    type="button"
                    lang={locale}
                    aria-pressed={current === locale}
                    title={t(locale)}
                    disabled={pending}
                    onClick={() => startTransition(() => setLocale(locale))}
                    className={cn(
                        'flex h-7 items-center gap-1 rounded-full px-2 text-xs font-medium uppercase transition-colors',
                        current === locale
                            ? 'bg-background text-foreground shadow-sm ring-1 ring-border'
                            : 'text-muted-foreground hover:text-foreground',
                    )}
                >
                    <span aria-hidden className="text-sm leading-none">
                        {FLAGS[locale]}
                    </span>
                    {locale}
                    <span className="sr-only">{t(locale)}</span>
                </button>
            ))}
        </fieldset>
    )
}
