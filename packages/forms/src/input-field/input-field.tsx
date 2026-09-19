'use client'

import { Input } from '@scaffold/ui/components/input'
import { Label } from '@scaffold/ui/components/label'
import { cn } from '@scaffold/ui/lib/utils'
import type * as React from 'react'
import { useId } from 'react'
import { type FieldPathByValue, type FieldValues, type UseControllerProps, useController } from 'react-hook-form'
import { FieldError, visibleFieldError } from '../field-error/field-error'
import { type FieldLabelProps, useFieldLabel } from '../hooks/use-field-label'

/**
 * Text-like input bound to a string field. A cleared input stores '' (never
 * undefined: react-hook-form would reset the field to its default value);
 * schemas map '' to undefined via `optionalString` from @scaffold/core.
 */
export function InputField<T extends FieldValues, TName extends FieldPathByValue<T, string>, TTransformed = T>({
    control,
    name,
    rules,
    defaultValue,
    disabled,
    shouldUnregister,
    label: labelProp,
    labelKey,
    className,
    inputClassName,
    labelClassName,
    id,
    type,
    ...props
}: InputFieldProps<T, TName, TTransformed>) {
    const label = useFieldLabel({ label: labelProp, labelKey })
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

    return (
        <div className={cn('space-y-1.5', className)}>
            <Label htmlFor={inputId} className={labelClassName}>
                {label}
            </Label>
            <Input
                {...props}
                {...field}
                type={type}
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value)}
                id={inputId}
                className={inputClassName}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${inputId}-error` : undefined}
            />
            <FieldError id={`${inputId}-error`} message={error?.message} />
        </div>
    )
}

type InputFieldProps<T extends FieldValues, TName extends FieldPathByValue<T, string>, TTransformed = T> = Omit<
    React.ComponentProps<'input'>,
    'name' | 'defaultValue' | 'type'
> &
    UseControllerProps<T, TName, TTransformed> &
    FieldLabelProps & {
        /** Numbers go through NumberField, booleans through CheckboxField. */
        type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url'
        control: NonNullable<UseControllerProps<T, TName, TTransformed>['control']>
        className?: string
        inputClassName?: string
        labelClassName?: string
    }
