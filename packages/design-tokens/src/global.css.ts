import { globalStyle } from '@vanilla-extract/css'
import { tokens } from './contract.css'

/**
 * Global styles: CSS reset and base typography.
 * Import this module in your app entry point to apply the reset.
 *
 * Open Props should be imported separately by the consuming app
 * if raw primitive values are needed alongside the semantic tokens.
 */

/* Box-sizing reset */
globalStyle('*, *::before, *::after', {
	boxSizing: 'border-box',
})

/* Remove default margins */
globalStyle('body, h1, h2, h3, h4, h5, h6, p, ul, ol, figure, blockquote', {
	margin: 0,
})

/* Base body styles */
globalStyle('body', {
	fontFamily: tokens.font.sans,
	fontSize: tokens.fontSize.base,
	lineHeight: tokens.lineHeight.normal,
	color: tokens.color.text1,
	backgroundColor: tokens.color.surface0,
	WebkitFontSmoothing: 'antialiased',
	MozOsxFontSmoothing: 'grayscale',
})

/* Headings */
globalStyle('h1, h2, h3, h4, h5, h6', {
	lineHeight: tokens.lineHeight.tight,
	fontWeight: tokens.fontWeight.semibold,
})

/* Links */
globalStyle('a', {
	color: tokens.color.accent1,
	textDecoration: 'none',
})

globalStyle('a:hover', {
	color: tokens.color.accent2,
})

/* Code */
globalStyle('code, pre', {
	fontFamily: tokens.font.mono,
})

/* Media */
globalStyle('img, picture, video, canvas, svg', {
	display: 'block',
	maxWidth: '100%',
})

/* Form elements inherit font */
globalStyle('input, button, textarea, select', {
	font: 'inherit',
})

/* Remove list styles */
globalStyle('ul, ol', {
	listStyle: 'none',
	padding: 0,
})
