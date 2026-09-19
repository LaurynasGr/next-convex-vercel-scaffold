import { getTranslations } from '@scaffold/i18n/server'
import { Card, CardContent } from '@scaffold/ui/components/card'
import { DatabaseIcon, LayersIcon, type LucideIcon, ShieldCheckIcon, TextCursorInputIcon } from 'lucide-react'
import { DevSignInButton, GoogleSignInButton } from './partials/sign-in-buttons'

/** The selling points; `key` is the line's key under `auth.features`. */
const FEATURES = [
    { key: 'auth', icon: ShieldCheckIcon },
    { key: 'data', icon: DatabaseIcon },
    { key: 'forms', icon: TextCursorInputIcon },
] as const satisfies { key: string; icon: LucideIcon }[]

export async function SignInContent() {
    const t = await getTranslations('auth')
    return (
        <Card className="w-full max-w-md py-10">
            <CardContent className="flex flex-col items-center gap-6 px-8 text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <LayersIcon className="size-7" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold tracking-tight">{t('title')}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{t('description')}</p>
                </div>
                <ul className="space-y-2.5 text-left text-sm text-muted-foreground">
                    {FEATURES.map(({ key, icon: Icon }) => (
                        <li key={key} className="flex items-center gap-2.5">
                            <Icon className="size-4 shrink-0 text-primary" />
                            {t(`features.${key}`)}
                        </li>
                    ))}
                </ul>
                <GoogleSignInButton />
                <DevSignInButton />
            </CardContent>
        </Card>
    )
}
