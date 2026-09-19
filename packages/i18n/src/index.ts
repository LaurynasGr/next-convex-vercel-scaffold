/// <reference path="./global.d.ts" />

import { NextIntlClientProvider, useFormatter, useLocale, useMessages } from 'next-intl'
import { useTranslationsOverride as useTranslations } from './client/overrides'

export type * from 'next-intl'
export * from './client/components'
// Named on purpose: next-intl also exports a `Locale` (ours, through the AppConfig augmentation).
export { DEFAULT_LOCALE, LOCALE_COOKIE_MAX_AGE, LOCALE_COOKIE_NAME, LOCALES, type Locale, parseLocale } from './locales'
export { DEFAULT_TIMEZONE, parseTimeZone, TIMEZONE_COOKIE_MAX_AGE, TIMEZONE_COOKIE_NAME } from './time-zone'
export { NextIntlClientProvider, useFormatter, useLocale, useMessages, useTranslations }

// biome-ignore lint/suspicious/noExplicitAny: generic parameter must be any
export type TopKeys<T extends (key: any) => unknown> = Parameters<T>[0] extends infer K extends string
    ? K extends `${infer Top}.${string}`
        ? Top
        : K
    : never
