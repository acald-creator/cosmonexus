import { createThemeContract } from '@vanilla-extract/css'

/**
 * Theme contract defining all semantic design token slots.
 *
 * This is the single source of truth for the design system's token API.
 * Components reference these CSS variables; concrete values are provided
 * by theme implementations (dark, light, etc.).
 *
 * Consumers: @cosmonexus/nova-ui, @cosmonexus/nova-ui-solid
 */
export const tokens = createThemeContract({
	color: {
		// Surfaces (background layers, dark → light)
		surface0: null,
		surface1: null,
		surface2: null,
		surface3: null,
		surface4: null,

		// Text hierarchy
		text1: null,
		text2: null,
		text3: null,

		// Accent (primary interactive color)
		accent1: null,
		accent2: null,
		accent3: null,
		accentBg: null,

		// Semantic status colors
		success: null,
		successBg: null,
		error: null,
		errorBg: null,
		errorBorder: null,
		warning: null,
		warningBg: null,
		warningBorder: null,
	},

	font: {
		sans: null,
		mono: null,
	},

	fontSize: {
		xs: null,
		sm: null,
		base: null,
		lg: null,
		xl: null,
		xxl: null,
	},

	fontWeight: {
		medium: null,
		semibold: null,
		bold: null,
	},

	lineHeight: {
		tight: null,
		normal: null,
	},

	space: {
		1: null,
		2: null,
		3: null,
		4: null,
		5: null,
		6: null,
		8: null,
		10: null,
	},

	radius: {
		sm: null,
		md: null,
		lg: null,
		full: null,
	},

	shadow: {
		md: null,
		glow: null,
	},

	transition: {
		fast: null,
		normal: null,
		slow: null,
	},

	easing: {
		out: null,
		inOut: null,
	},

	focusRing: null,
	borderSubtle: null,
})
