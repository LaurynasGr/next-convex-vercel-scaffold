'use client'

import { useTranslations } from '@scaffold/i18n'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@scaffold/ui/components/alert-dialog'
import { useIsMountedRef, useIsOpen } from '@scaffold/ui/hooks'
import { LoadingOverlay } from '@scaffold/ui/layouts/loading-overlay'
import { type MouseEvent, type ReactElement, type ReactNode, type RefObject, useRef, useState } from 'react'

/**
 * "Are you sure?" step in front of an action that is hard to undo: `trigger` opens it (or, opened from somewhere
 * the trigger cannot sit, a menu item say, the caller owns `open` / `onOpenChange` and names in `returnFocusTo`
 * the element focus goes back to), the confirm button runs `onConfirm` and the dialog closes once that settles; it
 * cannot be dismissed in between. `onConfirm` reports its own outcome (a toast); a rejection is logged and still
 * closes the dialog, so the caller's error toast is what the user sees. When the action removed the element focus
 * would return to (a deleted row's button), focus goes instead to the nearest `[tabindex]` ancestor it had that is
 * still on the page (a `DataTable`, or the page's `main` once the last row took the table with it), recorded
 * before the action runs.
 */
export function ConfirmDialog({
    trigger,
    open: controlledOpen,
    onOpenChange,
    returnFocusTo,
    title,
    description,
    confirmLabel,
    cancelLabel,
    destructive = false,
    onConfirm,
}: ConfirmDialogProps) {
    const t = useTranslations('global')
    const [ownOpen, ownActions] = useIsOpen()
    const open = controlledOpen ?? ownOpen
    const setOpen = onOpenChange ?? ownActions.onOpenChange
    const [pending, setPending] = useState(false)
    const isMounted = useIsMountedRef()
    const triggerRef = useRef<HTMLButtonElement>(null)
    const returnTarget = returnFocusTo ?? triggerRef
    const focusFallbacks = useRef<HTMLElement[]>([])

    const confirm = async (event: MouseEvent<HTMLButtonElement>) => {
        // The action button closes the dialog on click by default; hold it open until the work is done instead.
        event.preventDefault()
        // Looked up now: once the action has removed the target, `closest` could only walk its detached subtree.
        focusFallbacks.current = focusableAncestors(returnTarget.current)
        setPending(true)
        try {
            await onConfirm()
        } catch (error) {
            // The caller has already told the user; this only keeps it from surfacing as an unhandled rejection.
            console.error('ConfirmDialog: onConfirm rejected', error)
        } finally {
            if (isMounted.current) {
                setPending(false)
                setOpen(false)
            }
        }
    }

    return (
        <AlertDialog
            open={open}
            onOpenChange={(next) => {
                // Escape and outside clicks must not dismiss a dialog whose action is still running.
                if (!next && pending) return
                setOpen(next)
            }}
        >
            {trigger !== undefined && (
                <AlertDialogTrigger ref={triggerRef} asChild>
                    {trigger}
                </AlertDialogTrigger>
            )}
            <AlertDialogContent
                aria-busy={pending || undefined}
                onCloseAutoFocus={(event) => {
                    // Radix would return focus to whatever had it when the dialog opened, which for a dialog opened
                    // from a menu is nothing useful (the menu item is gone by then): return it ourselves.
                    event.preventDefault()
                    const target = returnTarget.current?.isConnected
                        ? returnTarget.current
                        : // The nearest one may be gone too (the table, once its last row went); take the first that is not.
                          focusFallbacks.current.find((element) => element.isConnected)
                    target?.focus()
                }}
            >
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={pending}>{cancelLabel ?? t('cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                        variant={destructive ? 'destructive' : 'default'}
                        disabled={pending}
                        onClick={confirm}
                    >
                        {confirmLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
                {pending && <LoadingOverlay className="rounded-lg" />}
            </AlertDialogContent>
        </AlertDialog>
    )
}

/** Either the dialog opens itself from `trigger`, or the caller opens it (from a menu item, say). */
type ConfirmDialogOpener =
    | {
          /** The button (or other element) that opens the dialog; it receives the trigger props. */
          trigger: ReactElement
          open?: never
          onOpenChange?: never
          returnFocusTo?: never
      }
    | {
          trigger?: never
          open: boolean
          onOpenChange: (open: boolean) => void
          /** What gets focus back when the dialog closes: the button of the menu the dialog was opened from. */
          returnFocusTo: RefObject<HTMLElement | null>
      }

export type ConfirmDialogProps = ConfirmDialogOpener & {
    title: ReactNode
    description: ReactNode
    /** Label of the confirm button, naming the action ("Disconnect", "Delete client"). */
    confirmLabel: ReactNode
    cancelLabel?: ReactNode
    /** Style the confirm button as destructive. */
    destructive?: boolean
    /** The action itself; the dialog stays open, with both buttons disabled under a loading overlay, until it settles. */
    onConfirm: () => Promise<void> | void
}

/** Every `[tabindex]` ancestor of `element`, nearest first. */
function focusableAncestors(element: HTMLElement | null): HTMLElement[] {
    const ancestors: HTMLElement[] = []
    let current = element?.parentElement?.closest<HTMLElement>('[tabindex]') ?? null
    while (current) {
        ancestors.push(current)
        current = current.parentElement?.closest<HTMLElement>('[tabindex]') ?? null
    }
    return ancestors
}
