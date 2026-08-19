import type { Format, FormatFnArguments } from 'style-dictionary/types'

/**
 * Known top-level keys that belong in the vanilla-extract theme.
 * Only tokens whose first path segment matches one of these are included.
 * This filters out primitives-layer tokens that are implementation details.
 */
const SEMANTIC_KEYS = new Set([
	'color',
	'font',
	'fontSize',
	'fontWeight',
	'lineHeight',
	'space',
	'radius',
	'shadow',
	'transition',
	'easing',
	'focusRing',
	'borderSubtle',
])

/**
 * Build a nested object structure from token paths and their resolved values.
 * Each leaf is set to the token's resolved string value.
 */
function buildThemeObject(
	entries: Array<{ path: string[]; value: string }>,
): Record<string, unknown> {
	const root: Record<string, unknown> = {}

	for (const { path, value } of entries) {
		let current = root
		for (let i = 0; i < path.length; i++) {
			const key = path[i]
			if (i === path.length - 1) {
				// Leaf node — set to resolved value
				current[key] = value
			} else {
				// Intermediate node — ensure object exists
				if (current[key] === undefined || typeof current[key] === 'string') {
					current[key] = {}
				}
				current = current[key] as Record<string, unknown>
			}
		}
	}

	return root
}

/**
 * Serialize the theme object to a formatted TypeScript string with tabs for indentation.
 * String leaf values are single-quoted.
 */
function serializeTheme(obj: Record<string, unknown>, indent = 1): string {
	const entries: string[] = []
	const tab = '\t'.repeat(indent)

	for (const [key, value] of Object.entries(obj)) {
		// Quote keys that contain special characters or start with a number
		const needsQuotes = /^\d|[^a-zA-Z0-9_$]/.test(key)
		const formattedKey = needsQuotes ? `'${key}'` : key

		if (typeof value === 'string') {
			entries.push(`${tab}${formattedKey}: '${escapeString(value)}',`)
		} else if (typeof value === 'object' && value !== null) {
			const nested = serializeTheme(value as Record<string, unknown>, indent + 1)
			entries.push(`${tab}${formattedKey}: {\n${nested}\n${tab}},`)
		}
	}

	return entries.join('\n')
}

/**
 * Escapes single quotes and backslashes in a string for safe embedding in a TS string literal.
 */
function escapeString(str: string): string {
	return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

/**
 * Custom Style Dictionary v4 format that generates a vanilla-extract
 * `createTheme` file from the resolved token dictionary.
 *
 * The output satisfies the contract shape with actual resolved values
 * (OKLCH for colors, rem for sizes, etc.).
 *
 * Accepts a `themeName` option to set the export name (e.g., darkTheme, lightTheme).
 *
 * Requirements traced: 5.3, 3.4
 */
export const vanillaExtractThemeFormat: Format = {
	name: 'vanilla-extract/theme',
	format: ({ dictionary, options }: FormatFnArguments): string => {
		const themeName = (options as Record<string, unknown>)?.themeName ?? 'theme'
		const usesDtcg = (options as Record<string, unknown>)?.usesDtcg !== false

		// Filter tokens to only those belonging to known semantic keys
		const themeTokens = dictionary.allTokens.filter(
			(token) => token.path.length > 0 && SEMANTIC_KEYS.has(token.path[0]),
		)

		// Extract path + resolved value pairs
		const entries = themeTokens.map((token) => ({
			path: token.path,
			value: String(usesDtcg ? token.$value : token.value),
		}))

		// Build the nested theme object from token paths and values
		const themeObj = buildThemeObject(entries)

		// Serialize to TypeScript source
		const body = serializeTheme(themeObj)

		return [
			"import { createTheme } from '@vanilla-extract/css'",
			"import { tokens } from '../contract.css'",
			'',
			`export const ${themeName} = createTheme(tokens, {`,
			body,
			'})',
			'',
		].join('\n')
	},
}
