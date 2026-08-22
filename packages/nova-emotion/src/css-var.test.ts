import { describe, expect, it } from 'vitest'
import { cssVar } from './css-var'

describe('cssVar', () => {
	it('joins path segments under the cnx prefix', () => {
		expect(cssVar('color', 'accent1')).toBe('var(--cnx-color-accent1)')
		expect(cssVar('space', 1)).toBe('var(--cnx-space-1)')
	})

	it('kebab-cases camelCase segments', () => {
		expect(cssVar('fontSize', 'base')).toBe('var(--cnx-font-size-base)')
		expect(cssVar('focusRing')).toBe('var(--cnx-focus-ring)')
		expect(cssVar('borderSubtle')).toBe('var(--cnx-border-subtle)')
		expect(cssVar('easing', 'inOut')).toBe('var(--cnx-easing-in-out)')
	})
})
