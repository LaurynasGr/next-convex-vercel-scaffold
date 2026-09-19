import { parseIsoDate } from '@scaffold/core'
import type { Locale } from '@scaffold/i18n/locales'

/** An amount with two decimals, in the selected language, without a currency symbol. */
export function formatAmount(locale: Locale, amount: number): string {
    return new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)
}

/** A calendar date in the selected language; UTC keeps the day from shifting. Malformed input is shown as is. */
export function formatDate(locale: Locale, date: string): string {
    const parsed = parseIsoDate(date)
    return parsed === null
        ? date
        : new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' }).format(parsed.toDate('UTC'))
}
