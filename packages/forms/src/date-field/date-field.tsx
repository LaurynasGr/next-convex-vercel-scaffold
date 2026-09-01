'use client'

import { type CalendarDate, parseDate } from '@internationalized/date'
import { cn } from '@scaffold/ui/lib/utils'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { useId } from 'react'
import {
    Button as AriaButton,
    DatePicker as AriaDatePicker,
    Label as AriaLabel,
    Calendar,
    CalendarCell,
    CalendarGrid,
    CalendarGridBody,
    CalendarGridHeader,
    CalendarHeaderCell,
    DateInput,
    DateSegment,
    Dialog,
    Group,
    Heading,
    Popover,
} from 'react-aria-components'
import { type FieldPathByValue, type FieldValues, type UseControllerProps, useController } from 'react-hook-form'
import { FieldError, visibleFieldError } from '../field-error/field-error'
import {
    ariaFieldContainerClass,
    ariaFieldIconButtonClass,
    ariaFieldInvalidClass,
    ariaFieldLabelClass,
    ariaPopoverClass,
    ariaSegmentClass,
} from '../utils/aria-field-styles'
import { segmentFocusRef } from '../utils/segment-focus-ref'

function toDate(value: string | undefined): CalendarDate | null {
    if (!value) return null
    try {
        return parseDate(value)
    } catch {
        return null
    }
}

export function DateField<T extends FieldValues, TName extends FieldPathByValue<T, string>, TTransformed = T>({
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
}: DateFieldProps<T, TName, TTransformed>) {
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
        <AriaDatePicker
            shouldForceLeadingZeros
            value={toDate(field.value)}
            onChange={(date) => field.onChange(date ? date.toString() : '')}
            onBlur={field.onBlur}
            isDisabled={field.disabled}
            isInvalid={!!error}
            className={cn('space-y-1.5', className)}
        >
            <AriaLabel className={cn(ariaFieldLabelClass, labelClassName)}>{label}</AriaLabel>
            <Group
                aria-describedby={error ? errorId : undefined}
                className={cn(ariaFieldContainerClass, 'gap-1 pr-1.5', error && ariaFieldInvalidClass, inputClassName)}
            >
                <DateInput ref={segmentFocusRef(field.ref)} className="flex flex-1 items-center">
                    {(segment) => <DateSegment segment={segment} className={ariaSegmentClass} />}
                </DateInput>
                <AriaButton aria-label="Open calendar" className={ariaFieldIconButtonClass}>
                    <CalendarDays className="size-4" />
                </AriaButton>
            </Group>
            <Popover className={ariaPopoverClass}>
                <Dialog className="p-3 outline-none">
                    <Calendar>
                        <header className="flex items-center justify-between pb-2">
                            <AriaButton slot="previous" className={cn(ariaFieldIconButtonClass, 'ml-0 size-7')}>
                                <ChevronLeft className="size-4" />
                            </AriaButton>
                            <Heading className="text-sm font-medium" />
                            <AriaButton slot="next" className={cn(ariaFieldIconButtonClass, 'ml-0 size-7')}>
                                <ChevronRight className="size-4" />
                            </AriaButton>
                        </header>
                        <CalendarGrid className="border-separate border-spacing-0.5">
                            <CalendarGridHeader>
                                {(day) => (
                                    <CalendarHeaderCell className="size-8 text-xs font-normal text-muted-foreground">
                                        {day}
                                    </CalendarHeaderCell>
                                )}
                            </CalendarGridHeader>
                            <CalendarGridBody>
                                {(date) => (
                                    <CalendarCell
                                        date={date}
                                        className={cn(
                                            'flex size-8 items-center justify-center rounded-md text-sm outline-none transition-colors',
                                            'data-hovered:bg-accent data-selected:bg-primary data-selected:text-primary-foreground',
                                            'data-outside-month:hidden data-disabled:opacity-50',
                                            'data-focus-visible:ring-2 data-focus-visible:ring-ring',
                                        )}
                                    />
                                )}
                            </CalendarGridBody>
                        </CalendarGrid>
                    </Calendar>
                </Dialog>
            </Popover>
            <FieldError id={errorId} message={error?.message} />
        </AriaDatePicker>
    )
}

interface DateFieldProps<T extends FieldValues, TName extends FieldPathByValue<T, string>, TTransformed = T>
    extends UseControllerProps<T, TName, TTransformed> {
    control: NonNullable<UseControllerProps<T, TName, TTransformed>['control']>
    label: string
    className?: string
    inputClassName?: string
    labelClassName?: string
}
