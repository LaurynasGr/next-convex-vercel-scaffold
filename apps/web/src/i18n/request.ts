import {
    DEFAULT_TIMEZONE,
    getRequestConfig,
    LOCALE_COOKIE_NAME,
    parseLocale,
    parseTimeZone,
    TIMEZONE_COOKIE_NAME,
} from '@scaffold/i18n/server'
import { cookies } from 'next/headers'

/**
 * The language comes from the cookie the header's toggle sets, the time zone from the one the browser sets
 * (`TimeZoneCookie`). Cached content (`'use cache'`) cannot read cookies, so it asks for its translations with an
 * explicit locale, which arrives here as `locale` and skips both cookies (it only translates, never formats times).
 */
export default getRequestConfig(async ({ locale: explicit }) => {
    if (explicit !== undefined) {
        const locale = parseLocale(explicit)
        return {
            locale,
            timeZone: DEFAULT_TIMEZONE,
            messages: (await import(`@scaffold/i18n/translations/${locale}`)).default,
        }
    }
    const cookieStore = await cookies()
    const locale = parseLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value)
    return {
        locale,
        timeZone: parseTimeZone(cookieStore.get(TIMEZONE_COOKIE_NAME)?.value),
        messages: (await import(`@scaffold/i18n/translations/${locale}`)).default,
    }
})
