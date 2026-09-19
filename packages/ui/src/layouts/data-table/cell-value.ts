import get from 'lodash/get'
import type { CellPrimitive, DataColumn, RowPath, TableColumn } from './types'

export function columnKey<Row extends object>(column: TableColumn<Row>): string {
    if (column.id !== undefined) return column.id
    return column.key
}

/** null, undefined and '' are blank: the cell shows its placeholder instead of the value. */
export function isBlankValue(value: unknown): boolean {
    return value === null || value === undefined || value === ''
}

/**
 * Whether the cell shows the placeholder: with `format`, when the formatted value is blank; otherwise when the raw
 * value is blank. A non-primitive raw value (object, array) is not blank, it just has no text unless formatted.
 */
export function isBlankCell<Row extends object, Key extends RowPath<Row>>(
    column: DataColumn<Row, Key>,
    row: Row,
): boolean {
    const raw = get(row, column.key)
    return isBlankValue(column.format ? column.format(raw, row) : raw)
}

/**
 * The column's plain text for `row`: the formatted value, or the raw one when it is a primitive. null when the
 * value is blank or has no text form (a non-primitive without `format`).
 */
export function cellText<Row extends object, Key extends RowPath<Row>>(
    column: DataColumn<Row, Key>,
    row: Row,
    labels: BooleanLabels,
): string | null {
    const raw = get(row, column.key)
    const value: unknown = column.format ? column.format(raw, row) : raw
    return primitiveToText(value, labels)
}

/** How a boolean cell reads (and is searched): the translated "Yes" / "No". */
export interface BooleanLabels {
    yes: string
    no: string
}

function primitiveToText(value: unknown, labels: BooleanLabels): string | null {
    if (isBlankValue(value)) return null
    if (typeof value === 'boolean') return value ? labels.yes : labels.no
    if (typeof value === 'string' || typeof value === 'number') return String(value)
    return null
}

export interface SearchParams<Row extends object> {
    columns: TableColumn<Row>[]
    term: string
    labels: BooleanLabels
}

/** Case-insensitive substring match of `term` against the row's searchable columns. A blank term matches everything. */
export function matchesSearch<Row extends object>(row: Row, { columns, term, labels }: SearchParams<Row>): boolean {
    const needle = term.trim().toLowerCase()
    if (needle === '') return true
    return columns.some(
        (column) =>
            column.id === undefined &&
            column.searchable &&
            (cellText(column, row, labels)?.toLowerCase().includes(needle) ?? false),
    )
}

export function filterRows<Row extends object>(rows: Row[], params: SearchParams<Row>): Row[] {
    if (params.term.trim() === '') return rows
    return rows.filter((row) => matchesSearch(row, params))
}

export type { CellPrimitive }
