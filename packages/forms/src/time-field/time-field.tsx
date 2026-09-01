'use client'

import { parseTime, type Time } from '@internationalized/date'
import { cn } from '@scaffold/ui/lib/utils'
import { Clock } from 'lucide-react'
import { useId } from 'react'
import {
    Button as AriaButton,
    Label as AriaLabel,
    TimeField as AriaTimeField,
    DateInput,
    DateSegment,
    Dialog,
    DialogTrigger,
    Group,
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

function toTime(value: string | undefined): Time | null {
    if (!value) return null
    try {
        return parseTime(value)
    } catch {
        return null
    }
}

const pad = (n: number) => String(n).padStart(2, '0')

// 15-minute steps for the quick picker; the segments allow any minute.
const TIME_OPTIONS = Array.from({ length: 96 }, (_, i) => `${pad(Math.floor(i / 4))}:${pad((i % 4) * 15)}`)

// Centers the selected option in the list when the popover opens.
const scrollToSelected = (el: HTMLButtonElement | null) => {
    const list = el?.parentElement
    if (!el || !list) return
    list.scrollTop = el.offsetTop - list.clientHeight / 2 + el.clientHeight / 2
}

export function TimeField<T extends FieldValues, TName extends FieldPathByValue<T, string>, TTransformed = T>({
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
}: TimeFieldProps<T, TName, TTransformed>) {
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
        <AriaTimeField
            hourCycle={24}
            shouldForceLeadingZeros
            value={toTime(field.value)}
            onChange={(time) => field.onChange(time ? `${pad(time.hour)}:${pad(time.minute)}` : '')}
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
                <DialogTrigger>
                    <AriaButton aria-label="Choose a time" className={ariaFieldIconButtonClass}>
                        <Clock className="size-4" />
                    </AriaButton>
                    <Popover className={ariaPopoverClass}>
                        <Dialog className="outline-none">
                            {({ close }) => (
                                <div className="scrollbar-thin max-h-64 w-24 overflow-y-auto p-1">
                                    {TIME_OPTIONS.map((time) => (
                                        <button
                                            key={time}
                                            type="button"
                                            ref={field.value === time ? scrollToSelected : undefined}
                                            onClick={() => {
                                                field.onChange(time)
                                                close()
                                            }}
                                            className={cn(
                                                'w-full rounded-sm px-2 py-1 text-center text-sm tabular-nums transition-colors hover:bg-accent',
                                                field.value === time &&
                                                    'bg-primary text-primary-foreground hover:bg-primary',
                                            )}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </Dialog>
                    </Popover>
                </DialogTrigger>
            </Group>
            <FieldError id={errorId} message={error?.message} />
        </AriaTimeField>
    )
}

interface TimeFieldProps<T extends FieldValues, TName extends FieldPathByValue<T, string>, TTransformed = T>
    extends UseControllerProps<T, TName, TTransformed> {
    control: NonNullable<UseControllerProps<T, TName, TTransformed>['control']>
    label: string
    className?: string
    inputClassName?: string
    labelClassName?: string
}
