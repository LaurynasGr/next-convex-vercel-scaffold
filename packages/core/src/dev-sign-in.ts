/**
 * The Google-less dev sign-in (DEV_SIGN_IN_AS) is only honoured on local
 * deployments, recognised by a loopback CONVEX_SITE_URL. Setting the variable
 * on a cloud deployment by mistake therefore does nothing instead of opening
 * an authentication bypass.
 */
export function isLoopbackUrl(url: string | undefined): boolean {
    if (!url) return false
    try {
        const { hostname } = new URL(url)
        return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]'
    } catch {
        return false
    }
}

/** The DEV_SIGN_IN_AS target (an email, or "first"), or null when dev sign-in is not allowed here. */
export function devSignInTarget(env: Record<string, string | undefined>): string | null {
    const target = env.DEV_SIGN_IN_AS
    if (!target || !isLoopbackUrl(env.CONVEX_SITE_URL)) return null
    return target
}
