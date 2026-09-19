'use client'

import { useTranslations } from '@scaffold/i18n'
import { cn } from '@scaffold/ui/lib/utils'
import { Loader2Icon } from 'lucide-react'
import { Dialog as DialogPrimitive } from 'radix-ui'
import type { RefObject } from 'react'

/**
 * Translucent cover with a spinner for a `relative` container whose content is busy (a submitting form, a dialog
 * running its action): the content keeps its place and size instead of growing a spinner, and cannot be clicked
 * while covered. Render it last in the container so it paints on top; mark the container `aria-busy`.
 *
 * With `fullScreen` it covers the whole viewport instead, for work the user has to wait for before doing anything
 * else (generating and sending a document). That variant is a modal dialog that cannot be dismissed: the page
 * behind it is inert for the keyboard and assistive technology too, focus moves onto the message and goes to
 * `returnFocusTo` (the button that started the work) once the cover goes, and the message is written out, since
 * there is no busy content to look at.
 */
export function LoadingOverlay({ label, className, fullScreen = false, returnFocusTo }: LoadingOverlayProps) {
    const t = useTranslations('global')
    const text = label ?? t('working')
    if (!fullScreen) {
        return (
            <div
                role="status"
                aria-label={text}
                className={cn('absolute inset-0 flex items-center justify-center bg-background/60', className)}
            >
                <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
            </div>
        )
    }
    return (
        <DialogPrimitive.Root open modal>
            <DialogPrimitive.Portal>
                {/* The wash stays light so the page remains readable; the card keeps the message legible on top of it. */}
                <DialogPrimitive.Overlay className={cn('fixed inset-0 z-50 bg-background/60', className)} />
                <DialogPrimitive.Content
                    aria-busy
                    aria-describedby={undefined}
                    // A modal dialog would hand focus to its trigger, which this one has none of; the opener is
                    // named explicitly because it was disabled while the cover was up, which had already moved
                    // focus off it by the time the cover opened. It is enabled again by the time the cover closes.
                    onCloseAutoFocus={(event) => {
                        event.preventDefault()
                        const target = returnFocusTo?.current
                        if (target?.isConnected) {
                            target.focus()
                        }
                    }}
                    onEscapeKeyDown={(event) => event.preventDefault()}
                    onPointerDownOutside={(event) => event.preventDefault()}
                    onInteractOutside={(event) => event.preventDefault()}
                    className="fixed top-1/2 left-1/2 z-50 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-lg border bg-card px-5 py-4 text-card-foreground shadow-lg outline-none"
                >
                    <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
                    <DialogPrimitive.Title className="text-sm font-normal">{text}</DialogPrimitive.Title>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    )
}

export interface LoadingOverlayProps {
    /** What is going on: read out for assistive technology, and written out next to the spinner when full screen. */
    label?: string
    /** E.g. the container's border radius so the cover follows its corners; the wash's classes when full screen. */
    className?: string
    /** Cover the whole viewport rather than the containing element. */
    fullScreen?: boolean
    /** Full screen only: what gets focus back when the cover goes, i.e. the button that started the work. */
    returnFocusTo?: RefObject<HTMLElement | null>
}
