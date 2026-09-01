/**
 * Compile-time only (no runtime, not picked up by `bun test`): every field must
 * accept a `control` from `useForm<z.input<S>, unknown, z.output<S>>`, i.e. a
 * form whose parsed output differs from its input, and must reject fields of
 * the wrong value type.
 */
import { optionalNumber, optionalString, requiredNumber } from '@scaffold/core'
import type { Control } from 'react-hook-form'
import { z } from 'zod'
import { CheckboxField, DateField, InputField, NumberField, SelectField, TextareaField, TimeField } from './index'

const Schema = z.object({
    name: z.string().trim().min(1),
    website: optionalString(z.url()),
    notes: optionalString(z.string()),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    time: optionalString(z.string()),
    rate: requiredNumber('Enter a rate', z.number().positive()),
    discount: optionalNumber(z.number()),
    currency: z.enum(['EUR', 'USD']),
    active: z.boolean(),
})
type In = z.input<typeof Schema>
type Out = z.output<typeof Schema>

declare const control: Control<In, unknown, Out>

export const fixture = (
    <>
        <InputField control={control} name="name" label="Name" />
        <InputField control={control} name="website" label="Website" type="url" />
        <TextareaField control={control} name="notes" label="Notes" />
        <DateField control={control} name="date" label="Date" />
        <TimeField control={control} name="time" label="Time" />
        <NumberField control={control} name="rate" label="Rate" />
        <NumberField control={control} name="discount" label="Discount" />
        <SelectField control={control} name="currency" label="Currency" options={[]} />
        <CheckboxField control={control} name="active" label="Active" />
        {/* @ts-expect-error a number path is not a text field */}
        <InputField control={control} name="rate" label="Rate" />
        {/* @ts-expect-error a text path is not a number field */}
        <NumberField control={control} name="name" label="Name" />
        {/* @ts-expect-error a text path is not a checkbox */}
        <CheckboxField control={control} name="name" label="Name" />
    </>
)
