import { useQuery } from 'convex/react'
import { api } from '../api'

export function useViewer() {
    return useQuery(api.users.viewer)
}

/** True when the backend offers the Google-less dev sign-in (local deployments only). */
export function useDevSignInEnabled() {
    return useQuery(api.users.devSignInEnabled) === true
}
