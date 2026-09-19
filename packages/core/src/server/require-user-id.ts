import { getAuthUserId } from '@convex-dev/auth/server'
import type { Auth } from 'convex/server'
import { ConvexError } from 'convex/values'

/** The signed-in user's id for a function that must not run anonymously (queries return empty results instead). */
export async function requireUserId(ctx: { auth: Auth }) {
    const userId = await getAuthUserId(ctx)
    if (userId === null) throw new ConvexError('You need to be signed in')
    return userId
}
