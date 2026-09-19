import { ConvexAuthNextjsServerProvider } from '@convex-dev/auth/nextjs/server'
import { NextIntlClientProvider } from '@scaffold/i18n'
import { getLocale, getTranslations } from '@scaffold/i18n/server'
import { TooltipProvider } from '@scaffold/ui/components/tooltip'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { APP_NAME } from '@/lib/brand'
import { AppToaster } from './partials/app-toaster'
import { ConvexClientProvider } from './partials/convex-client-provider'
import { TimeZoneCookie } from './partials/time-zone-cookie'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('global')
    return {
        title: APP_NAME,
        description: t('tagline'),
    }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const locale = await getLocale()
    return (
        <ConvexAuthNextjsServerProvider>
            {/* next-themes sets the `dark` class on <html> before hydration, hence the warning suppression. */}
            <html lang={locale} suppressHydrationWarning className={inter.variable}>
                <body className="antialiased">
                    {/* Rendered from a server component, so it inherits the locale, messages and time zone of the request config. */}
                    <NextIntlClientProvider>
                        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                            {/* One provider for every tooltip, so they share the open delay and skip it between neighbours. */}
                            <TooltipProvider>
                                <ConvexClientProvider>{children}</ConvexClientProvider>
                            </TooltipProvider>
                            <AppToaster />
                            <TimeZoneCookie />
                        </ThemeProvider>
                    </NextIntlClientProvider>
                </body>
            </html>
        </ConvexAuthNextjsServerProvider>
    )
}
