'use client'

import { useSyncExternalStore } from 'react'

/** Below Tailwind's `md` breakpoint. */
const MOBILE_MAX_WIDTH = 767

function subscribe(onChange: () => void) {
    const query = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
}

/** True on viewports below `md`; false during SSR and hydration, so server markup is the desktop variant. */
export function useIsMobile() {
    return useSyncExternalStore(
        subscribe,
        () => window.innerWidth <= MOBILE_MAX_WIDTH,
        () => false,
    )
}
