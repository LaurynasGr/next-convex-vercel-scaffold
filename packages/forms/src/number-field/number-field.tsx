'use client'

import { Input } from '@scaffold/ui/components/input'
import { Label } from '@scaffold/ui/components/label'
import { cn } from '@scaffold/ui/lib/utils'
import type * as React from 'react'
import { useId, useState } from 'react'
import { type FieldPathByValue, type FieldValues, type UseControllerProps, useController } from 'react-hook-form'
import { FieldError, visibleFieldError } from '../field-error/field-error'
import { commitNumberDraft, draftMatchesValue, settleNumberDraft } from './number-input'

/**
 * Numeric input bound to a `number | null` field. A cleared input stores null
 * (never undefined: react-hook-form would reset the field to its default value);
 * schemas map null to undefined or an error via `optionalNumber` / `requiredNumber`.
 *
 * Rendered as a text input with a decimal keyboard rather than type="number":
 * native number inputs report unfinished text ("-", "1.") as an empty value,
 * which makes it impossible to keep what the user typed on re-render.
 */
export function NumberField<T extends FieldValues, TName extends FieldPathByValue<T, number | null>, TTransformed = T>({
    control,
    name,
    rules,
    defaultValue,
    disabled,
    shouldUnregister,
    label,
    className,
    inputClassName,
    labelClassName,
    id,
    inputMode = 'decimal',
    ...props
}: NumberFieldProps<T, TName, TTransformed>) {
    const { field, fieldState, formState } = useController({
        control,
        name,
        rules,
        defaultValue,
        disabled,
        shouldUnregister,
    })
    const error = visibleFieldError(fieldState, formState)
    const autoId = useId()
    const inputId = id ?? autoId
    // The text as typed, kept while focused so unfinished input ("1.", "-") is not
    // wiped by re-rendering the controlled value. It only stays in charge while it
    // still parses to the form value; an external reset/setValue wins otherwise.
    const [draft, setDraft] = useState<string | null>(null)
    const activeDraft = draft !== null && draftMatchesValue(draft, field.value) ? draft : null
    const shown =
        activeDraft ?? (typeof field.value === 'number' && !Number.isNaN(field.value) ? String(field.value) : '')

    return (
        <div className={cn('space-y-1.5', className)}>
            <Label htmlFor={inputId} className={labelClassName}>
                {label}
            </Label>
            <Input
                {...props}
                {...field}
                type="text"
                inputMode={inputMode}
                autoComplete="off"
                spellCheck={false}
                value={shown}
                onChange={(e) => {
                    setDraft(e.target.value)
                    // Unfinished text is NaN in form state so a submit while typing
                    // fails validation instead of sending the previous number.
                    field.onChange(commitNumberDraft(e.target.value))
                }}
                onBlur={() => {
                    if (activeDraft !== null) field.onChange(settleNumberDraft(activeDraft))
                    setDraft(null)
                    field.onBlur()
                }}
                id={inputId}
                className={inputClassName}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${inputId}-error` : undefined}
            />
            <FieldError id={`${inputId}-error`} message={error?.message} />
        </div>
    )
}

interface NumberFieldProps<T extends FieldValues, TName extends FieldPathByValue<T, number | null>, TTransformed = T>
    extends Omit<React.ComponentProps<'input'>, 'name' | 'defaultValue' | 'type' | 'value' | 'onChange' | 'onBlur'>,
        UseControllerProps<T, TName, TTransformed> {
    control: NonNullable<UseControllerProps<T, TName, TTransformed>['control']>
    label: string
    className?: string
    inputClassName?: string
    labelClassName?: string
}
