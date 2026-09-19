/**
 * Compile-time only (not picked up by `bun test`): column keys are (nested) row paths and `format` / `render`
 * receive the value type at that path.
 */
import type { DataTableProps } from './data-table'
import type { TableColumn } from './types'

interface Row {
    name: string
    rate?: number
    contact: { email?: string; address: { city: string } }
    tags: string[]
}

export const columns: TableColumn<Row>[] = [
    { key: 'name', format: (name) => name.toUpperCase() },
    { key: 'rate', format: (rate) => (rate === undefined ? null : rate.toFixed(2)) },
    { key: 'contact.email', render: (email) => <a href={`mailto:${email}`}>{email}</a> },
    { key: 'contact.address.city', format: (city) => city.toLowerCase() },
    { key: 'tags', format: (tags) => tags.join(', ') },
    // @ts-expect-error array element paths are not addressable (the element may not exist)
    { key: 'tags.0', format: (tag) => tag.toUpperCase() },
    { id: 'actions', render: (row) => row.name },
    // @ts-expect-error unknown path
    { key: 'contact.phone' },
    // @ts-expect-error a number is not a string
    { key: 'rate', format: (rate) => rate?.toUpperCase() },
    // @ts-expect-error custom columns need an id and a renderer
    { header: 'Nothing' },
]

/** `getRowKey` defaults to `_id` when the rows have one and is required otherwise. */
interface Doc extends Row {
    _id: string
}
export const docTable: DataTableProps<Doc> = { columns: [], data: [] }
export const keyedDocTable: DataTableProps<Doc> = { columns: [], data: [], getRowKey: (doc) => doc._id }
export const keyedTable: DataTableProps<Row> = { columns: [], data: [], getRowKey: (row) => row.name }
// @ts-expect-error rows without an _id need a getRowKey
export const unkeyedTable: DataTableProps<Row> = { columns: [], data: [] }
