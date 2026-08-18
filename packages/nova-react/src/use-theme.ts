import { type Context, createContext, useContext } from 'react'

export const ThemeContext = /* #__PURE__ */ createContext<Record<string, unknown>>({})
if (process.env.NODE_ENV !== 'production') {
	ThemeContext.displayName = 'NovaThemeContext'
}

/**
 * Access the current theme from the nearest ThemeProvider.
 * Throws if no provider is found above the component in the tree.
 */
export function useTheme<T>(): T {
	const theme = useContext(ThemeContext as unknown as Context<T | undefined>)
	if (!theme) {
		throw new Error(
			'useTheme: `theme` is undefined. Seems you forgot to wrap your app in `<ThemeProvider />`',
		)
	}

	return theme
}
