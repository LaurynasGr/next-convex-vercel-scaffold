import type { useTranslations } from 'next-intl'
import { createElement, type ReactNode } from 'react'

/** Tags every `t.rich` call can use without declaring them: `<b>`, `<small>` and `<code>`. */
const defaultRichValues = {
    b: (chunks: ReactNode) => createElement('b', null, chunks),
    small: (chunks: ReactNode) => createElement('small', null, chunks),
    code: (chunks: ReactNode) => createElement('code', null, chunks),
}

/** Translators already wrapped: next-intl memoises them across renders, so wrapping again would stack wrappers. */
const overridden = new WeakSet<object>()

export function overrideWithRichValues(t: ReturnType<typeof useTranslations>) {
    if (overridden.has(t)) return t
    // Overriding types here as if we used actual types and tried to expand values with defaults,
    // type resolving takes forever and causes a noticeable TypeScript LSP performance drop.
    const orig = t.rich as (key: string, values?: Record<string, unknown>, format?: unknown) => ReactNode
    const mappedRich: typeof orig = (key, values, format) => orig(key, { ...defaultRichValues, ...values }, format)

    Object.defineProperty(t, 'rich', { value: mappedRich, configurable: true })
    overridden.add(t)
    return t
}
