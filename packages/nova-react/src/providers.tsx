import type { JSX, ReactNode } from 'react'

import { ThemeContext } from './use-theme'

type ThemeProviderProps = {
	theme: Record<string, unknown>
	children: ReactNode
}

/**
 * Provides a theme object to all descendants via context.
 */
export function ThemeProvider(props: ThemeProviderProps): JSX.Element {
	return <ThemeContext.Provider value={props.theme}>{props.children}</ThemeContext.Provider>
}
