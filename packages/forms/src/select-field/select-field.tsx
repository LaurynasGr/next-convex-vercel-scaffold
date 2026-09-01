'use client'

import { Label } from '@scaffold/ui/components/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@scaffold/ui/components/select'
import { cn } from '@scaffold/ui/lib/utils'
import { useId } from 'react'
import { type FieldPathByValue, type FieldValues, type UseControllerProps, useController } from 'react-hook-form'
import { FieldError, visibleFieldError } from '../field-error/field-error'

export function SelectField<T extends FieldValues, TName extends FieldPathByValue<T, string>, TTransformed = T>({
    control,
    name,
    rules,
    defaultValue,
    disabled,
    shouldUnregister,
    label,
    options,
    placeholder,
    className,
    triggerClassName,
    labelClassName,
}: SelectFieldProps<T, TName, TTransformed>) {
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

    return (
        <div className={cn('space-y-1.5', className)}>
            <Label htmlFor={autoId} className={labelClassName}>
                {label}
            </Label>
            <Select
                name={field.name}
                value={field.value ?? ''}
                onValueChange={field.onChange}
                disabled={field.disabled}
                onOpenChange={(open) => {
                    if (!open) field.onBlur()
                }}
            >
                <SelectTrigger
                    id={autoId}
                    ref={field.ref}
                    className={cn('w-full', triggerClassName)}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? `${autoId}-error` : undefined}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <FieldError id={`${autoId}-error`} message={error?.message} />
        </div>
    )
}

interface SelectFieldProps<T extends FieldValues, TName extends FieldPathByValue<T, string>, TTransformed = T>
    extends UseControllerProps<T, TName, TTransformed> {
    control: NonNullable<UseControllerProps<T, TName, TTransformed>['control']>
    label: string
    options: { value: string; label: string }[]
    placeholder?: string
    className?: string
    triggerClassName?: string
    labelClassName?: string
}
