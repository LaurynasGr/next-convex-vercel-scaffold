import { ConvexError } from 'convex/values'
import { z } from 'zod'

/** What `convex-helpers`' zod plugin puts in `ConvexError.data` when a function's args fail validation. */
const ZodErrorData = z.object({
    ZodError: z.array(z.object({ path: z.array(z.union([z.string(), z.number()])), message: z.string() })),
})

/**
 * Field errors from a Convex mutation whose zod-validated args rejected the input, keyed by the schema's
 * top-level fields so they can go straight into `form.setError`. Empty for any other error.
 */
export function zodFieldErrors<Shape extends z.ZodRawShape>(
    schema: z.ZodObject<Shape>,
    error: unknown,
): ZodFieldError<Shape>[] {
    if (!(error instanceof ConvexError)) return []
    const data = ZodErrorData.safeParse(error.data)
    if (!data.success) return []
    const fieldName = schema.keyof()
    return data.data.ZodError.flatMap((issue): ZodFieldError<Shape>[] => {
        const field = fieldName.safeParse(issue.path[0])
        return field.success ? [{ field: field.data, message: issue.message }] : []
    })
}

/**
 * A `ConvexError` shaped like the zod plugin's args rejection, for server-side checks that belong on one field (a
 * name already taken, a token the vendor refused): `zodFieldErrors` puts it on that field in the form.
 */
export function fieldValidationError(field: string, message: string) {
    return new ConvexError({ ZodError: [{ path: [field], message }] })
}

export interface ZodFieldError<Shape extends z.ZodRawShape> {
    field: keyof Shape & string
    message: string
}
