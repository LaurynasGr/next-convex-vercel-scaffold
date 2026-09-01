'use client'

import { cn } from '@scaffold/ui/lib/utils'
import { useId } from 'react'
import { type FieldPathByValue, type FieldValues, type UseControllerProps, useController } from 'react-hook-form'
import { FieldError, visibleFieldError } from '../field-error/field-error'

export function CheckboxField<
    T extends FieldValues,
    TName extends FieldPathByValue<T, boolean | undefined>,
    TTransformed = T,
>({
    control,
    name,
    rules,
    defaultValue,
    disabled,
    shouldUnregister,
    label,
    className,
    inputClassName,
}: CheckboxFieldProps<T, TName, TTransformed>) {
    const { field, fieldState, formState } = useController({
        control,
        name,
        rules,
        defaultValue,
        disabled,
        shouldUnregister,
    })
    const error = visibleFieldError(fieldState, formState)
    const errorId = `${useId()}-error`

    return (
        <div>
            <label className={cn('flex items-center gap-2 text-sm cursor-pointer', className)}>
                <input
                    type="checkbox"
                    name={field.name}
                    ref={field.ref}
                    checked={!!field.value}
                    disabled={field.disabled}
                    onChange={(e) => field.onChange(e.target.checked)}
                    onBlur={field.onBlur}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? errorId : undefined}
                    className={cn('size-4 accent-primary cursor-pointer', inputClassName)}
                />
                {label}
            </label>
            <FieldError id={errorId} message={error?.message} />
        </div>
    )
}

interface CheckboxFieldProps<
    T extends FieldValues,
    TName extends FieldPathByValue<T, boolean | undefined>,
    TTransformed = T,
> extends UseControllerProps<T, TName, TTransformed> {
    control: NonNullable<UseControllerProps<T, TName, TTransformed>['control']>
    label: string
    className?: string
    inputClassName?: string
}
