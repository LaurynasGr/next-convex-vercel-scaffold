import { type TranslateKey, useTranslations } from '@scaffold/i18n'

/**
 * A field's label: either the text itself (`label`, usually from the page's own namespace) or the key of a shared
 * one under `global` (`labelKey`), so a parent does not need its own `useTranslations('global')` for it.
 */
export type FieldLabelProps = { label: string; labelKey?: never } | { label?: never; labelKey: TranslateKey<'global'> }

export function useFieldLabel({ label, labelKey }: UseFieldLabelParams): string {
    const t = useTranslations('global')
    if (labelKey !== undefined) return t(labelKey)
    if (label !== undefined) return label
    // Unreachable through `FieldLabelProps`, which requires one of the two.
    throw new Error('A field needs a label or a labelKey')
}

interface UseFieldLabelParams {
    label: string | undefined
    labelKey: TranslateKey<'global'> | undefined
}
