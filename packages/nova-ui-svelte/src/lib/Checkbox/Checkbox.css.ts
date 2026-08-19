import { tokens } from '@cosmonexus/design-tokens/contract'
import { style } from '@vanilla-extract/css'

export const wrapper = style({
	display: 'inline-flex',
	alignItems: 'center',
	gap: tokens.space[2],
	cursor: 'pointer',
	userSelect: 'none',
})

export const input = style({
	width: '1rem',
	height: '1rem',
	borderRadius: tokens.radius.sm,
	border: `1px solid ${tokens.color.surface4}`,
	background: tokens.color.surface3,
	cursor: 'pointer',
	accentColor: tokens.color.accent1,
	':focus-visible': {
		outline: 'none',
		boxShadow: tokens.focusRing,
	},
	':disabled': {
		opacity: 0.5,
		cursor: 'not-allowed',
	},
})

export const label = style({
	fontSize: tokens.fontSize.sm,
	color: tokens.color.text1,
	lineHeight: tokens.lineHeight.tight,
})

export const labelDisabled = style({
	opacity: 0.5,
	cursor: 'not-allowed',
})
