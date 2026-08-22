import { describe, expect, it } from 'vitest'
import { theme } from './theme'

describe('theme', () => {
	it('exposes contract colors as CSS variables', () => {
		expect(theme.color.accent1).toBe('var(--cnx-color-accent1)')
		expect(theme.color.surface0).toBe('var(--cnx-color-surface0)')
		expect(theme.color.text1).toBe('var(--cnx-color-text1)')
		expect(theme.color.error).toBe('var(--cnx-color-error)')
	})

	it('exposes space, type, and motion tokens', () => {
		expect(theme.space[2]).toBe('var(--cnx-space-2)')
		expect(theme.font.sans).toBe('var(--cnx-font-sans)')
		expect(theme.fontSize.base).toBe('var(--cnx-font-size-base)')
		expect(theme.transition.fast).toBe('var(--cnx-transition-fast)')
		expect(theme.focusRing).toBe('var(--cnx-focus-ring)')
	})
})
