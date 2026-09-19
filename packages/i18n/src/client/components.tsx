'use client'

import type { createTranslator, Messages, NamespaceKeys, NestedKeyOf } from 'next-intl'
import { useTranslationsOverride } from './overrides'

/** A translated string as an element, for places that take a node but sit outside a component (column headers). */
export function Translate<NS extends NamespaceKey = 'global'>({ namespace, value, vars }: TranslateProps<NS>) {
    const t = useTranslationsOverride(namespace ?? 'global')
    // @ts-expect-error - The type of `value` is correctly inferred, but TypeScript is not able to verify it due to the complexity of the types involved in `createTranslator`.
    return t(value, vars)
}

export type TranslateFn<NS extends NamespaceKey> = ReturnType<typeof createTranslator<Messages, NS>>

export type TranslateKey<NS extends NamespaceKey> = Parameters<TranslateFn<NS>>[0]

export interface TranslateProps<NS extends NamespaceKey> {
    namespace?: NS
    value: TranslateKey<NS>
    vars?: Parameters<TranslateFn<NS>>[1]
}

export type NamespaceKey = NamespaceKeys<Messages, NestedKeyOf<Messages>>

export type TranslatePair = {
    [NS in NamespaceKey]: {
        namespace: NS
        value: TranslateKey<NS>
    }
}[NamespaceKey]
