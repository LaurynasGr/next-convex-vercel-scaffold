/// <reference path="./global.d.ts" />

import { getTranslations as _getTranslations, getLocale, getMessages, getRequestConfig } from 'next-intl/server'
import { overrideWithRichValues } from './default-rich-values'

const getTranslations = ((...args: Parameters<typeof _getTranslations>) =>
    _getTranslations(...args).then(overrideWithRichValues)) as typeof _getTranslations

// Needed for types to work properly without importing `@scaffold/i18n` somewhere in the app.
export type * from 'next-intl'
// Named on purpose: next-intl also exports a `Locale` (ours, through the AppConfig augmentation).
export { DEFAULT_LOCALE, LOCALE_COOKIE_MAX_AGE, LOCALE_COOKIE_NAME, LOCALES, type Locale, parseLocale } from './locales'
export { DEFAULT_TIMEZONE, parseTimeZone, TIMEZONE_COOKIE_MAX_AGE, TIMEZONE_COOKIE_NAME } from './time-zone'
export { getLocale, getMessages, getRequestConfig, getTranslations }
