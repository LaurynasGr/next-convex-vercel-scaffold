import { useTranslations as _useTranslations } from 'next-intl'
import { overrideWithRichValues } from '../default-rich-values'

export const useTranslationsOverride = ((...args: Parameters<typeof _useTranslations>) => {
    return overrideWithRichValues(_useTranslations(...args))
}) as typeof _useTranslations
