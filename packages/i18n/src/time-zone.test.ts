import { describe, expect, test } from 'bun:test'
import { DEFAULT_TIMEZONE, parseTimeZone } from './time-zone'

describe('parseTimeZone', () => {
    test('keeps a real zone and falls back for anything else', () => {
        expect(parseTimeZone('Europe/Vilnius')).toBe('Europe/Vilnius')
        expect(parseTimeZone(undefined)).toBe(DEFAULT_TIMEZONE)
        expect(parseTimeZone('Mars/Olympus')).toBe(DEFAULT_TIMEZONE)
        expect(parseTimeZone('')).toBe(DEFAULT_TIMEZONE)
    })
})
