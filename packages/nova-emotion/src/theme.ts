import { cssVar } from './css-var'

/**
 * Emotion-facing token map. Values are `var(--cnx-*)` references that resolve
 * after `@cosmonexus/nova-emotion/tokens` (or the design-tokens CSS) is loaded.
 *
 * Shape matches the `@cosmonexus/design-tokens` contract. Do not import the
 * vanilla-extract `tokens` object here — those names are hashed VE variables,
 * not the public `--cnx-*` custom properties.
 */
export const theme = {
	color: {
		accent1: cssVar('color', 'accent1'),
		accent2: cssVar('color', 'accent2'),
		accent3: cssVar('color', 'accent3'),
		accentBg: cssVar('color', 'accentBg'),
		success: cssVar('color', 'success'),
		successBg: cssVar('color', 'successBg'),
		error: cssVar('color', 'error'),
		errorBg: cssVar('color', 'errorBg'),
		errorBorder: cssVar('color', 'errorBorder'),
		warning: cssVar('color', 'warning'),
		warningBg: cssVar('color', 'warningBg'),
		warningBorder: cssVar('color', 'warningBorder'),
		surface0: cssVar('color', 'surface0'),
		surface1: cssVar('color', 'surface1'),
		surface2: cssVar('color', 'surface2'),
		surface3: cssVar('color', 'surface3'),
		surface4: cssVar('color', 'surface4'),
		text1: cssVar('color', 'text1'),
		text2: cssVar('color', 'text2'),
		text3: cssVar('color', 'text3'),
	},
	space: {
		1: cssVar('space', 1),
		2: cssVar('space', 2),
		3: cssVar('space', 3),
		4: cssVar('space', 4),
		5: cssVar('space', 5),
		6: cssVar('space', 6),
		8: cssVar('space', 8),
		10: cssVar('space', 10),
	},
	radius: {
		sm: cssVar('radius', 'sm'),
		md: cssVar('radius', 'md'),
		lg: cssVar('radius', 'lg'),
		full: cssVar('radius', 'full'),
	},
	shadow: {
		md: cssVar('shadow', 'md'),
		glow: cssVar('shadow', 'glow'),
	},
	transition: {
		fast: cssVar('transition', 'fast'),
		normal: cssVar('transition', 'normal'),
		slow: cssVar('transition', 'slow'),
	},
	easing: {
		out: cssVar('easing', 'out'),
		inOut: cssVar('easing', 'inOut'),
	},
	focusRing: cssVar('focusRing'),
	borderSubtle: cssVar('borderSubtle'),
	font: {
		sans: cssVar('font', 'sans'),
		mono: cssVar('font', 'mono'),
	},
	fontSize: {
		xs: cssVar('fontSize', 'xs'),
		sm: cssVar('fontSize', 'sm'),
		base: cssVar('fontSize', 'base'),
		lg: cssVar('fontSize', 'lg'),
		xl: cssVar('fontSize', 'xl'),
		xxl: cssVar('fontSize', 'xxl'),
	},
	fontWeight: {
		medium: cssVar('fontWeight', 'medium'),
		semibold: cssVar('fontWeight', 'semibold'),
		bold: cssVar('fontWeight', 'bold'),
	},
	lineHeight: {
		tight: cssVar('lineHeight', 'tight'),
		normal: cssVar('lineHeight', 'normal'),
	},
} as const

export type Theme = typeof theme
