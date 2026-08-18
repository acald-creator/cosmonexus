import { createTheme } from '@vanilla-extract/css'
import { tokens } from '../contract.css'

/**
 * Light theme — OKLCH color values for perceptual uniformity.
 *
 * Accent: Warm purple (hue 295, same as dark theme but adjusted lightness)
 * Surfaces: Warm white → light gray (hue 260, slight violet undertone)
 * Semantic: Same hue family as dark, shifted for light backgrounds
 */
export const lightTheme = createTheme(tokens, {
	color: {
		// Surfaces — light with subtle warm undertone (hue 260)
		surface0: 'oklch(0.98 0.005 260)',
		surface1: 'oklch(0.96 0.005 260)',
		surface2: 'oklch(0.93 0.008 260)',
		surface3: 'oklch(0.89 0.01 260)',
		surface4: 'oklch(0.84 0.012 260)',

		// Text — dark on light
		text1: 'oklch(0.18 0.02 260)',
		text2: 'oklch(0.40 0.02 260)',
		text3: 'oklch(0.55 0.015 260)',

		// Accent — warm purple (same hue 295, darker for light bg contrast)
		accent1: 'oklch(0.52 0.22 295)',
		accent2: 'oklch(0.45 0.24 295)',
		accent3: 'oklch(0.58 0.20 295)',
		accentBg: 'oklch(0.52 0.22 295 / 0.08)',

		// Success — green (hue 145)
		success: 'oklch(0.45 0.15 145)',
		successBg: 'oklch(0.45 0.15 145 / 0.08)',

		// Error — warm red (hue 18)
		error: 'oklch(0.52 0.2 18)',
		errorBg: 'oklch(0.52 0.2 18 / 0.08)',
		errorBorder: 'oklch(0.52 0.2 18 / 0.25)',

		// Warning — amber (hue 75)
		warning: 'oklch(0.55 0.16 75)',
		warningBg: 'oklch(0.55 0.16 75 / 0.08)',
		warningBorder: 'oklch(0.55 0.16 75 / 0.25)',
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
		md: '0 4px 12px oklch(0 0 0 / 0.08)',
		glow: '0 0 20px oklch(0.52 0.22 295 / 0.15)',
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

	focusRing: '0 0 0 2px oklch(0.96 0.005 260), 0 0 0 4px oklch(0.52 0.22 295)',
	borderSubtle: '1px solid oklch(0.84 0.012 260)',
})
