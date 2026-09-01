import type { ControllerFieldState } from 'react-hook-form'

/** Returns the field's error only once the field has been touched (or the form submitted). */
export function visibleFieldError(fieldState: ControllerFieldState, formState: { isSubmitted: boolean }) {
    return fieldState.error && (fieldState.isTouched || formState.isSubmitted) ? fieldState.error : undefined
}

export function FieldError({ id, message }: FieldErrorProps) {
    if (!message) return null
    return (
        <p id={id} role="alert" className="text-xs font-medium text-destructive">
            {message}
        </p>
    )
}

interface FieldErrorProps {
    id?: string
    message?: string
}
