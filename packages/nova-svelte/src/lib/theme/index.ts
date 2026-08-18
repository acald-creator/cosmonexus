import { getContext, setContext } from 'svelte'
import { writable, type Writable } from 'svelte/store'

const THEME_CONTEXT_KEY = Symbol('nova-theme')

export type Theme = Record<string, unknown>

/**
 * Sets the theme in Svelte context. Call this in a layout or root component.
 * Downstream components can access it via `getTheme()`.
 *
 * @example
 * ```svelte
 * <!-- +layout.svelte -->
 * <script>
 *   import { setTheme } from '@cosmonexus/nova-svelte'
 *   import { darkTheme } from '@cosmonexus/design-tokens'
 *   setTheme(darkTheme)
 * </script>
 * <slot />
 * ```
 */
export function setTheme<T extends Theme>(theme: T): Writable<T> {
	const store = writable<T>(theme)
	setContext(THEME_CONTEXT_KEY, store)
	return store
}

/**
 * Retrieves the theme store from Svelte context.
 * Must be called in a component that is a descendant of one that called `setTheme()`.
 *
 * @example
 * ```svelte
 * <script>
 *   import { getTheme } from '@cosmonexus/nova-svelte'
 *   const theme = getTheme()
 * </script>
 * <div style:color={$theme.primary}>Themed content</div>
 * ```
 */
export function getTheme<T extends Theme = Theme>(): Writable<T> {
	const theme = getContext<Writable<T> | undefined>(THEME_CONTEXT_KEY)
	if (!theme) {
		throw new Error(
			'getTheme: theme is undefined. Did you forget to call setTheme() in a parent component?',
		)
	}
	return theme
}
