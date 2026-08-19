import type { Format, FormatFnArguments } from 'style-dictionary/types'

/**
 * Known top-level keys that belong in the vanilla-extract theme contract.
 * Only tokens whose first path segment matches one of these are included.
 * This filters out primitives-layer tokens that are implementation details.
 */
const CONTRACT_KEYS = new Set([
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
 * Build a nested object structure from an array of token paths.
 * Each leaf is set to `null` (the contract slot marker).
 */
function buildContractObject(paths: string[][]): Record<string, unknown> {
	const root: Record<string, unknown> = {}

	for (const path of paths) {
		let current = root
		for (let i = 0; i < path.length; i++) {
			const key = path[i]
			if (i === path.length - 1) {
				// Leaf node — set to null
				current[key] = null
			} else {
				// Intermediate node — ensure object exists
				if (current[key] === undefined || current[key] === null) {
					current[key] = {}
				}
				current = current[key] as Record<string, unknown>
			}
		}
	}

	return root
}

/**
 * Serialize the contract object to a formatted string with tabs for indentation.
 * Uses `null` for leaf values (no quotes).
 */
function serializeContract(obj: Record<string, unknown>, indent = 1): string {
	const entries: string[] = []
	const tab = '\t'.repeat(indent)

	for (const [key, value] of Object.entries(obj)) {
		// Only quote keys that contain characters invalid in unquoted JS property names.
		// Numeric-only keys (like "1", "10") are valid unquoted in object literals.
		const needsQuotes = /[^a-zA-Z0-9_$]/.test(key)
		const formattedKey = needsQuotes ? `'${key}'` : key

		if (value === null) {
			entries.push(`${tab}${formattedKey}: null,`)
		} else if (typeof value === 'object' && value !== null) {
			const nested = serializeContract(value as Record<string, unknown>, indent + 1)
			entries.push(`${tab}${formattedKey}: {\n${nested}\n${tab}},`)
		}
	}

	return entries.join('\n')
}

/**
 * Custom Style Dictionary v4 format that generates a vanilla-extract
 * `createThemeContract` file from the resolved token dictionary.
 *
 * The output matches the shape of the existing `contract.css.ts` —
 * a flat or nested object with `null` at every leaf position.
 */
export const vanillaExtractContractFormat: Format = {
	name: 'vanilla-extract/contract',
	format: ({ dictionary }: FormatFnArguments): string => {
		// Filter tokens to only those belonging to known contract keys
		const contractTokens = dictionary.allTokens.filter(
			(token) => token.path.length > 0 && CONTRACT_KEYS.has(token.path[0]),
		)

		// Build the nested contract object from token paths
		const contractObj = buildContractObject(contractTokens.map((t) => t.path))

		// Serialize to TypeScript source
		const body = serializeContract(contractObj)

		return [
			"import { createThemeContract } from '@vanilla-extract/css'",
			'',
			'/**',
			' * Theme contract defining all semantic design token slots.',
			' *',
			' * This is the single source of truth for the design system\'s token API.',
			' * Components reference these CSS variables; concrete values are provided',
			' * by theme implementations (dark, light, etc.).',
			' *',
			' * Consumers: @cosmonexus/nova-ui, @cosmonexus/nova-ui-solid',
			' */',
			'export const tokens = createThemeContract({',
			body,
			'})',
			'',
		].join('\n')
	},
}
