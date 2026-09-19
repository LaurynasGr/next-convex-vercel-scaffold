// No 'use client': server components read the cookie name to pass `defaultOpen`.

/** Cookie holding the last sidebar state ('true' / 'false'), read on the server so the first paint already matches. */
export const SIDEBAR_COOKIE_NAME = 'sidebar_state'
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365
/** Cmd/Ctrl + this key toggles the sidebar. */
export const SIDEBAR_KEYBOARD_SHORTCUT = 'b'
