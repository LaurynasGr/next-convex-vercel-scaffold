import { describe, expect, test } from 'bun:test'
import { addDays, calendarDateOf, daysOf, IsoDateSchema, lastDayOfPreviousMonth, parseIsoDate, todayIso } from './dates'

describe('ISO dates', () => {
    test('accepts real calendar dates only', () => {
        expect(IsoDateSchema.safeParse('2026-02-28').success).toBe(true)
        for (const value of ['', '2026-2-8', '2026-02-30', '2026-13-01', 'yesterday']) {
            expect(IsoDateSchema.safeParse(value).success).toBe(false)
            expect(parseIsoDate(value)).toBeNull()
        }
    })
    test('adds days across month and year ends', () => {
        expect(addDays('2026-01-31', 14)).toBe('2026-02-14')
        expect(addDays('2026-12-25', 14)).toBe('2027-01-08')
        expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
        expect(addDays('nope', 3)).toBe('nope')
    })
    test('finds the last day of the previous month', () => {
        expect(lastDayOfPreviousMonth('2026-03-15')).toBe('2026-02-28')
        expect(lastDayOfPreviousMonth('2028-03-01')).toBe('2028-02-29')
        expect(lastDayOfPreviousMonth('2026-01-01')).toBe('2025-12-31')
    })
    test('takes today from the local calendar as an ISO date', () => {
        expect(todayIso()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })
    test('lists the days of a range inclusively', () => {
        expect(daysOf({ start: '2026-02-27', end: '2026-03-01' })).toEqual(['2026-02-27', '2026-02-28', '2026-03-01'])
        expect(daysOf({ start: '2026-03-01', end: '2026-03-01' })).toEqual(['2026-03-01'])
        expect(daysOf({ start: '2026-03-02', end: '2026-03-01' })).toEqual([])
        expect(daysOf({ start: 'x', end: '2026-03-01' })).toEqual([])
    })
    test('takes the calendar day of an instant in the given zone', () => {
        // 23:30 in Vilnius (UTC+3 in summer) is still the 3rd there, the 3rd 20:30 in UTC.
        expect(calendarDateOf('2026-08-03T23:30:00+03:00', 'Europe/Vilnius')).toBe('2026-08-03')
        expect(calendarDateOf('2026-08-03T23:30:00Z', 'Europe/Vilnius')).toBe('2026-08-04')
        expect(calendarDateOf('2026-08-03T23:30:00+03:00', undefined)).toBe('2026-08-03')
        expect(calendarDateOf('2026-08-03T23:30:00Z', 'Not/AZone')).toBe('2026-08-03')
    })
})
