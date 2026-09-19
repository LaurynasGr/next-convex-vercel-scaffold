/**
 * The time zone timestamps are shown in. Calendar dates are formatted in UTC regardless (see the app's
 * `lib/format.ts`), so the intl layer defaults to it; a browser reports its own zone through a cookie
 * (`TimeZoneCookie` writes it, the request config reads it), so timestamps render the same on the server and in
 * the browser. next-intl-free, like `locales.ts`.
 */
export const DEFAULT_TIMEZONE = 'UTC'

export const TIMEZONE_COOKIE_NAME = 'TIMEZONE'
/** A year; the browser refreshes it on every visit anyway. */
export const TIMEZONE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

/** The IANA zone a cookie value stands for, or the default for anything Intl does not know (a tampered cookie). */
export function parseTimeZone(value: string | undefined): string {
    if (value === undefined) return DEFAULT_TIMEZONE
    try {
        new Intl.DateTimeFormat('en', { timeZone: value })
        return value
    } catch {
        return DEFAULT_TIMEZONE
    }
}
