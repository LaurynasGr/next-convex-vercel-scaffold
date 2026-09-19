import { describe, expect, test } from 'bun:test'
import { LOCALES } from '../locales'
import en from './en'
import lt from './lt'

const MESSAGES = { en, lt } satisfies Record<(typeof LOCALES)[number], unknown>

/** Every dotted key path with a string value. */
function keyPaths(node: unknown, prefix = ''): string[] {
    if (typeof node !== 'object' || node === null) return [prefix]
    return Object.entries(node).flatMap(([key, value]) => keyPaths(value, prefix ? `${prefix}.${key}` : key))
}

/**
 * The `{placeholders}` and `<tags>` (opening and closing) a message uses, so a translation cannot drop, misspell or
 * leave one unclosed.
 */
function markers(message: unknown): string[] {
    return typeof message === 'string' ? (message.match(/\{[^}]+\}|<\/?[^>]+>/g) ?? []).sort() : []
}

function messageAt(root: unknown, path: string): unknown {
    return path.split('.').reduce<unknown>((node, key) => {
        return typeof node === 'object' && node !== null ? Reflect.get(node, key) : undefined
    }, root)
}

describe('translations', () => {
    const reference = keyPaths(en).sort()
    for (const locale of LOCALES) {
        test(`${locale} has exactly the keys of en`, () => {
            expect(keyPaths(MESSAGES[locale]).sort()).toEqual(reference)
        })
        test(`${locale} keeps every placeholder and tag of en`, () => {
            for (const path of reference) {
                expect({ path, markers: markers(messageAt(MESSAGES[locale], path)) }).toEqual({
                    path,
                    markers: markers(messageAt(en, path)),
                })
            }
        })
    }
})
