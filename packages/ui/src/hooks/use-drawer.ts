'use client'

import { useMemo, useRef, useState } from 'react'
import { useIsMountedRef } from './use-is-mounted-ref'

/**
 * How long the payload outlives `close()`, so the content does not blank out during the exit animation: the longest
 * one among the components this serves (`SheetContent` slides out in 300 ms, `DialogContent` fades in 200).
 */
const CLOSE_ANIMATION_MS = 300

/**
 * Open state plus an optional payload for a dialog / drawer / sheet: `open(item)` for an edit flow, `open()` for a
 * create flow. Spread `onOpenChange` into the Radix component and read `data` in the content. `key` changes on
 * every `open()`: put it on the content (a form) so each opening mounts a fresh instance, and one left over from a
 * dismissed opening unmounts instead of receiving the result of a request it started.
 */
export function useDrawer<Data>() {
    const isMounted = useIsMountedRef()
    const [isOpen, setIsOpen] = useState(false)
    const [key, setKey] = useState(0)
    const [data, setData] = useState<Data | undefined>(undefined)
    const resetTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

    const actions = useMemo(() => {
        const set = (next: Data | undefined) => {
            clearTimeout(resetTimeout.current)
            if (isMounted.current) setData(next)
        }
        const resetLater = () => {
            clearTimeout(resetTimeout.current)
            resetTimeout.current = setTimeout(() => {
                if (isMounted.current) setData(undefined)
            }, CLOSE_ANIMATION_MS)
        }
        const setOpen = (open: boolean) => {
            if (!isMounted.current) return
            if (!open) resetLater()
            setIsOpen(open)
        }
        return {
            open: (next?: Data) => {
                set(next)
                if (isMounted.current) setKey((current) => current + 1)
                setOpen(true)
            },
            setData: set,
            close: () => setOpen(false),
            onOpenChange: setOpen,
        }
    }, [isMounted])

    return [isOpen, actions, data, key] as const
}

export type UseDrawerActions<Data> = ReturnType<typeof useDrawer<Data>>[1]
