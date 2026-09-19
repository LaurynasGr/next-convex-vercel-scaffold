'use client'

import { useTranslations } from '@scaffold/i18n'
import { LoadingOverlay } from '@scaffold/ui/layouts/loading-overlay'
import type { ReactNode } from 'react'
import type { z } from 'zod'
import type { SaveFormState } from './use-save-form'

/** The `<form>` for a `useSaveForm`: its fields stacked, covered by a loading overlay while the save is in flight. */
export function SaveForm({ onSubmit, saving, savingLabel, children }: SaveFormProps) {
    const t = useTranslations('global')
    return (
        <form onSubmit={onSubmit} noValidate aria-busy={saving || undefined} className="relative flex flex-col gap-4">
            {children}
            {saving && <LoadingOverlay label={savingLabel ?? t('saving')} className="-m-2 rounded-lg" />}
        </form>
    )
}

interface SaveFormProps extends Pick<SaveFormState<z.ZodRawShape>, 'onSubmit' | 'saving'> {
    /** What the overlay announces while saving, when the save is more than a save ("Checking the servers…"). */
    savingLabel?: string
    children: ReactNode
}
