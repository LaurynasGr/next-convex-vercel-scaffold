/**
 * The languages the app ships; each has a directory under `translations/`. This module has no next-intl or React in
 * it (`@scaffold/i18n/locales`), so `@scaffold/core` and the Convex schema can share the list.
 */
export const LOCALES = ['en', 'lt'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'en'

/** Where the chosen language is kept (next-intl's conventional cookie name). */
export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE'
/** A year: the choice should outlive the session. */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

/** The locale a stored value stands for, or the default for anything else (an old or tampered cookie). */
export function parseLocale(value: string | undefined): Locale {
    return LOCALES.find((locale) => locale === value) ?? DEFAULT_LOCALE
}
