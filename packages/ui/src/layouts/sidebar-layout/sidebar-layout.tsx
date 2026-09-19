'use client'

import { useTranslations } from '@scaffold/i18n'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@scaffold/ui/components/breadcrumb'
import { Button, type ButtonProps } from '@scaffold/ui/components/button'
import { Separator } from '@scaffold/ui/components/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@scaffold/ui/components/sheet'
import { useIsMobile } from '@scaffold/ui/hooks'
import { PageContainer } from '@scaffold/ui/layouts/page-container'
import { cn } from '@scaffold/ui/lib/utils'
import { type LucideIcon, PanelLeftIcon } from 'lucide-react'
import {
    type ComponentProps,
    cloneElement,
    createContext,
    Fragment,
    type MouseEvent,
    type ReactElement,
    type ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react'
import { SIDEBAR_COOKIE_MAX_AGE, SIDEBAR_COOKIE_NAME, SIDEBAR_KEYBOARD_SHORTCUT } from './constants'

interface SidebarState {
    /** Desktop: whether the sidebar is shown next to the page. */
    open: boolean
    /** Mobile: whether the sidebar sheet is open. */
    openMobile: boolean
    isMobile: boolean
    toggle: () => void
    setOpenMobile: (open: boolean) => void
}

const SidebarContext = createContext<SidebarState | null>(null)

/** State of the enclosing `SidebarLayout`. */
export function useSidebar() {
    const state = useContext(SidebarContext)
    if (!state) throw new Error('useSidebar must be used inside SidebarLayout')
    return state
}

/**
 * Two-column shell for a section with its own navigation: a full-height sidebar on the left, the section's page in
 * a `PageContainer` on the right. `SidebarTrigger` (usually inside `SidebarBreadcrumbs` at the top of the page)
 * slides the sidebar away; on mobile it opens the same content in a sheet instead. The desktop state is kept in a
 * cookie so the server can render the right variant straight away (read it and pass `defaultOpen`).
 */
export function SidebarLayout({ sidebar, children, defaultOpen = true, className }: SidebarLayoutProps) {
    const t = useTranslations('global.sidebar')
    const isMobile = useIsMobile()
    const [open, setOpen] = useState(defaultOpen)
    const [openMobile, setOpenMobile] = useState(false)

    const toggle = useCallback(() => {
        if (isMobile) {
            setOpenMobile((current) => !current)
            return
        }
        setOpen((current) => {
            const next = !current
            // biome-ignore lint/suspicious/noDocumentCookie: the layout is a plain client component; the cookie is only read on the server.
            document.cookie = `${SIDEBAR_COOKIE_NAME}=${next}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
            return next
        })
    }, [isMobile])

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
                event.preventDefault()
                toggle()
            }
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [toggle])

    const state = useMemo(
        (): SidebarState => ({ open, openMobile, isMobile, toggle, setOpenMobile }),
        [open, openMobile, isMobile, toggle],
    )

    return (
        <SidebarContext.Provider value={state}>
            <div className={cn('flex flex-1', className)}>
                {isMobile ? (
                    <Sheet open={openMobile} onOpenChange={setOpenMobile}>
                        <SheetContent side="left" className="w-64 gap-0 bg-sidebar p-2 text-sidebar-foreground">
                            <SheetHeader className="sr-only">
                                <SheetTitle>{t('title')}</SheetTitle>
                                <SheetDescription>{t('description')}</SheetDescription>
                            </SheetHeader>
                            {sidebar}
                        </SheetContent>
                    </Sheet>
                ) : (
                    <aside
                        data-state={open ? 'open' : 'closed'}
                        inert={!open}
                        className="sticky top-(--header-height) hidden h-[calc(100svh-var(--header-height))] w-64 shrink-0 overflow-hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 ease-linear data-[state=closed]:w-0 data-[state=closed]:border-r-0 md:block"
                    >
                        <div className="flex h-full w-64 flex-col gap-2 p-2">{sidebar}</div>
                    </aside>
                )}
                <div className="flex flex-col flex-1 min-w-0">
                    <PageContainer>{children}</PageContainer>
                </div>
            </div>
        </SidebarContext.Provider>
    )
}

export interface SidebarLayoutProps {
    /** The sidebar's content, usually one or more `SidebarNav`s. */
    sidebar: ReactNode
    children: ReactNode
    /** Initial desktop state; pass the `SIDEBAR_COOKIE_NAME` cookie's value so SSR matches. */
    defaultOpen?: boolean
    className?: string
}

/** Icon button that shows / hides the sidebar; place it at the top of the page (see `SidebarBreadcrumbs`). */
export function SidebarTrigger({ className, ...props }: SidebarTriggerProps) {
    const t = useTranslations('global.sidebar')
    const { toggle } = useSidebar()
    return (
        <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggle}
            className={cn('-ml-1.5 text-muted-foreground', className)}
            {...props}
        >
            <PanelLeftIcon />
            <span className="sr-only">{t('toggle')}</span>
        </Button>
    )
}

/** A plain button (never `asChild`), so the `Button` union is narrowed before `Omit` flattens it. */
export type SidebarTriggerProps = Omit<Extract<ButtonProps, { asChild?: false }>, 'onClick' | 'children' | 'asChild'>

/** The first line of a page inside a `SidebarLayout`: the sidebar trigger and where the page sits in the app. */
export function SidebarBreadcrumbs({ items, className }: SidebarBreadcrumbsProps) {
    return (
        // h-5 intentionally smaller than button clickable area to make spacing look even with the visible icon and text
        <div className={cn('flex h-5 items-center gap-2', className)}>
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-full" />
            <Breadcrumb>
                <BreadcrumbList>
                    {items.map((item, index) => {
                        const last = index === items.length - 1
                        return (
                            <Fragment key={item.key}>
                                <BreadcrumbItem>
                                    {last ? (
                                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                                    ) : item.render ? (
                                        <BreadcrumbLink asChild>
                                            {cloneElement(item.render, undefined, item.label)}
                                        </BreadcrumbLink>
                                    ) : (
                                        <span>{item.label}</span>
                                    )}
                                </BreadcrumbItem>
                                {!last && <BreadcrumbSeparator />}
                            </Fragment>
                        )
                    })}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    )
}

export interface SidebarBreadcrumbsProps {
    /** Root first; the last item is the current page. */
    items: BreadcrumbPart[]
    className?: string
}

export interface BreadcrumbPart {
    key: string
    label: ReactNode
    /** Makes the part a link: the element to render it as, e.g. `<Link href="…" />`; it gets `label` as children. */
    render?: ReactElement<{ children?: ReactNode }>
}

/** A list of `SidebarNavItem`s. */
export function SidebarNav({ className, ...props }: SidebarNavProps) {
    return <nav className={cn('flex flex-col gap-1', className)} {...props} />
}

export type SidebarNavProps = ComponentProps<'nav'>

/**
 * One link in a `SidebarNav`. `render` is the element that becomes the item, e.g. a framework `<Link href="…" />`;
 * it receives the styling, the icon and the label. On mobile, following it closes the sheet.
 */
export function SidebarNavItem({ icon: Icon, label, active = false, render, className }: SidebarNavItemProps) {
    const { setOpenMobile } = useSidebar()
    return cloneElement(
        render,
        {
            className: cn(
                'flex h-8 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring',
                active && 'bg-sidebar-accent font-medium text-sidebar-accent-foreground',
                className,
                render.props.className,
            ),
            'aria-current': active ? 'page' : undefined,
            onClick: (event: MouseEvent<HTMLElement>) => {
                render.props.onClick?.(event)
                setOpenMobile(false)
            },
        },
        <Icon className="size-4 shrink-0" />,
        <span className="truncate">{label}</span>,
    )
}

export interface SidebarNavItemProps {
    icon: LucideIcon
    label: string
    active?: boolean
    /** The element to render as the item; it gets the classes, `aria-current` and the icon + label as children. */
    render: ReactElement<SidebarNavItemRenderProps>
    className?: string
}

/** What `SidebarNavItem` sets on its `render` element. */
export interface SidebarNavItemRenderProps {
    className?: string
    'aria-current'?: 'page'
    onClick?: (event: MouseEvent<HTMLElement>) => void
    children?: ReactNode
}
