import { z } from 'zod'

/**
 * Bridges between form state and domain values.
 *
 * react-hook-form resets a field to its default value when it is set to
 * `undefined`, so the field components in @scaffold/forms store '' for an
 * empty text-like field and null for an empty number field. These helpers
 * accept those sentinels as *input* and produce clean `undefined` (or a
 * validation error) as *output*, which is why forms are typed as
 * `useForm<z.input<typeof S>, unknown, z.output<typeof S>>`.
 */

/** Optional text: '' (or whitespace) becomes undefined, anything else is trimmed and validated by `inner`. */
export function optionalString<Out>(inner: z.ZodType<Out, string>) {
    return z
        .string()
        .transform((value) => {
            const trimmed = value.trim()
            return trimmed === '' ? undefined : trimmed
        })
        .pipe(inner.optional())
}

/** NumberField stores NaN while the typed text is not a complete number yet (see @scaffold/forms). */
const INVALID_NUMBER = 'Enter a valid number'
const formNumber = z.union([z.number(), z.nan(), z.null()])

/** Optional number bound to a NumberField: null becomes undefined, NaN (unfinished input) fails, numbers are validated by `inner`. */
export function optionalNumber<Out>(inner: z.ZodType<Out, number>, invalidMessage = INVALID_NUMBER) {
    return formNumber
        .transform((value, ctx) => {
            if (value !== null && Number.isNaN(value)) {
                ctx.addIssue({ code: 'custom', message: invalidMessage })
                return z.NEVER
            }
            return value ?? undefined
        })
        .pipe(inner.optional())
}

/** Required number bound to a NumberField: null fails with `message`, NaN with `invalidMessage`, numbers are validated by `inner`. */
export function requiredNumber<Out>(message: string, inner: z.ZodType<Out, number>, invalidMessage = INVALID_NUMBER) {
    return formNumber
        .transform((value, ctx) => {
            if (value === null || Number.isNaN(value)) {
                ctx.addIssue({ code: 'custom', message: value === null ? message : invalidMessage })
                return z.NEVER
            }
            return value
        })
        .pipe(inner)
}
