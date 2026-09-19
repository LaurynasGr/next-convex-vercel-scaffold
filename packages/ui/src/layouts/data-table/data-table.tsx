'use client'

import { useTranslations } from '@scaffold/i18n'
import { Input } from '@scaffold/ui/components/input'
import { Table, TableHead, TableHeader, TableRow } from '@scaffold/ui/components/table'
import { cn } from '@scaffold/ui/lib/utils'
import { SearchIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { columnKey, filterRows } from './cell-value'
import { columnClass, DataTableBody, type DataTableBodyProps, useBooleanLabels } from './data-table-body'
import { ACTIONS_COLUMN_ID, type RowKeyProps, type TableColumn } from './types'

/**
 * Bordered table driven by column definitions: typed field columns with format / render hooks, custom
 * columns, an optional client-side search box over the `searchable` columns, skeleton rows while
 * `loading` and an empty state. Pagination and row selection can be layered on when a list needs them.
 */
export function DataTable<Row extends object>({
    columns,
    data,
    search = false,
    searchPlaceholder,
    className,
    tableClassName,
    ...rest
}: DataTableProps<Row>) {
    const t = useTranslations('global')
    const [searchTerm, setSearchTerm] = useState('')
    const labels = useBooleanLabels()
    const rows = useMemo(
        () => filterRows(data, { columns, term: searchTerm, labels }),
        [columns, data, searchTerm, labels],
    )

    return (
        <div className={cn('flex flex-col gap-3', className)}>
            {search && (
                <div className="relative max-w-sm">
                    <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={searchPlaceholder ?? t('searchPlaceholder')}
                        aria-label={searchPlaceholder ?? t('searchPlaceholder')}
                        className="pl-8"
                    />
                </div>
            )}
            {/* Focusable (out of the tab order) so a dialog whose trigger row was removed can hand focus back here. */}
            <div
                tabIndex={-1}
                className="rounded-lg border bg-card text-card-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
                <Table className={tableClassName}>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            {columns.map((column) => (
                                <TableHead
                                    key={columnKey(column)}
                                    className={cn(columnClass(column), column.headerClassName)}
                                >
                                    {columnHeader(column, t)}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <DataTableBody {...rest} columns={columns} rows={rows} searchTerm={searchTerm} />
                </Table>
            </div>
        </div>
    )
}

/**
 * The heading: the shared label for `headerKey`, the node for `header`, and for an actions column that names neither
 * the visually hidden "Actions" (icon buttons need a column name for assistive technology, sighted users do not).
 */
function columnHeader<Row extends object>(column: TableColumn<Row>, t: ReturnType<typeof useTranslations<'global'>>) {
    if (column.headerKey !== undefined) return t(column.headerKey)
    if (column.header === undefined && column.id === ACTIONS_COLUMN_ID) {
        return <span className="sr-only">{t('actions')}</span>
    }
    return column.header
}

export type DataTableProps<Row extends object> = Omit<DataTableBodyProps<Row>, 'rows' | 'searchTerm' | 'getRowKey'> &
    RowKeyProps<Row> & {
        /** All rows; the search box filters them before they reach the body. */
        data: Row[]
        /** Show a search box filtering the rows by their `searchable` columns. */
        search?: boolean
        searchPlaceholder?: string
        className?: string
        tableClassName?: string
    }
