import { ConvexAuthNextjsServerProvider } from '@convex-dev/auth/nextjs/server'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { APP_NAME, APP_TAGLINE } from '@/lib/brand'
import { ConvexClientProvider } from './partials/convex-client-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
    title: APP_NAME,
    description: APP_TAGLINE,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ConvexAuthNextjsServerProvider>
            {/* next-themes sets the `dark` class on <html> before hydration, hence the warning suppression. */}
            <html lang="en" suppressHydrationWarning className={inter.variable}>
                <body className="antialiased">
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                        <ConvexClientProvider>{children}</ConvexClientProvider>
                    </ThemeProvider>
                </body>
            </html>
        </ConvexAuthNextjsServerProvider>
    )
}
