'use server'

import { LOCALE_COOKIE_MAX_AGE, LOCALE_COOKIE_NAME, type Locale, parseLocale } from '@scaffold/i18n/server'
import { cookies } from 'next/headers'

/** Stores the chosen language; Next re-renders the current page with the new cookie once the action returns. */
export async function setLocale(locale: Locale): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.set(LOCALE_COOKIE_NAME, parseLocale(locale), {
        path: '/',
        maxAge: LOCALE_COOKIE_MAX_AGE,
        sameSite: 'lax',
    })
}
