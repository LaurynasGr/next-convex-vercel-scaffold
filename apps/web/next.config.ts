import { createNextIntlPlugin } from '@scaffold/i18n/plugin'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
    // Next would otherwise write AGENTS.md/CLAUDE.md into apps/web on every dev run; the repo root has its own.
    agentRules: false,
    // `'use cache'` for the page content components; each page streams its shell and skeletons first (see
    // app/(app)/page.tsx). Full `cacheComponents` is deliberately off: it lowers TTFB further but shows
    // loading states for longer and usually on every single refresh.
    experimental: { useCache: true },
    // Workspace packages ship TypeScript source, not builds.
    transpilePackages: ['@scaffold/core', '@scaffold/forms', '@scaffold/i18n', '@scaffold/ui'],
    images: {
        // Google account avatars.
        remotePatterns: [{ protocol: 'https', hostname: '*.googleusercontent.com' }],
    },
}

export default withNextIntl(nextConfig)
