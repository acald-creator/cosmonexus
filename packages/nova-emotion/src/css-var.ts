/**
 * Build a Cosmonexus CSS custom-property reference.
 *
 * Paths match the design-token contract (`color.accent1`, `fontSize.base`).
 * CamelCase segments become kebab-case (`fontSize` → `font-size`).
 */
export function cssVar(...path: Array<string | number>): `var(--cnx-${string})` {
	const name = path
		.map((segment) =>
			String(segment)
				.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
				.toLowerCase(),
		)
		.join('-')

	return `var(--cnx-${name})`
}
