import { describe, expect, test } from 'bun:test'
import { decodeSecretBoxKey, openSecret, sealSecret } from './secret-box'

const OPTIONS = { label: 'TEST_KEY' }
const KEY = decodeSecretBoxKey(Buffer.alloc(32, 7).toString('base64'), OPTIONS)
const OTHER_KEY = decodeSecretBoxKey(Buffer.alloc(32, 9).toString('base64'), OPTIONS)

describe('decodeSecretBoxKey', () => {
    test('rejects unset, malformed and wrong-size keys, naming the key', () => {
        expect(() => decodeSecretBoxKey(undefined, OPTIONS)).toThrow('TEST_KEY is not set')
        expect(() => decodeSecretBoxKey('', OPTIONS)).toThrow('TEST_KEY is not set')
        expect(() => decodeSecretBoxKey('not base64!', OPTIONS)).toThrow('TEST_KEY')
        expect(() => decodeSecretBoxKey(Buffer.alloc(16).toString('base64'), OPTIONS)).toThrow(
            'TEST_KEY must decode to 32 bytes',
        )
    })

    test('accepts standard base64 and base64url, with surrounding whitespace', () => {
        const bytes = Buffer.from([250, 251, 252, 253, 254, 255, ...Array(26).fill(1)])
        expect(decodeSecretBoxKey(` ${bytes.toString('base64')}\n`, OPTIONS)).toEqual(new Uint8Array(bytes))
        expect(decodeSecretBoxKey(bytes.toString('base64url'), OPTIONS)).toEqual(new Uint8Array(bytes))
    })
})

describe('sealSecret / openSecret', () => {
    test('round-trips as a compact JWE, with a different ciphertext every time', async () => {
        const first = await sealSecret('tok_123', KEY)
        const second = await sealSecret('tok_123', KEY)
        expect(first).not.toBe(second)
        expect(first.split('.')).toHaveLength(5)
        expect(await openSecret(first, KEY)).toBe('tok_123')
        expect(await openSecret(second, KEY)).toBe('tok_123')
    })

    test('keeps non-ASCII text intact', async () => {
        expect(await openSecret(await sealSecret('žąsis 🪿', KEY), KEY)).toBe('žąsis 🪿')
    })

    test('fails for a different key, a tampered value or a foreign format', async () => {
        const sealed = await sealSecret('tok_123', KEY)
        await expect(openSecret(sealed, OTHER_KEY)).rejects.toThrow()
        const parts = sealed.split('.')
        const ciphertext = parts[3] ?? ''
        parts[3] = ciphertext.startsWith('A') ? `B${ciphertext.slice(1)}` : `A${ciphertext.slice(1)}`
        await expect(openSecret(parts.join('.'), KEY)).rejects.toThrow()
        await expect(openSecret('v1.abc.def', KEY)).rejects.toThrow()
        await expect(openSecret('tok_123', KEY)).rejects.toThrow()
    })
})
