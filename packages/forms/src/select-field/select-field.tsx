'use client'

import { useTranslations } from '@scaffold/i18n'
import { Button } from '@scaffold/ui/components/button'
import { Label } from '@scaffold/ui/components/label'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@scaffold/ui/components/select'
import { cn } from '@scaffold/ui/lib/utils'
import { XIcon } from 'lucide-react'
import { useId } from 'react'
import { type FieldPathByValue, type FieldValues, type UseControllerProps, useController } from 'react-hook-form'
import { FieldError, visibleFieldError } from '../field-error/field-error'
import { type FieldLabelProps, useFieldLabel } from '../hooks/use-field-label'

export function SelectField<T extends FieldValues, TName extends FieldPathByValue<T, string>, TTransformed = T>({
    control,
    name,
    rules,
    defaultValue,
    disabled,
    shouldUnregister,
    label: labelProp,
    labelKey,
    options,
    placeholder,
    clearable = false,
    onOpenChange,
    className,
    triggerClassName,
    labelClassName,
}: SelectFieldProps<T, TName, TTransformed>) {
    const label = useFieldLabel({ label: labelProp, labelKey })
    const { field, fieldState, formState } = useController({
        control,
        name,
        rules,
        defaultValue,
        disabled,
        shouldUnregister,
    })
    const t = useTranslations('global')
    const error = visibleFieldError(fieldState, formState)
    const autoId = useId()

    return (
        <div className={cn('space-y-1.5', className)}>
            <Label htmlFor={autoId} className={labelClassName}>
                {label}
            </Label>
            <div className="flex items-center gap-1">
                <Select
                    name={field.name}
                    value={field.value ?? ''}
                    onValueChange={field.onChange}
                    disabled={field.disabled}
                    onOpenChange={(open) => {
                        onOpenChange?.(open)
                        if (!open) field.onBlur()
                    }}
                >
                    <SelectTrigger
                        id={autoId}
                        ref={field.ref}
                        // `min-w-0`: the trigger does not wrap, so a long value would otherwise keep it from shrinking next to the clear button.
                        className={cn('w-full min-w-0', triggerClassName)}
                        aria-invalid={error ? true : undefined}
                        aria-describedby={error ? `${autoId}-error` : undefined}
                    >
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                        {options.filter((option) => option.group === undefined).map(renderOption)}
                        {groupOptions(options).map(({ group, options }) => (
                            <SelectGroup key={group}>
                                <SelectLabel>{group}</SelectLabel>
                                {options.map(renderOption)}
                            </SelectGroup>
                        ))}
                    </SelectContent>
                </Select>
                {clearable && field.value && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={t('clearField', { label })}
                        disabled={field.disabled}
                        onClick={() => {
                            field.onChange('')
                            // Clearing is a finished interaction: mark the field touched so `onTouched` validation shows its error.
                            field.onBlur()
                        }}
                    >
                        <XIcon />
                    </Button>
                )}
            </div>
            <FieldError id={`${autoId}-error`} message={error?.message} />
        </div>
    )
}

type SelectFieldProps<
    T extends FieldValues,
    TName extends FieldPathByValue<T, string>,
    TTransformed = T,
> = UseControllerProps<T, TName, TTransformed> &
    FieldLabelProps & {
        control: NonNullable<UseControllerProps<T, TName, TTransformed>['control']>
        options: SelectFieldOption[]
        placeholder?: string
        /** Fires when the dropdown opens or closes, e.g. to load the options on first open. */
        onOpenChange?: (open: boolean) => void
        /** Show an X next to the trigger that resets the field to '' (Radix selects cannot deselect on their own). */
        clearable?: boolean
        className?: string
        triggerClassName?: string
        labelClassName?: string
    }

export interface SelectFieldOption {
    value: string
    label: string
    /** Shown but not selectable (a "Loading…" row). */
    disabled?: boolean
    /** Options sharing a group render together under that heading, after the ungrouped ones. */
    group?: string
}

function renderOption(option: SelectFieldOption) {
    return (
        <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
        </SelectItem>
    )
}

interface OptionGroup {
    group: string
    options: SelectFieldOption[]
}

/** The named groups in first-appearance order, each with its options in place; ungrouped options are left out. */
function groupOptions(options: SelectFieldOption[]): OptionGroup[] {
    const groups = new Map<string, OptionGroup>()
    for (const option of options) {
        if (option.group === undefined) continue
        const existing = groups.get(option.group)
        if (existing) {
            existing.options.push(option)
        } else {
            groups.set(option.group, { group: option.group, options: [option] })
        }
    }
    return Array.from(groups.values())
}
