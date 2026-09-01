import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    // Next would otherwise write AGENTS.md/CLAUDE.md into apps/web on every dev run; the repo root has its own.
    agentRules: false,
    // Workspace packages ship TypeScript source, not builds.
    transpilePackages: ['@scaffold/core', '@scaffold/forms', '@scaffold/ui'],
    images: {
        // Google account avatars.
        remotePatterns: [{ protocol: 'https', hostname: '*.googleusercontent.com' }],
    },
}

export default nextConfig
