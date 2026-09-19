import { describe, expect, test } from 'bun:test'
import { formatLongDate, formatMoney, formatPercent, formatQuantity } from './format'

describe('format', () => {
    test('writes money, quantities and percentages the way each language does (no-break spaces included)', () => {
        expect(formatMoney('en', 943.8, 'EUR')).toBe('€943.80')
        expect(formatMoney('lt', 943.8, 'EUR')).toBe('943,80\u00a0€')
        expect(formatQuantity('en', 13)).toBe('13')
        expect(formatQuantity('lt', 13.5)).toBe('13,5')
        expect(formatPercent('en', 21)).toBe('21%')
        expect(formatPercent('lt', 21)).toBe('21\u00a0%')
    })
    test('uses the supplied currency and its decimal precision', () => {
        expect(formatMoney('en', 12.5, 'USD')).toBe('$12.50')
        expect(formatMoney('en', 1234, 'JPY')).toBe('¥1,234')
    })
    test('writes dates out in full without shifting the day', () => {
        expect(formatLongDate('en', '2026-07-31')).toBe('July 31, 2026')
        expect(formatLongDate('lt', '2026-07-31')).toBe('2026 m. liepos 31 d.')
        expect(formatLongDate('en', 'soon')).toBe('soon')
    })
})
