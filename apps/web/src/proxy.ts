import {
    convexAuthNextjsMiddleware,
    createRouteMatcher,
    nextjsMiddlewareRedirect,
} from '@convex-dev/auth/nextjs/server'

const isLoginPage = createRouteMatcher(['/login'])

// Every other page is behind sign-in; /api/auth (matched below) is where the
// Convex Auth client exchanges tokens and must stay open.
export default convexAuthNextjsMiddleware(
    async (request, { convexAuth }) => {
        const authenticated = await convexAuth.isAuthenticated()
        if (isLoginPage(request)) {
            if (authenticated) return nextjsMiddlewareRedirect(request, '/')
            return
        }
        if (!authenticated) return nextjsMiddlewareRedirect(request, '/login')
    },
    // Keep the session across browser restarts (30 days), matching the client-side token storage.
    { cookieConfig: { maxAge: 60 * 60 * 24 * 30 } },
)

export const config = {
    // Everything except Next internals and the metadata files served from
    // app/ (icon, manifest, robots, sitemap). Dotted paths are deliberately NOT
    // excluded in general (e.g. /files/report.2026 must stay protected). Convex
    // functions enforce auth on their own regardless.
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|manifest.webmanifest|robots.txt|sitemap.xml).*)',
    ],
}
