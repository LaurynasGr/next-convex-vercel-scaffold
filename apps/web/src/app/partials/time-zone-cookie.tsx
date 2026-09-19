'use client'

import { TIMEZONE_COOKIE_MAX_AGE, TIMEZONE_COOKIE_NAME } from '@scaffold/i18n'
import { useEffect } from 'react'

/** Tells the server the browser's time zone (a cookie), so server-rendered timestamps match the browser's. */
export function TimeZoneCookie() {
    useEffect(() => {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
        // biome-ignore lint/suspicious/noDocumentCookie: one plain cookie write; the Cookie Store API is still missing in some browsers.
        document.cookie = `${TIMEZONE_COOKIE_NAME}=${timeZone}; path=/; max-age=${TIMEZONE_COOKIE_MAX_AGE}; SameSite=Lax`
    }, [])
    return null
}
