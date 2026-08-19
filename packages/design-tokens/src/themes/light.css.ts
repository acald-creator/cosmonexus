import { createTheme } from '@vanilla-extract/css'
import { tokens } from '../contract.css'

export const lightTheme = createTheme(tokens, {
	color: {
		accent1: 'oklch(0.67 0.176 295)',
		accent2: 'oklch(0.76 0.138 295)',
		accent3: 'oklch(0.59 0.213 295)',
		accentBg: 'oklch(0.67 0.176 295 / 0.1)',
		success: 'oklch(0.75 0.17 145)',
		successBg: 'oklch(0.75 0.17 145 / 0.1)',
		error: 'oklch(0.68 0.2 18)',
		errorBg: 'oklch(0.68 0.2 18 / 0.1)',
		errorBorder: 'oklch(0.68 0.2 18 / 0.3)',
		warning: 'oklch(0.8 0.16 75)',
		warningBg: 'oklch(0.8 0.16 75 / 0.1)',
		warningBorder: 'oklch(0.8 0.16 75 / 0.3)',
		surface0: 'oklch(0.13 0.015 278)',
		surface1: 'oklch(0.18 0.014 278)',
		surface2: 'oklch(0.23 0.014 278)',
		surface3: 'oklch(0.28 0.013 278)',
		surface4: 'oklch(0.33 0.013 278)',
		text1: 'oklch(0.97 0.005 278)',
		text2: 'oklch(0.72 0.008 278)',
		text3: 'oklch(0.62 0.009 278)',
	},
	space: {
		'1': '0.25rem',
		'2': '0.5rem',
		'3': '0.75rem',
		'4': '1rem',
		'5': '1.25rem',
		'6': '1.5rem',
		'8': '2rem',
		'10': '2.5rem',
	},
	radius: {
		sm: '4px',
		md: '6px',
		lg: '8px',
		full: '9999px',
	},
	shadow: {
		md: '0 4px 12px oklch(0 0 0 / 0.4)',
		glow: '0 0 20px oklch(0.72 0.18 295 / 0.2)',
	},
	transition: {
		fast: '120ms',
		normal: '200ms',
		slow: '350ms',
	},
	easing: {
		out: 'cubic-bezier(0, 0, 0.3, 1)',
		inOut: 'cubic-bezier(0.5, 0, 0.5, 1)',
	},
	focusRing: '0 0 0 2px oklch(0.17 0.015 260), 0 0 0 4px oklch(0.72 0.18 295)',
	borderSubtle: '1px solid oklch(0.32 0.02 260)',
	font: {
		sans: '\'IBM Plex Sans\', -apple-system, BlinkMacSystemFont, sans-serif',
		mono: '\'IBM Plex Mono\', ui-monospace, \'Cascadia Code\', monospace',
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
})
