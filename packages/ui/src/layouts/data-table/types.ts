import type { TranslateKey } from '@scaffold/i18n'
import type { GetFieldType } from 'lodash'
import type { ReactNode } from 'react'
import type { Paths } from 'type-fest'

/** What a cell can show as plain text; blank values (null / undefined / '') fall back to the column placeholder. */
export type CellPrimitive = string | number | boolean | null | undefined

export type ColumnAlign = 'left' | 'center' | 'right'

/** A path with an array index segment (`tags.0`, `items.2.name`). */
type IndexedPath = `${number}` | `${number}.${string}` | `${string}.${number}` | `${string}.${number}.${string}`

/**
 * Dotted paths into a row (`'name'`, `'contact.email'`), up to three levels deep. Paths through an array index are
 * excluded: the element may be missing at runtime, which `GetFieldType` does not reflect. Address the array itself
 * and use `format` / `render`.
 */
export type RowPath<Row extends object> = Exclude<Paths<Row, { maxRecursionDepth: 3 }> & string, IndexedPath>

/** The column heading: either any node, or the key of a shared label under `global` (Address, Name, …). */
type ColumnHeader = { header?: ReactNode; headerKey?: never } | { header?: never; headerKey: TranslateKey<'global'> }

type ColumnBase = ColumnHeader & {
    /** Applied to every body cell of the column. */
    className?: string
    headerClassName?: string
    align?: ColumnAlign
    /**
     * 'auto' (default) leaves sizing to the browser's table layout, which shares the width out by content;
     * 'content' shrinks the column to its content on one line (rates, dates, actions); 'fill' hands it the
     * remaining width once the others are sized.
     */
    width?: 'auto' | 'content' | 'fill'
    /** Keep the cell on one line (always on for 'content' columns). */
    nowrap?: boolean
    /** Truncate overflowing text with an ellipsis instead of wrapping; the full text goes into the cell's title. */
    ellipsis?: boolean
}

/** A column backed by one field of the row, addressed by a (possibly nested) path. */
export type DataColumn<Row extends object, Key extends RowPath<Row>> = ColumnBase & {
    key: Key
    id?: never
    /**
     * Plain-text projection of the field: shown in the cell, matched by the search box and used for the
     * ellipsis title. A blank result shows the placeholder.
     */
    format?: (value: GetFieldType<Row, Key>, row: Row) => CellPrimitive
    /**
     * Custom cell content for non-blank values; search and the ellipsis title still use `format` / the raw value.
     * A non-primitive field (object, array) needs `format` or `render`, otherwise the cell has nothing to show.
     */
    render?: (value: GetFieldType<Row, Key>, row: Row) => ReactNode
    /** Shown for blank values. Defaults to a muted dash. */
    placeholder?: ReactNode
    /** Include the column in the search box matching. */
    searchable?: boolean
}

/** The `id` of the column holding a row's buttons; its header defaults to a visually hidden "Actions". */
export const ACTIONS_COLUMN_ID = 'actions'

/** A column not backed by a single field: actions, computed cells. */
export type CustomColumn<Row extends object> = ColumnBase & {
    id: string
    key?: never
    render: (row: Row) => ReactNode
}

export type TableColumn<Row extends object> =
    | { [Key in RowPath<Row>]: DataColumn<Row, Key> }[RowPath<Row>]
    | CustomColumn<Row>

/**
 * `getRowKey` is optional when every row carries a string `_id` (Convex documents), which is the default key, and
 * required otherwise. The tuple wrapping keeps the check non-distributive so `Row` stays `Row` in both branches.
 */
export type RowKeyProps<Row extends object> = [Row] extends [{ _id: string }]
    ? { getRowKey?: (row: Row) => string | number }
    : { getRowKey: (row: Row) => string | number }
