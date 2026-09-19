'use client'

import { useTranslations } from '@scaffold/i18n'
import { Button } from '@scaffold/ui/components/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@scaffold/ui/components/dropdown-menu'
import { EllipsisIcon } from 'lucide-react'
import type { ReactNode, Ref } from 'react'

/**
 * The "…" button at the end of a table row with its menu; `children` are `DropdownMenuItem`s. An item that needs a
 * confirmation opens a controlled `ConfirmDialog` from `onSelect` (rendered next to the menu, not inside it, so the
 * menu can close underneath it) and hands it `ref`, the button, as `returnFocusTo`.
 */
export function RowActionsMenu({ ref, label, children }: RowActionsMenuProps) {
    const t = useTranslations('global')
    const name = label ?? t('actions')
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button ref={ref} variant="ghost" size="icon-sm" title={name} aria-label={name}>
                    <EllipsisIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">{children}</DropdownMenuContent>
        </DropdownMenu>
    )
}

interface RowActionsMenuProps {
    /** The "…" button, for a dialog opened from the menu to return focus to. */
    ref?: Ref<HTMLButtonElement>
    /** Accessible name of the button; defaults to the shared "Actions". */
    label?: string
    children: ReactNode
}
