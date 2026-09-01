import { describe, expect, test } from 'bun:test'
import { commitNumberDraft, draftMatchesValue, parseNumberDraft, settleNumberDraft } from './number-input'

describe('parseNumberDraft', () => {
    test('commits complete numbers', () => {
        expect(parseNumberDraft('12')).toBe(12)
        expect(parseNumberDraft('1.5')).toBe(1.5)
        expect(parseNumberDraft('1,5')).toBe(1.5)
        expect(parseNumberDraft('-3')).toBe(-3)
        expect(parseNumberDraft('.5')).toBe(0.5)
        expect(parseNumberDraft('0')).toBe(0)
        expect(parseNumberDraft(' 80 ')).toBe(80)
    })

    test('clears the field on empty input', () => {
        expect(parseNumberDraft('')).toBeNull()
        expect(parseNumberDraft('   ')).toBeNull()
    })

    test('keeps the previous value while input is unfinished or invalid', () => {
        expect(parseNumberDraft('-')).toBe('pending')
        expect(parseNumberDraft('1e')).toBe('pending')
        expect(parseNumberDraft('1e3')).toBe('pending')
        expect(parseNumberDraft('abc')).toBe('pending')
        expect(parseNumberDraft('1.2.3')).toBe('pending')
    })

    test('a trailing decimal point is a complete number', () => {
        expect(parseNumberDraft('1.')).toBe(1)
    })
})

describe('settleNumberDraft', () => {
    test('turns an unfinished draft into a cleared field on blur', () => {
        expect(settleNumberDraft('-')).toBeNull()
        expect(settleNumberDraft('1.5')).toBe(1.5)
        expect(settleNumberDraft('')).toBeNull()
    })
})

describe('NumberField binding policy', () => {
    test('stores NaN for unfinished text and settles to null on blur', () => {
        expect(commitNumberDraft('-')).toBeNaN()
        expect(commitNumberDraft('12')).toBe(12)
        expect(commitNumberDraft('')).toBeNull()
        expect(settleNumberDraft('-')).toBeNull()
    })

    test('a draft stays active only while it matches the form value', () => {
        // Self-originated: the typed text (even with a comma) matches what was committed.
        expect(draftMatchesValue('1,5', 1.5)).toBe(true)
        expect(draftMatchesValue('-', Number.NaN)).toBe(true)
        expect(draftMatchesValue('', null)).toBe(true)
        // External reset()/setValue(): the form moved on, the draft must yield.
        expect(draftMatchesValue('12', null)).toBe(false)
        expect(draftMatchesValue('12', 13)).toBe(false)
        expect(draftMatchesValue('-', 5)).toBe(false)
    })
})
