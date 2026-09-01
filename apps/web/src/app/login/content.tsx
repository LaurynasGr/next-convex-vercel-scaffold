import { Card, CardContent } from '@scaffold/ui/components/card'
import { Database, Layers, ShieldCheck, TextCursorInput } from 'lucide-react'
import { DevSignInButton, GoogleSignInButton } from './partials/sign-in-buttons'

const FEATURES = [
    { icon: ShieldCheck, text: 'Google sign-in with server-side route protection' },
    { icon: Database, text: 'Realtime data and functions on Convex' },
    { icon: TextCursorInput, text: 'Typed forms with react-hook-form and zod' },
]

export function SignInContent() {
    return (
        <Card className="mx-auto mt-10 max-w-md py-10">
            <CardContent className="flex flex-col items-center gap-6 px-8 text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Layers className="size-7" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold tracking-tight">Welcome back</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Sign in to continue to your account.</p>
                </div>
                <ul className="space-y-2.5 text-left text-sm text-muted-foreground">
                    {FEATURES.map(({ icon: Icon, text }) => (
                        <li key={text} className="flex items-center gap-2.5">
                            <Icon className="size-4 shrink-0 text-primary" />
                            {text}
                        </li>
                    ))}
                </ul>
                <GoogleSignInButton />
                <DevSignInButton />
            </CardContent>
        </Card>
    )
}
