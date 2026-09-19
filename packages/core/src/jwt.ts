import { z } from 'zod'

const ExpClaim = z.object({ exp: z.number() })

/**
 * The `exp` claim of a JWT as epoch milliseconds, read without verifying the signature; null when absent or
 * malformed. Enough to decide a redirect: the Convex functions verify the token properly on every call.
 */
export function jwtExpiresAt(token: string): number | null {
    const payload = token.split('.')[1]
    if (!payload) return null
    try {
        const claims = ExpClaim.safeParse(JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))))
        return claims.success ? claims.data.exp * 1000 : null
    } catch {
        return null
    }
}
