import { Button } from '@scaffold/ui/components/button'
import { Card, CardContent } from '@scaffold/ui/components/card'
import { Layers, Plus } from 'lucide-react'

export default function HomePage() {
    return (
        <Card className="mx-auto mt-10 max-w-md py-10">
            <CardContent className="flex flex-col items-center gap-4 px-8 text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Layers className="size-7" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold tracking-tight">Your app starts here</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        You are signed in. Replace this page with your first screen.
                    </p>
                </div>
                <Button disabled>
                    <Plus />
                    First action
                </Button>
            </CardContent>
        </Card>
    )
}
