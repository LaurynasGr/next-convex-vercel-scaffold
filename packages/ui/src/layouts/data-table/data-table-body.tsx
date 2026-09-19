'use client'

import { useTranslations } from '@scaffold/i18n'
import { Skeleton } from '@scaffold/ui/components/skeleton'
import { TableBody, TableCell, TableRow } from '@scaffold/ui/components/table'
import { cn } from '@scaffold/ui/lib/utils'
import get from 'lodash/get'
import { type ReactNode, useMemo } from 'react'
import { type BooleanLabels, cellText, columnKey, isBlankCell } from './cell-value'
import type { ColumnAlign, TableColumn } from './types'

// Adding cn to get TW autocomplete and preview without `ClassName` suffix
const ALIGN_CLASS = {
    left: cn('text-left'),
    center: cn('text-center'),
    right: cn('text-right'),
} as const satisfies Record<ColumnAlign, string>

/** Classes shared by a column's header and body cells: alignment and width behaviour. */
export function columnClass<Row extends object>(column: TableColumn<Row>) {
    return cn(
        column.align && ALIGN_CLASS[column.align],
        column.width === 'content' && 'w-0 whitespace-nowrap',
        column.width === 'fill' && 'w-full',
        column.nowrap && 'whitespace-nowrap',
    )
}

/**
 * Lets a cell's text truncate without capping the column: a grid track of `minmax(0, 1fr)` gives the cell a
 * min-content width of zero (so the column may shrink and the text ellipsises) while its max-content width stays
 * the full text (so the browser still shares the width out normally). `max-width: 0` on the cell would do the
 * first but also starve the column of spare width.
 */
function Ellipsis({ children }: EllipsisProps) {
    return (
        <div className="grid grid-cols-[minmax(0,1fr)]">
            <span className="truncate">{children}</span>
        </div>
    )
}

interface EllipsisProps {
    children: ReactNode
}

/** Rows with a string `_id` (Convex documents) key by it unless `getRowKey` says otherwise. */
function defaultRowKey(row: object): string {
    if ('_id' in row && typeof row._id === 'string') return row._id
    throw new Error('DataTable: rows without a string `_id` need a `getRowKey`.')
}

export function DataTableBody<Row extends object>({
    columns,
    rows,
    getRowKey = defaultRowKey,
    loading = false,
    skeletonRows = 5,
    emptyMessage,
    searchTerm = '',
}: DataTableBodyProps<Row>) {
    const t = useTranslations('global')
    if (rows.length === 0) {
        if (loading) {
            return (
                <TableBody>
                    {Array.from({ length: skeletonRows }, (_, index) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder rows, not tied to data.
                        <TableRow key={index}>
                            {columns.map((column) => (
                                <TableCell
                                    key={columnKey(column)}
                                    className={cn(columnClass(column), column.className)}
                                >
                                    <Skeleton className="h-4 w-32" />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            )
        }
        return (
            <TableBody>
                <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                        {searchTerm.trim() !== ''
                            ? t.rich('noResultsFor', {
                                  term: searchTerm,
                                  highlight: (chunks) => <span className="font-medium text-foreground">{chunks}</span>,
                              })
                            : (emptyMessage ?? t('nothingHereYet'))}
                    </TableCell>
                </TableRow>
            </TableBody>
        )
    }
    return (
        <TableBody>
            {rows.map((row) => (
                <TableRow key={getRowKey(row)}>
                    {columns.map((column) => (
                        <DataTableCell key={columnKey(column)} column={column} row={row} />
                    ))}
                </TableRow>
            ))}
        </TableBody>
    )
}

export interface DataTableBodyProps<Row extends object> {
    columns: TableColumn<Row>[]
    /** The rows to show, already filtered by the active search. */
    rows: Row[]
    /** Defaults to the row's `_id`; `DataTableProps` makes it required when the rows have none. */
    getRowKey?: (row: Row) => string | number
    /** Renders skeleton rows while true and there are no rows yet. */
    loading?: boolean
    skeletonRows?: number
    /** Shown when there are no rows and no active search. */
    emptyMessage?: ReactNode
    /** The active search text; a non-blank term turns the empty state into a "no results" message. */
    searchTerm?: string
}

/** The translated boolean labels, stable across renders so the filtered rows can be memoised on them. */
export function useBooleanLabels(): BooleanLabels {
    const t = useTranslations('global')
    const yes = t('yes')
    const no = t('no')
    return useMemo((): BooleanLabels => ({ yes, no }), [yes, no])
}

function DataTableCell<Row extends object>({ column, row }: DataTableCellProps<Row>) {
    const labels = useBooleanLabels()
    const className = cn(columnClass(column), column.className)
    if (column.id !== undefined) {
        const content = column.render(row)
        return <TableCell className={className}>{column.ellipsis ? <Ellipsis>{content}</Ellipsis> : content}</TableCell>
    }

    const text = cellText(column, row, labels)
    const content = isBlankCell(column, row)
        ? (column.placeholder ?? <span className="text-muted-foreground">–</span>)
        : column.render
          ? column.render(get(row, column.key), row)
          : text
    return (
        <TableCell title={column.ellipsis && text !== null ? text : undefined} className={className}>
            {column.ellipsis ? <Ellipsis>{content}</Ellipsis> : content}
        </TableCell>
    )
}

interface DataTableCellProps<Row extends object> {
    column: TableColumn<Row>
    row: Row
}
