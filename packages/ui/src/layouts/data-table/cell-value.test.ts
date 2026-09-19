import { describe, expect, test } from 'bun:test'
import { type BooleanLabels, cellText, columnKey, filterRows, isBlankCell, matchesSearch } from './cell-value'

const LABELS: BooleanLabels = { yes: 'Yes', no: 'No' }

import type { DataColumn, TableColumn } from './types'

interface Row {
    name: string
    email?: string
    rate?: number
    active: boolean
    tags: string[]
    contact: { phone?: string }
}

const rateColumn: DataColumn<Row, 'rate'> = {
    key: 'rate',
    header: 'Rate',
    format: (rate) => (rate === undefined ? null : `${rate} / h`),
    searchable: true,
}
const tagsColumn: DataColumn<Row, 'tags'> = { key: 'tags', header: 'Tags', render: (tags) => tags.join(', ') }
const columns: TableColumn<Row>[] = [
    { key: 'name', header: 'Name', searchable: true },
    { key: 'email', header: 'Email', searchable: true },
    rateColumn,
    { key: 'active', header: 'Active' },
    tagsColumn,
    { key: 'contact.phone', header: 'Phone', searchable: true },
    { id: 'actions', render: () => null },
]
const acme: Row = {
    name: 'Acme',
    email: 'contact@acme.test',
    rate: 85,
    active: true,
    tags: ['vip'],
    contact: { phone: '+370 600 00000' },
}
const globex: Row = { name: 'Globex', active: false, tags: [], contact: {} }
const rows: Row[] = [acme, globex]

describe('cellText', () => {
    test('shows primitives as text and booleans as Yes / No', () => {
        expect(cellText({ key: 'name' }, acme, LABELS)).toBe('Acme')
        expect(cellText({ key: 'active' }, acme, LABELS)).toBe('Yes')
        expect(cellText({ key: 'active' }, globex, LABELS)).toBe('No')
    })
    test('blank values are null, formatted values win over raw ones', () => {
        expect(cellText({ key: 'email' }, globex, LABELS)).toBeNull()
        expect(cellText({ key: 'name', format: () => '' }, acme, LABELS)).toBeNull()
        expect(cellText(rateColumn, acme, LABELS)).toBe('85 / h')
    })
    test('reads nested paths', () => {
        expect(cellText({ key: 'contact.phone' }, acme, LABELS)).toBe('+370 600 00000')
        expect(cellText({ key: 'contact.phone' }, globex, LABELS)).toBeNull()
    })
    test('non-primitive values have no text unless formatted', () => {
        expect(cellText(tagsColumn, acme, LABELS)).toBeNull()
        expect(cellText({ key: 'tags', format: (tags) => tags.join(', ') }, acme, LABELS)).toBe('vip')
    })
})

describe('isBlankCell', () => {
    test('blankness comes from the raw value, so a rendered array still shows', () => {
        expect(isBlankCell(tagsColumn, acme)).toBe(false)
        expect(isBlankCell(tagsColumn, globex)).toBe(false)
        expect(isBlankCell({ key: 'email' }, globex)).toBe(true)
    })
    test('with a format, blankness comes from the formatted value', () => {
        expect(isBlankCell(rateColumn, globex)).toBe(true)
        expect(isBlankCell({ key: 'tags', format: (tags) => tags.join(', ') }, globex)).toBe(true)
    })
})

describe('matchesSearch', () => {
    test('matches searchable columns case-insensitively, including formatted text', () => {
        expect(matchesSearch(acme, { columns, term: 'ACME', labels: LABELS })).toBe(true)
        expect(matchesSearch(acme, { columns, term: '@acme', labels: LABELS })).toBe(true)
        expect(matchesSearch(acme, { columns, term: '85 /', labels: LABELS })).toBe(true)
        expect(matchesSearch(acme, { columns, term: '600 00', labels: LABELS })).toBe(true)
        expect(matchesSearch(globex, { columns, term: 'acme', labels: LABELS })).toBe(false)
    })
    test('ignores non-searchable columns and matches everything on a blank term', () => {
        expect(matchesSearch(acme, { columns, term: 'yes', labels: LABELS })).toBe(false)
        expect(matchesSearch(globex, { columns, term: '   ', labels: LABELS })).toBe(true)
    })
})

test('filterRows keeps the original array for a blank term', () => {
    expect(filterRows(rows, { columns, term: '', labels: LABELS })).toBe(rows)
    expect(filterRows(rows, { columns, term: 'glob', labels: LABELS })).toEqual([globex])
})

test('columnKey uses the field key or the custom id', () => {
    expect(columnKey<Row>({ key: 'name' })).toBe('name')
    expect(columnKey<Row>({ id: 'actions', render: () => null })).toBe('actions')
})
