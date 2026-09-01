import Google from '@auth/core/providers/google'
import { ConvexCredentials } from '@convex-dev/auth/providers/ConvexCredentials'
import { convexAuth } from '@convex-dev/auth/server'
import { devSignInTarget } from '@scaffold/core'
import { internal } from './_generated/api'
import type { DataModel } from './_generated/dataModel'

/**
 * Dev-only sign-in without Google, for local testing: signs in as the user
 * named by DEV_SIGN_IN_AS (an email, or "first" for the first user in the
 * table). Only registered on local deployments (see dev-sign-in.ts in @scaffold/core), and
 * the check is repeated at sign-in time so the variable alone never enables it.
 */
const devSignIn = ConvexCredentials<DataModel>({
    id: 'dev',
    authorize: async (_credentials, ctx) => {
        const target = devSignInTarget(process.env)
        if (!target) throw new Error('Dev sign-in is not enabled on this deployment')
        const userId = await ctx.runMutation(internal.users.devSignInUser, {})
        if (!userId) throw new Error(`No user matches DEV_SIGN_IN_AS=${target}`)
        return { userId }
    },
})

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
    providers: [Google, ...(devSignInTarget(process.env) ? [devSignIn] : [])],
})
