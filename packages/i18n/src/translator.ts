/// <reference path="./global.d.ts" />

import { createTranslator, type Messages, type NamespaceKeys, type NestedKeyOf } from 'next-intl'
import type { Locale } from './locales'
import en from './translations/en'
import lt from './translations/lt'

const MESSAGES = { en, lt } satisfies Record<Locale, Messages>

/**
 * A translator for code that runs outside React and outside a request (a Convex action writing an email): the
 * messages of `locale`, scoped to `namespace`, with the same typed keys `useTranslations` has.
 */
export function getStaticTranslator<Namespace extends NamespaceKeys<Messages, NestedKeyOf<Messages>>>(
    locale: Locale,
    namespace: Namespace,
) {
    return createTranslator({ locale, messages: MESSAGES[locale], namespace })
}
