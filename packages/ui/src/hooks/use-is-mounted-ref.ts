'use client'

import { useLayoutEffect, useRef } from 'react'

/**
 * Ref that is true between mount and unmount; lets async callbacks skip work on an unmounted component. A layout
 * effect so the flag flips synchronously in the commit that removes the component, not in the deferred passive
 * phase, closing the gap where a promise settling right after removal would still see `true`.
 */
export function useIsMountedRef() {
    const isMounted = useRef(false)
    useLayoutEffect(() => {
        isMounted.current = true
        return () => {
            isMounted.current = false
        }
    }, [])
    return isMounted
}
