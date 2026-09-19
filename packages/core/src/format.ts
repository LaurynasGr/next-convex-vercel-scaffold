import type { Locale } from '@scaffold/i18n/locales'
import { parseIsoDate } from './dates'

/** How amounts, quantities and dates read in a given language, for output made outside React (emails, documents). */

/** A money amount with its currency, the way `locale` writes it ("€943.80", "943,80 €"). */
export function formatMoney(locale: Locale, amount: number, currency: string): string {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
}

/** A quantity with up to two decimals. */
export function formatQuantity(locale: Locale, quantity: number): string {
    return new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(quantity)
}

/** A percentage the way `locale` writes it ("21%", "21 %"). */
export function formatPercent(locale: Locale, percent: number): string {
    return new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 2 }).format(percent / 100)
}

export type MonthStyle = 'long' | 'short'

/**
 * The month of an ISO `YYYY-MM-DD` date with its year, named in full ("August 2026", "2026 m. rugpjūtis") or
 * shortened ("Aug 2026", "2026-08").
 */
export function formatMonth(locale: Locale, date: string, style: MonthStyle = 'long'): string {
    const parsed = parseIsoDate(date)
    if (parsed === null) return date
    return new Intl.DateTimeFormat(locale, { month: style, year: 'numeric', timeZone: 'UTC' }).format(
        parsed.toDate('UTC'),
    )
}

/**
 * An ISO `YYYY-MM-DD` date written out in full ("July 31, 2026", "2026 m. liepos 31 d."); a malformed one is shown
 * as is. The calendar date becomes a UTC instant and is read back in UTC, so the day cannot shift.
 */
export function formatLongDate(locale: Locale, date: string): string {
    const parsed = parseIsoDate(date)
    if (parsed === null) return date
    return new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(parsed.toDate('UTC'))
}
