/** Matches a complete decimal number ("12", "-3", "1.5", ".5"); comma is accepted as a decimal separator. */
const COMPLETE_NUMBER = /^-?(\d+\.?\d*|\.\d+)$/

/**
 * Classifies a NumberField draft. The field is a text input so the raw text is
 * always observable: '' clears the field to null, a complete number is
 * committed, and anything else ("-", "1e", "abc") is `'pending'`, which the
 * field stores as NaN so the form is invalid until the text is finished.
 */
export function parseNumberDraft(raw: string): number | null | 'pending' {
    const text = raw.trim().replace(',', '.')
    if (text === '') return null
    if (!COMPLETE_NUMBER.test(text)) return 'pending'
    return Number(text)
}

/** The form-state value for a draft: NaN while pending so the form is invalid until the text is finished. */
export function commitNumberDraft(raw: string): number | null {
    const parsed = parseNumberDraft(raw)
    return parsed === 'pending' ? Number.NaN : parsed
}

/**
 * Whether a typed draft still corresponds to the form value. When it does not,
 * the value was changed externally (reset, setValue) and the draft must yield
 * to it instead of hiding it and writing itself back on blur.
 */
export function draftMatchesValue(raw: string, value: unknown): boolean {
    return Object.is(commitNumberDraft(raw), value)
}

/** On blur an unfinished draft is a cleared field; the schema decides whether that is an error. */
export function settleNumberDraft(raw: string): number | null {
    const parsed = parseNumberDraft(raw)
    return parsed === 'pending' ? null : parsed
}
