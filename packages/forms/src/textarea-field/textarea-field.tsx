'use client'

import { Label } from '@scaffold/ui/components/label'
import { Textarea } from '@scaffold/ui/components/textarea'
import { cn } from '@scaffold/ui/lib/utils'
import type * as React from 'react'
import { useId } from 'react'
import { type FieldPathByValue, type FieldValues, type UseControllerProps, useController } from 'react-hook-form'
import { FieldError, visibleFieldError } from '../field-error/field-error'

export function TextareaField<T extends FieldValues, TName extends FieldPathByValue<T, string>, TTransformed = T>({
    control,
    name,
    rules,
    defaultValue,
    disabled,
    shouldUnregister,
    label,
    className,
    textareaClassName,
    labelClassName,
    id,
    ...props
}: TextareaFieldProps<T, TName, TTransformed>) {
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
    const textareaId = id ?? autoId

    return (
        <div className={cn('space-y-1.5', className)}>
            <Label htmlFor={textareaId} className={labelClassName}>
                {label}
            </Label>
            <Textarea
                {...props}
                {...field}
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value)}
                id={textareaId}
                className={textareaClassName}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${textareaId}-error` : undefined}
            />
            <FieldError id={`${textareaId}-error`} message={error?.message} />
        </div>
    )
}

interface TextareaFieldProps<T extends FieldValues, TName extends FieldPathByValue<T, string>, TTransformed = T>
    extends Omit<React.ComponentProps<'textarea'>, 'name' | 'defaultValue'>,
        UseControllerProps<T, TName, TTransformed> {
    control: NonNullable<UseControllerProps<T, TName, TTransformed>['control']>
    label: string
    className?: string
    textareaClassName?: string
    labelClassName?: string
}
