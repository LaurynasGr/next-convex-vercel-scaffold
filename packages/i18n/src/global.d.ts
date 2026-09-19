import type { Locale } from './locales'
import type messages from './translations/en'

declare module 'next-intl' {
    interface AppConfig {
        Locale: Locale
        Messages: typeof messages
    }
}
