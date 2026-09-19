'use client'

import { useFormatter } from '@scaffold/i18n'

/**
 * A timestamp (ms since the epoch, as Convex's `_creationTime`) as "Sep 3, 2026, 2:05 PM" in the app's language and
 * the request's time zone, which is the browser's once `TimeZoneCookie` has reported it (UTC on the first visit).
 */
export function DateTime({ value }: DateTimeProps) {
    const format = useFormatter()
    const date = new Date(value)
    return (
        <time dateTime={date.toISOString()}>{format.dateTime(date, { dateStyle: 'medium', timeStyle: 'short' })}</time>
    )
}

interface DateTimeProps {
    value: number
}
