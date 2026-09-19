import {
    type CalendarDate,
    endOfMonth,
    fromAbsolute,
    getLocalTimeZone,
    parseDate,
    toCalendarDate,
    today,
} from '@internationalized/date'
import { z } from 'zod'

/**
 * Calendar dates travel as ISO `YYYY-MM-DD` strings (what `DateField` stores and what gets persisted). The
 * arithmetic runs on `CalendarDate`, a date with no time or time zone, so no DST shift can move a day.
 */

/** An ISO date that exists on the calendar (no 2026-02-30). */
export const IsoDateSchema = z.string().refine((value) => parseIsoDate(value) !== null, 'Enter a valid date')

/** The calendar date, or null when the string is not a real `YYYY-MM-DD` date. */
export function parseIsoDate(value: string): CalendarDate | null {
    try {
        return parseDate(value)
    } catch {
        return null
    }
}

/** Today's date in `timeZone`, by default where the code runs (the browser's local day when called from a form). */
export function todayIso(timeZone = getLocalTimeZone()): string {
    return today(timeZone).toString()
}

/** `date` shifted by `days` (negative goes back); a malformed date is returned untouched. */
export function addDays(date: string, days: number): string {
    const parsed = parseIsoDate(date)
    return parsed === null ? date : parsed.add({ days }).toString()
}

/** The last day of the month before the one `date` is in. */
export function lastDayOfPreviousMonth(date: string): string {
    const parsed = parseIsoDate(date)
    return parsed === null ? date : endOfMonth(parsed.subtract({ months: 1 })).toString()
}

/** An inclusive range of calendar days. */
export interface DateRange {
    /** ISO `YYYY-MM-DD`. */
    start: string
    end: string
}

/** Every day of the range in order, `start` and `end` included; empty when either is malformed or `end` is first. */
export function daysOf({ start, end }: DateRange): string[] {
    const first = parseIsoDate(start)
    const last = parseIsoDate(end)
    if (first === null || last === null) return []
    const days: string[] = []
    for (let day = first; day.compare(last) <= 0; day = day.add({ days: 1 })) {
        days.push(day.toString())
    }
    return days
}

/**
 * The calendar day an RFC 3339 instant falls on in `timeZone` (an IANA name), or, when no usable zone is given,
 * the day the string itself names (the offset it was written with): a timestamp from a third-party account belongs
 * to the day that account showed it under, not the UTC one.
 */
export function calendarDateOf(instant: string, timeZone: string | undefined): string {
    const ms = Date.parse(instant)
    if (timeZone !== undefined && !Number.isNaN(ms)) {
        try {
            return toCalendarDate(fromAbsolute(ms, timeZone)).toString()
        } catch {
            // An unknown zone name: fall through to the day as written.
        }
    }
    return instant.slice(0, 10)
}
