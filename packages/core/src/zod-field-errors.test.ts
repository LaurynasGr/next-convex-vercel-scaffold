import { expect, test } from 'bun:test'
import { ConvexError } from 'convex/values'
import { z } from 'zod'
import { fieldValidationError, zodFieldErrors } from './zod-field-errors'

const Schema = z.object({ name: z.string(), email: z.string() })

test('maps the plugin error payload onto the schema fields and drops unknown paths', () => {
    const error = new ConvexError({
        ZodError: [
            { code: 'invalid_format', path: ['email'], message: 'Enter a valid email address' },
            { code: 'too_small', path: ['other'], message: 'ignored' },
        ],
    })
    expect(zodFieldErrors(Schema, error)).toEqual([{ field: 'email', message: 'Enter a valid email address' }])
})

test('reads back a server-side field error', () => {
    expect(zodFieldErrors(Schema, fieldValidationError('name', 'Already taken'))).toEqual([
        { field: 'name', message: 'Already taken' },
    ])
})

test('is empty for other errors', () => {
    expect(zodFieldErrors(Schema, new ConvexError('Not signed in'))).toEqual([])
    expect(zodFieldErrors(Schema, new Error('boom'))).toEqual([])
})
