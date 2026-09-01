import { getAuthUserId } from '@convex-dev/auth/server'
import { devSignInTarget } from '@scaffold/core'
import { internalMutation, query } from './_generated/server'

/** Whether this deployment allows signing in without Google (see convex/auth.ts). */
export const devSignInEnabled = query({
    args: {},
    handler: async () => devSignInTarget(process.env) !== null,
})

/**
 * The user DEV_SIGN_IN_AS points at: an email, or "first" for the first user.
 * An email with no matching user is created on the spot so a fresh local
 * deployment can be used without ever completing a Google sign-in. The email
 * is marked verified so a later Google sign-in with it links to this same user
 * instead of creating a second one.
 */
export const devSignInUser = internalMutation({
    args: {},
    handler: async (ctx) => {
        const target = devSignInTarget(process.env)
        if (!target) return null
        if (target === 'first') {
            const user = await ctx.db.query('users').first()
            return user?._id ?? null
        }
        const user = await ctx.db
            .query('users')
            .withIndex('email', (q) => q.eq('email', target))
            .first()
        if (user) {
            // Users created before the verified-email marker existed get it retroactively.
            if (user.emailVerificationTime === undefined)
                await ctx.db.patch(user._id, { emailVerificationTime: Date.now() })
            return user._id
        }
        return ctx.db.insert('users', {
            email: target,
            name: target.split('@')[0],
            emailVerificationTime: Date.now(),
        })
    },
})

export const viewer = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx)
        if (userId === null) return null
        return ctx.db.get(userId)
    },
})
