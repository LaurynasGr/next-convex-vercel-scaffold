export const APP_NAME = 'Scaffold'

/** The document title of a page: its own name, then the app's. */
export function pageTitle(page: string): string {
    return `${page} · ${APP_NAME}`
}
