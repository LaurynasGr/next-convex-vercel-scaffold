'use client'

import { zodFieldErrors } from '@scaffold/core'
import { useZodResolver } from '@scaffold/forms'
import { useTranslations } from '@scaffold/i18n'
import { useIsMountedRef } from '@scaffold/ui/hooks'
import { ConvexError } from 'convex/values'
import { useState } from 'react'
import { type DefaultValues, type Path, type UseFormReturn, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'

const ERROR_TOAST_MS = 10_000

/**
 * A form that posts its raw state to a Convex mutation taking the same zod schema as its args. Outcomes are toasts,
 * field errors stay on the fields. While the save is in flight the whole form is disabled (form-level `disabled`
 * reaches every field, the select's Radix root included, and keeps their values), so nothing typed meanwhile is
 * lost to the reset that follows: after a successful save the form goes back to what was stored (through
 * `toFormInput`: trimmed, blanks cleared) or, without one, to what was submitted, so it is clean either way, then
 * `onSaved` runs (a dialog closes, a page stays). Render it with `SaveForm`.
 */
export function useSaveForm<Shape extends z.ZodRawShape>({
    schema,
    defaultValues,
    save,
    toFormInput,
    successMessage,
    errorMessage,
    onSaved,
}: UseSaveFormParams<Shape>): SaveFormState<Shape> {
    const t = useTranslations('global')
    const isMounted = useIsMountedRef()
    // `isSubmitting` cannot be fed back into the same `useForm` call, hence the state flag.
    const [saving, setSaving] = useState(false)
    const form = useForm<SaveFormInput<Shape>>({
        resolver: useZodResolver(schema),
        mode: 'onTouched',
        defaultValues,
        disabled: saving,
    })

    const onSubmit = form.handleSubmit(async (values) => {
        setSaving(true)
        try {
            await save(values)
            if (!isMounted.current) return
            // The clean state to go back to: what the server stored when the caller can express it as form state,
            // the submitted values otherwise.
            let clean = values
            if (toFormInput !== undefined) {
                const stored = schema.safeParse(values)
                if (stored.success) {
                    clean = toFormInput(stored.data)
                }
            }
            form.reset(clean)
            toast.success(successMessage ?? t('changesSaved'))
            onSaved?.()
        } catch (error) {
            if (!isMounted.current) return
            // The browser already ran the schema, so field errors here mean the two disagree; still show them in place.
            const errors = zodFieldErrors(schema, error)
            // The form's values are the schema's input, so every top-level key of the schema is a path of the form;
            // TypeScript cannot see that through the generic (`Path<Input>` stays unresolved), hence the cast.
            for (const { field, message } of errors) form.setError(field as Path<SaveFormInput<Shape>>, { message })
            // Errors stay longer than the default few seconds so a failed save is not missed.
            if (errors.length === 0)
                toast.error(
                    error instanceof ConvexError && typeof error.data === 'string' ? error.data : errorMessage,
                    { duration: ERROR_TOAST_MS },
                )
        } finally {
            if (isMounted.current) {
                setSaving(false)
            }
        }
    })

    return { form, onSubmit, saving }
}

/** The form state of a schema: its zod input ('' / null for empty). */
export type SaveFormInput<Shape extends z.ZodRawShape> = z.input<z.ZodObject<Shape>>

export interface UseSaveFormParams<Shape extends z.ZodRawShape> {
    /** The mutation's args schema; the form's values are its input and the server's field errors are keyed by it. */
    schema: z.ZodObject<Shape>
    defaultValues: DefaultValues<SaveFormInput<Shape>>
    /** Sends the raw form state to its mutation. */
    save: (values: SaveFormInput<Shape>) => Promise<unknown>
    /**
     * Form state for what the save stored, so a form that stays on screen resets to it (trimmed, blanks as '' /
     * null again). Needed when the schema's output is not valid form state (`optionalString` / `optionalNumber`
     * fields parse to `undefined`); without it the form resets to the values as submitted.
     */
    toFormInput?: (stored: z.output<z.ZodObject<Shape>>) => SaveFormInput<Shape>
    /** Defaults to the shared "Changes saved". */
    successMessage?: string
    /** Shown when the save failed for no particular field and the server gave no message. */
    errorMessage: string
    /** Called after a successful save (and its toast). */
    onSaved?: () => void
}

export interface SaveFormState<Shape extends z.ZodRawShape> {
    form: UseFormReturn<SaveFormInput<Shape>>
    onSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>
    saving: boolean
}
