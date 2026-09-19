'use client'

import { useEffect, useMemo, useState } from 'react'
import { useIsMountedRef } from './use-is-mounted-ref'

/**
 * Open / closed state for a dialog, popover or sheet with no payload (see `useDrawer` when the content depends on
 * what opened it). `initialOpeningDelay` opens it on its own that many ms after mount. Every setter is a no-op once
 * the owner has unmounted, so async callbacks (a save that finishes after dismissal) can call them freely.
 */
export function useIsOpen(initiallyOpen: boolean | (() => boolean) = false, initialOpeningDelay?: number) {
    const [isOpen, setIsOpen] = useState(initiallyOpen)
    const isMounted = useIsMountedRef()

    useEffect(() => {
        if (initialOpeningDelay !== undefined) {
            const timeout = setTimeout(() => {
                if (isMounted.current) {
                    setIsOpen(true)
                }
            }, initialOpeningDelay)
            return () => clearTimeout(timeout)
        }
    }, [initialOpeningDelay, isMounted])

    return [
        isOpen,
        useMemo(
            () => ({
                open: () => {
                    if (isMounted.current) {
                        setIsOpen(true)
                    }
                },
                close: () => {
                    if (isMounted.current) {
                        setIsOpen(false)
                    }
                },
                toggle: () => {
                    if (isMounted.current) {
                        setIsOpen((old) => !old)
                    }
                },
                setState: (fnOrState: boolean | ((old: boolean) => boolean)) => {
                    if (isMounted.current) {
                        setIsOpen(fnOrState)
                    }
                },
                onOpenChange: (isOpen: boolean) => {
                    if (isMounted.current) {
                        setIsOpen(isOpen)
                    }
                },
            }),
            [isMounted],
        ),
    ] as const
}

export type UseIsOpenActions = ReturnType<typeof useIsOpen>[1]
