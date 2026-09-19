'use client'

import { type Preloaded, usePreloadedQuery } from 'convex/react'
import type { FunctionReference } from 'convex/server'

/**
 * `usePreloadedQuery` that accepts `null` while the server is still preloading (the page's Suspense fallback), so
 * one client component renders both its loading and loaded states instead of needing a skeleton twin. There is
 * no way to pass 'skip' to `usePreloadedQuery`, hence the stand-in: `_argsJSON: 'skip'` keeps the query from
 * running, the other fields are unused.
 */
export function useOptionalPreloadedQuery<Query extends FunctionReference<'query'>>(
    preloaded: Preloaded<Query> | null,
): Query['_returnType'] | null {
    const value = usePreloadedQuery(
        // `__type` is a phantom type carrier that never exists at runtime; nothing but a cast can produce it.
        preloaded ?? { __type: {} as Query, _argsJSON: 'skip', _name: 'skipped', _valueJSON: '' },
    )
    // With the stand-in, `value` is the placeholder `_valueJSON`, not a result.
    return preloaded ? value : null
}
