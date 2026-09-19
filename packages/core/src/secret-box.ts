import { base64url, CompactEncrypt, type CompactJWEHeaderParameters, compactDecrypt } from 'jose'

/**
 * Symmetric encryption for secrets at rest (third-party API tokens, passwords). A sealed value is a compact JWE with direct key
 * agreement and AES-256-GCM (`alg: dir`, `enc: A256GCM`), produced by jose over Web Crypto, so it runs the same in
 * Bun, the Convex runtime and Node, and the format carries its own algorithm header for future changes.
 */

const KEY_BYTES = 32
const HEADER: CompactJWEHeaderParameters = { alg: 'dir', enc: 'A256GCM' }
const DECRYPT_OPTIONS = { keyManagementAlgorithms: [HEADER.alg], contentEncryptionAlgorithms: [HEADER.enc] }

/**
 * The raw 32-byte key from its base64 form, as kept in a deployment variable (`openssl rand -base64 32` makes one); throws
 * when unset, malformed or the wrong size, naming the key by `label` (the variable's name) in the message.
 */
export function decodeSecretBoxKey(encoded: string | undefined, { label }: DecodeSecretBoxKeyOptions): Uint8Array {
    if (!encoded) throw new Error(`${label} is not set on this deployment`)
    let bytes: Uint8Array
    try {
        // Accepts standard base64 (what `openssl rand -base64` prints) as well as base64url.
        bytes = base64url.decode(encoded.trim())
    } catch {
        throw new Error(`${label} is not valid base64`)
    }
    if (bytes.length !== KEY_BYTES) throw new Error(`${label} must decode to ${KEY_BYTES} bytes`)
    return bytes
}

export interface DecodeSecretBoxKeyOptions {
    /** How to refer to the key in error messages, e.g. the environment variable holding it. */
    label: string
}

/** Encrypts `plaintext`; jose picks a fresh random IV every time. */
export function sealSecret(plaintext: string, key: Uint8Array): Promise<string> {
    return new CompactEncrypt(new TextEncoder().encode(plaintext)).setProtectedHeader(HEADER).encrypt(key)
}

/** Decrypts a value produced by `sealSecret`; throws on a foreign format, a different key or a tampered value. */
export async function openSecret(sealed: string, key: Uint8Array): Promise<string> {
    const { plaintext } = await compactDecrypt(sealed, key, DECRYPT_OPTIONS)
    return new TextDecoder().decode(plaintext)
}
