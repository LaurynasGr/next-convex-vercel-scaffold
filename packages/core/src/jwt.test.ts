import { expect, test } from 'bun:test'
import { jwtExpiresAt } from './jwt'

const encode = (claims: object) => Buffer.from(JSON.stringify(claims)).toString('base64url')
const jwt = (claims: object) => `${encode({ alg: 'RS256' })}.${encode(claims)}.signature`

test('reads exp as epoch milliseconds', () => {
    expect(jwtExpiresAt(jwt({ sub: 'user', exp: 1_800_000_000 }))).toBe(1_800_000_000_000)
})

test('is null without an exp claim or for garbage', () => {
    expect(jwtExpiresAt(jwt({ sub: 'user' }))).toBeNull()
    expect(jwtExpiresAt('not-a-jwt')).toBeNull()
    expect(jwtExpiresAt('a.%%%.c')).toBeNull()
    expect(jwtExpiresAt('')).toBeNull()
})
