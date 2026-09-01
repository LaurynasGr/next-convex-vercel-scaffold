import type { ControllerRenderProps, FieldValues } from 'react-hook-form'

/**
 * Adapts a React Aria segmented input (DateInput) to react-hook-form's `field.ref`
 * so `shouldFocusError` and `setFocus` land on the first editable segment.
 */
export function segmentFocusRef(fieldRef: ControllerRenderProps<FieldValues, string>['ref']) {
    return (el: HTMLDivElement | null) => {
        if (!el) return
        fieldRef({
            focus: () => el.querySelector<HTMLElement>('[role="spinbutton"]')?.focus(),
        })
    }
}
