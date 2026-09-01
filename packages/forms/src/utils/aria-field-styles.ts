import { cn } from '@scaffold/ui/lib/utils'

// Shared styling for the react-aria based DateField/TimeField form fields,
// matching the shadcn Input/Label/Popover look.

export const ariaFieldLabelClass = 'flex items-center gap-2 text-sm leading-none font-medium select-none'

export const ariaFieldContainerClass = cn(
    'dark:bg-input/30 border-input flex h-9 w-full min-w-0 items-center rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] md:text-sm',
    'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
)

export const ariaFieldInvalidClass = 'border-destructive ring-destructive/20 dark:ring-destructive/40'

export const ariaSegmentClass =
    'rounded px-0.5 tabular-nums outline-none data-placeholder:text-muted-foreground data-focused:bg-primary data-focused:text-primary-foreground'

export const ariaFieldIconButtonClass =
    'ml-auto flex size-6 shrink-0 items-center justify-center rounded-sm text-muted-foreground outline-none transition-colors data-hovered:bg-accent data-hovered:text-foreground data-focus-visible:ring-2 data-focus-visible:ring-ring'

export const ariaPopoverClass = cn(
    'rounded-md border bg-popover text-popover-foreground shadow-md',
    'data-entering:animate-in data-entering:fade-in-0 data-entering:zoom-in-95 data-exiting:animate-out data-exiting:fade-out-0 data-exiting:zoom-out-95',
)
