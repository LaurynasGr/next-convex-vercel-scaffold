import { getTranslations } from '@scaffold/i18n/server'
import { Button } from '@scaffold/ui/components/button'
import Link from 'next/link'
import { NotFoundContent } from '@/components/not-found-content/not-found-content'
import AppLayout from './(app)/layout'

/**
 * The only not-found boundary, so it renders the signed-in shell itself: Next mounts it in place of the root
 * layout's children, i.e. without `(app)/layout`. Anonymous visitors never get here (the proxy sends them to /login).
 */
export default async function NotFound() {
    const t = await getTranslations('global.notFound')
    return (
        <AppLayout>
            <NotFoundContent>
                <Button asChild variant="outline">
                    <Link href="/">{t('backHome')}</Link>
                </Button>
            </NotFoundContent>
        </AppLayout>
    )
}
