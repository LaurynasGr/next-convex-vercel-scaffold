import { describe, expect, test } from 'bun:test'
import { z } from 'zod'
import { optionalNumber, optionalString, requiredNumber } from './schema'

const Schema = z.object({
    name: z.string().trim().min(1, 'Name is required'),
    notes: optionalString(z.string().min(3, 'Too short')),
    website: optionalString(z.url('Enter a valid URL')),
    rate: requiredNumber('Enter a rate', z.number().positive('Must be above 0')),
    discount: optionalNumber(z.number().min(0).max(100)),
})

describe('form schema helpers', () => {
    test('map empty form sentinels to undefined', () => {
        const result = Schema.parse({ name: 'ACME', notes: '  ', website: '', rate: 80, discount: null })
        expect(result).toEqual({ name: 'ACME', notes: undefined, website: undefined, rate: 80, discount: undefined })
    })

    test('validate non-empty values with the inner schema', () => {
        const result = Schema.safeParse({ name: 'ACME', notes: 'ok', website: 'nope', rate: 80, discount: 5 })
        expect(result.success).toBe(false)
        expect(result.error?.issues.map((i) => [i.path.join('.'), i.message])).toEqual([
            ['notes', 'Too short'],
            ['website', 'Enter a valid URL'],
        ])
    })

    test('requiredNumber rejects a cleared field with its own message', () => {
        const result = Schema.safeParse({ name: '', notes: '', website: '', rate: null, discount: null })
        expect(result.success).toBe(false)
        expect(result.error?.issues.map((i) => [i.path.join('.'), i.message])).toEqual([
            ['name', 'Name is required'],
            ['rate', 'Enter a rate'],
        ])
    })

    test('unfinished numeric input (NaN) is rejected with its own message', () => {
        const result = Schema.safeParse({
            name: 'ACME',
            notes: '',
            website: '',
            rate: Number.NaN,
            discount: Number.NaN,
        })
        expect(result.success).toBe(false)
        expect(result.error?.issues.map((i) => [i.path.join('.'), i.message])).toEqual([
            ['rate', 'Enter a valid number'],
            ['discount', 'Enter a valid number'],
        ])
    })

    test('input type accepts the sentinels, output type is clean', () => {
        type In = z.input<typeof Schema>
        type Out = z.output<typeof Schema>
        const input: In = { name: '', notes: '', website: '', rate: null, discount: null }
        const output: Out = { name: 'x', rate: 1 }
        expect(input.rate).toBeNull()
        expect(output.notes).toBeUndefined()
    })
})
