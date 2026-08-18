import { createTheme } from '@vanilla-extract/css'
import { tokens } from '../contract.css'

/**
 * Dark theme — OKLCH color values for perceptual uniformity.
 *
 * Accent: Teal/Cyan (hue 175)
 * Surfaces: Cool blue-gray (hue 240)
 * Font: IBM Plex Sans + IBM Plex Mono
 */
export const darkTheme = createTheme(tokens, {
	color: {
		surface0: 'oklch(0.13 0.02 240)',
		surface1: 'oklch(0.18 0.02 240)',
		surface2: 'oklch(0.23 0.02 240)',
		surface3: 'oklch(0.28 0.02 240)',
		surface4: 'oklch(0.33 0.02 240)',

		text1: 'oklch(0.96 0.01 240)',
		text2: 'oklch(0.75 0.03 240)',
		text3: 'oklch(0.55 0.03 240)',

		accent1: 'oklch(0.78 0.15 175)',
		accent2: 'oklch(0.85 0.16 175)',
		accent3: 'oklch(0.70 0.13 175)',
		accentBg: 'oklch(0.78 0.15 175 / 0.08)',

		success: 'oklch(0.78 0.15 160)',
		successBg: 'oklch(0.78 0.15 160 / 0.1)',
		error: 'oklch(0.68 0.18 18)',
		errorBg: 'oklch(0.68 0.18 18 / 0.1)',
		errorBorder: 'oklch(0.68 0.18 18 / 0.3)',
		warning: 'oklch(0.80 0.14 75)',
		warningBg: 'oklch(0.80 0.14 75 / 0.1)',
		warningBorder: 'oklch(0.80 0.14 75 / 0.3)',
	},

	font: {
		sans: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif",
		mono: "'IBM Plex Mono', ui-monospace, 'Cascadia Code', monospace",
	},

	fontSize: {
		xs: '0.75rem',
		sm: '0.8125rem',
		base: '0.9375rem',
		lg: '1.125rem',
		xl: '1.375rem',
		xxl: '1.75rem',
	},

	fontWeight: {
		medium: '500',
		semibold: '600',
		bold: '700',
	},

	lineHeight: {
		tight: '1.25',
		normal: '1.5',
	},

	space: {
		1: '0.25rem',
		2: '0.5rem',
		3: '0.75rem',
		4: '1rem',
		5: '1.25rem',
		6: '1.5rem',
		8: '2rem',
		10: '2.5rem',
	},

	radius: {
		sm: '4px',
		md: '6px',
		lg: '8px',
		full: '9999px',
	},

	shadow: {
		md: '0 4px 12px oklch(0 0 0 / 0.4)',
		glow: '0 0 20px oklch(0.78 0.15 175 / 0.15)',
	},

	transition: {
		fast: '120ms',
		normal: '200ms',
		slow: '350ms',
	},

	easing: {
		out: 'cubic-bezier(0.16, 1, 0.3, 1)',
		inOut: 'cubic-bezier(0.45, 0, 0.55, 1)',
	},

	focusRing: '0 0 0 2px oklch(0.18 0.02 240), 0 0 0 4px oklch(0.78 0.15 175)',
	borderSubtle: '1px solid oklch(0.33 0.02 240)',
})
