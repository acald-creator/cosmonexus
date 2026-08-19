import { describe, it, expect } from 'vitest'
import { vanillaExtractContractFormat } from './ve-contract'
import type { TransformedToken, Dictionary } from 'style-dictionary/types'

/**
 * Helper to create a minimal mock token with just the fields the format uses.
 */
function makeToken(path: string[]): TransformedToken {
	return {
		path,
		name: path.join('-'),
		value: `resolved-${path.join('-')}`,
		$value: `resolved-${path.join('-')}`,
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

function runFormat(tokens: TransformedToken[]): string {
	const formatFn = vanillaExtractContractFormat.format
	return formatFn({
		dictionary: makeDictionary(tokens),
		file: {} as any,
		options: {} as any,
		platform: {} as any,
	}) as string
}

describe('vanilla-extract/contract format', () => {
	it('has the correct format name', () => {
		expect(vanillaExtractContractFormat.name).toBe('vanilla-extract/contract')
	})

	it('emits createThemeContract import', () => {
		const output = runFormat([makeToken(['color', 'surface0'])])
		expect(output).toContain("import { createThemeContract } from '@vanilla-extract/css'")
	})

	it('emits tokens export with createThemeContract call', () => {
		const output = runFormat([makeToken(['color', 'surface0'])])
		expect(output).toContain('export const tokens = createThemeContract({')
	})

	it('produces null values at leaf positions', () => {
		const output = runFormat([
			makeToken(['color', 'surface0']),
			makeToken(['color', 'text1']),
		])
		expect(output).toContain('surface0: null,')
		expect(output).toContain('text1: null,')
	})

	it('nests tokens under their top-level category', () => {
		const output = runFormat([
			makeToken(['color', 'surface0']),
			makeToken(['font', 'sans']),
		])
		expect(output).toContain('color: {')
		expect(output).toContain('font: {')
	})

	it('handles flat top-level tokens (focusRing, borderSubtle)', () => {
		const output = runFormat([
			makeToken(['focusRing']),
			makeToken(['borderSubtle']),
		])
		expect(output).toContain('focusRing: null,')
		expect(output).toContain('borderSubtle: null,')
	})

	it('filters out primitives-layer tokens', () => {
		const output = runFormat([
			makeToken(['primitives', 'color', 'primary', '500']),
			makeToken(['color', 'accent1']),
		])
		expect(output).not.toContain('primitives')
		expect(output).toContain('accent1: null,')
	})

	it('filters out unknown top-level keys', () => {
		const output = runFormat([
			makeToken(['unknownCategory', 'foo']),
			makeToken(['color', 'accent1']),
		])
		expect(output).not.toContain('unknownCategory')
		expect(output).toContain('accent1: null,')
	})

	it('does not quote numeric keys in the space category', () => {
		const output = runFormat([
			makeToken(['space', '1']),
			makeToken(['space', '2']),
		])
		expect(output).toContain('1: null,')
		expect(output).toContain('2: null,')
		// Should not have quotes around numeric keys
		expect(output).not.toContain("'1'")
		expect(output).not.toContain("'2'")
	})

	it('produces the full contract shape matching existing contract.css.ts', () => {
		// Create tokens matching the existing contract shape
		const tokens = [
			// color
			...['surface0', 'surface1', 'surface2', 'surface3', 'surface4',
				'text1', 'text2', 'text3',
				'accent1', 'accent2', 'accent3', 'accentBg',
				'success', 'successBg', 'error', 'errorBg', 'errorBorder',
				'warning', 'warningBg', 'warningBorder'].map(k => makeToken(['color', k])),
			// font
			makeToken(['font', 'sans']),
			makeToken(['font', 'mono']),
			// fontSize
			...['xs', 'sm', 'base', 'lg', 'xl', 'xxl'].map(k => makeToken(['fontSize', k])),
			// fontWeight
			...['medium', 'semibold', 'bold'].map(k => makeToken(['fontWeight', k])),
			// lineHeight
			makeToken(['lineHeight', 'tight']),
			makeToken(['lineHeight', 'normal']),
			// space
			...['1', '2', '3', '4', '5', '6', '8', '10'].map(k => makeToken(['space', k])),
			// radius
			...['sm', 'md', 'lg', 'full'].map(k => makeToken(['radius', k])),
			// shadow
			makeToken(['shadow', 'md']),
			makeToken(['shadow', 'glow']),
			// transition
			...['fast', 'normal', 'slow'].map(k => makeToken(['transition', k])),
			// easing
			makeToken(['easing', 'out']),
			makeToken(['easing', 'inOut']),
			// flat tokens
			makeToken(['focusRing']),
			makeToken(['borderSubtle']),
		]

		const output = runFormat(tokens)

		// Verify it's valid-looking TypeScript
		expect(output).toContain("import { createThemeContract } from '@vanilla-extract/css'")
		expect(output).toContain('export const tokens = createThemeContract({')

		// Verify all top-level categories present
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
		expect(output).toContain('focusRing: null,')
		expect(output).toContain('borderSubtle: null,')
	})
})
