import { describe, expect, test } from 'bun:test'
import { devSignInTarget, isLoopbackUrl } from './dev-sign-in'

describe('isLoopbackUrl', () => {
    test('accepts local Convex site URLs', () => {
        expect(isLoopbackUrl('http://127.0.0.1:3211')).toBe(true)
        expect(isLoopbackUrl('http://localhost:3211')).toBe(true)
        expect(isLoopbackUrl('http://[::1]:3211')).toBe(true)
    })

    test('rejects cloud, unset and malformed URLs', () => {
        expect(isLoopbackUrl('https://happy-otter-123.convex.site')).toBe(false)
        expect(isLoopbackUrl('https://localhost.evil.com')).toBe(false)
        expect(isLoopbackUrl(undefined)).toBe(false)
        expect(isLoopbackUrl('not a url')).toBe(false)
    })
})

describe('devSignInTarget', () => {
    test('returns the target only on a local deployment', () => {
        expect(devSignInTarget({ DEV_SIGN_IN_AS: 'me@example.com', CONVEX_SITE_URL: 'http://127.0.0.1:3211' })).toBe(
            'me@example.com',
        )
        expect(devSignInTarget({ DEV_SIGN_IN_AS: 'first', CONVEX_SITE_URL: 'http://127.0.0.1:3211' })).toBe('first')
    })

    test('is disabled on cloud deployments even when the variable is set', () => {
        expect(
            devSignInTarget({ DEV_SIGN_IN_AS: 'me@example.com', CONVEX_SITE_URL: 'https://x.convex.site' }),
        ).toBeNull()
        expect(devSignInTarget({ CONVEX_SITE_URL: 'http://127.0.0.1:3211' })).toBeNull()
    })
})
