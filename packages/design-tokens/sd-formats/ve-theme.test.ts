import { describe, it, expect } from 'vitest'
import { vanillaExtractThemeFormat } from './ve-theme'
import type { TransformedToken, Dictionary } from 'style-dictionary/types'

/**
 * Helper to create a minimal mock token with path and resolved value.
 */
function makeToken(path: string[], value: string): TransformedToken {
	return {
		path,
		name: path.join('-'),
		value,
		$value: value,
		original: { $value: 'original' },
		filePath: 'tokens/semantic/test.json',
		isSource: true,
	} as unknown as TransformedToken
}

function makeDictionary(tokens: TransformedToken[]): Dictionary {
	return {
		allTokens: tokens,
		tokens: {},
		tokenMap: new Map(),
	} as unknown as Dictionary
}

function runFormat(tokens: TransformedToken[], options?: Record<string, unknown>): string {
	const formatFn = vanillaExtractThemeFormat.format
	return formatFn({
		dictionary: makeDictionary(tokens),
		file: {} as any,
		options: { usesDtcg: true, ...options } as any,
		platform: {} as any,
	}) as string
}

describe('vanilla-extract/theme format', () => {
	it('has the correct format name', () => {
		expect(vanillaExtractThemeFormat.name).toBe('vanilla-extract/theme')
	})

	it('emits createTheme import from @vanilla-extract/css', () => {
		const output = runFormat([makeToken(['color', 'surface0'], 'oklch(0.13 0.015 260)')])
		expect(output).toContain("import { createTheme } from '@vanilla-extract/css'")
	})

	it('emits tokens import from ../contract.css', () => {
		const output = runFormat([makeToken(['color', 'surface0'], 'oklch(0.13 0.015 260)')])
		expect(output).toContain("import { tokens } from '../contract.css'")
	})

	it('uses default themeName when not provided', () => {
		const output = runFormat([makeToken(['color', 'surface0'], 'oklch(0.13 0.015 260)')])
		expect(output).toContain('export const theme = createTheme(tokens, {')
	})

	it('uses custom themeName from options', () => {
		const output = runFormat(
			[makeToken(['color', 'surface0'], 'oklch(0.13 0.015 260)')],
			{ themeName: 'darkTheme' },
		)
		expect(output).toContain('export const darkTheme = createTheme(tokens, {')
	})

	it('produces resolved string values at leaf positions', () => {
		const output = runFormat([
			makeToken(['color', 'surface0'], 'oklch(0.13 0.015 260)'),
			makeToken(['color', 'text1'], 'oklch(0.95 0.01 260)'),
		])
		expect(output).toContain("surface0: 'oklch(0.13 0.015 260)',")
		expect(output).toContain("text1: 'oklch(0.95 0.01 260)',")
	})

	it('nests tokens under their top-level category', () => {
		const output = runFormat([
			makeToken(['color', 'surface0'], 'oklch(0.13 0.015 260)'),
			makeToken(['font', 'sans'], "'IBM Plex Sans', sans-serif"),
		])
		expect(output).toContain('color: {')
		expect(output).toContain('font: {')
	})

	it('handles flat top-level tokens (focusRing, borderSubtle)', () => {
		const output = runFormat([
			makeToken(['focusRing'], '0 0 0 2px oklch(0.17 0.015 260), 0 0 0 4px oklch(0.72 0.18 295)'),
			makeToken(['borderSubtle'], '1px solid oklch(0.32 0.02 260)'),
		])
		expect(output).toContain("focusRing: '0 0 0 2px oklch(0.17 0.015 260), 0 0 0 4px oklch(0.72 0.18 295)',")
		expect(output).toContain("borderSubtle: '1px solid oklch(0.32 0.02 260)',")
	})

	it('filters out primitives-layer tokens', () => {
		const output = runFormat([
			makeToken(['primitives', 'color', 'primary', '500'], 'oklch(0.63 0.18 295)'),
			makeToken(['color', 'accent1'], 'oklch(0.72 0.18 295)'),
		])
		expect(output).not.toContain('primitives')
		expect(output).toContain("accent1: 'oklch(0.72 0.18 295)',")
	})

	it('filters out unknown top-level keys', () => {
		const output = runFormat([
			makeToken(['unknownCategory', 'foo'], 'bar'),
			makeToken(['color', 'accent1'], 'oklch(0.72 0.18 295)'),
		])
		expect(output).not.toContain('unknownCategory')
		expect(output).toContain("accent1: 'oklch(0.72 0.18 295)',")
	})

	it('quotes numeric keys in the space category', () => {
		const output = runFormat([
			makeToken(['space', '1'], '0.25rem'),
			makeToken(['space', '2'], '0.5rem'),
		])
		expect(output).toContain("'1': '0.25rem',")
		expect(output).toContain("'2': '0.5rem',")
	})

	it('escapes single quotes in values', () => {
		const output = runFormat([
			makeToken(['font', 'sans'], "'IBM Plex Sans', -apple-system, sans-serif"),
		])
		expect(output).toContain("\\'IBM Plex Sans\\'")
	})

	it('produces a full theme matching the dark theme shape', () => {
		const tokens = [
			// color
			makeToken(['color', 'surface0'], 'oklch(0.13 0.015 260)'),
			makeToken(['color', 'surface1'], 'oklch(0.17 0.015 260)'),
			makeToken(['color', 'accent1'], 'oklch(0.72 0.18 295)'),
			// font
			makeToken(['font', 'sans'], "'IBM Plex Sans', sans-serif"),
			makeToken(['font', 'mono'], "'IBM Plex Mono', monospace"),
			// fontSize
			makeToken(['fontSize', 'base'], '0.9375rem'),
			// fontWeight
			makeToken(['fontWeight', 'medium'], '500'),
			// lineHeight
			makeToken(['lineHeight', 'normal'], '1.5'),
			// space
			makeToken(['space', '4'], '1rem'),
			// radius
			makeToken(['radius', 'md'], '6px'),
			// shadow
			makeToken(['shadow', 'md'], '0 4px 12px oklch(0 0 0 / 0.4)'),
			// transition
			makeToken(['transition', 'fast'], '120ms'),
			// easing
			makeToken(['easing', 'out'], 'cubic-bezier(0.16, 1, 0.3, 1)'),
			// flat tokens
			makeToken(['focusRing'], '0 0 0 2px oklch(0.17 0.015 260), 0 0 0 4px oklch(0.72 0.18 295)'),
			makeToken(['borderSubtle'], '1px solid oklch(0.32 0.02 260)'),
		]

		const output = runFormat(tokens, { themeName: 'darkTheme' })

		// Verify correct structure
		expect(output).toContain("import { createTheme } from '@vanilla-extract/css'")
		expect(output).toContain("import { tokens } from '../contract.css'")
		expect(output).toContain('export const darkTheme = createTheme(tokens, {')

		// Verify all top-level categories are present
		expect(output).toContain('color: {')
		expect(output).toContain('font: {')
		expect(output).toContain('fontSize: {')
		expect(output).toContain('fontWeight: {')
		expect(output).toContain('lineHeight: {')
		expect(output).toContain('space: {')
		expect(output).toContain('radius: {')
		expect(output).toContain('shadow: {')
		expect(output).toContain('transition: {')
		expect(output).toContain('easing: {')
	})

	it('reads $value when usesDtcg is true', () => {
		const token = {
			path: ['color', 'surface0'],
			name: 'color-surface0',
			value: 'wrong-value',
			$value: 'oklch(0.13 0.015 260)',
			original: { $value: 'original' },
			filePath: 'test.json',
			isSource: true,
		} as unknown as TransformedToken

		const output = runFormat([token], { usesDtcg: true })
		expect(output).toContain("surface0: 'oklch(0.13 0.015 260)',")
		expect(output).not.toContain('wrong-value')
	})

	it('reads value when usesDtcg is false', () => {
		const token = {
			path: ['color', 'surface0'],
			name: 'color-surface0',
			value: 'oklch(0.13 0.015 260)',
			$value: 'wrong-value',
			original: { $value: 'original' },
			filePath: 'test.json',
			isSource: true,
		} as unknown as TransformedToken

		const output = runFormat([token], { usesDtcg: false })
		expect(output).toContain("surface0: 'oklch(0.13 0.015 260)',")
		expect(output).not.toContain('wrong-value')
	})
})
