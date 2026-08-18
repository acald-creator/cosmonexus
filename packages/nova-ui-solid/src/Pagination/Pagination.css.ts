import { tokens } from '@cosmonexus/design-tokens/contract'
import { style } from '@vanilla-extract/css'

export const container = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	gap: tokens.space[2],
	padding: tokens.space[4],
})

export const pageButton = style({
	minWidth: '2rem',
	height: '2rem',
	padding: `${tokens.space[1]} ${tokens.space[2]}`,
	fontSize: tokens.fontSize.sm,
	fontWeight: tokens.fontWeight.medium,
	fontFamily: tokens.font.sans,
	background: tokens.color.surface3,
	color: tokens.color.text2,
	border: 'none',
	borderRadius: tokens.radius.md,
	cursor: 'pointer',
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	transition: `background ${tokens.transition.fast} ${tokens.easing.out}`,
	':hover': {
		background: tokens.color.surface4,
	},
	':focus-visible': {
		outline: 'none',
		boxShadow: tokens.focusRing,
	},
	selectors: {
		'&[disabled]': {
			opacity: 0.5,
			cursor: 'not-allowed',
		},
		'&[disabled]:hover': {
			background: tokens.color.surface3,
		},
	},
})

export const activeButton = style({
	background: tokens.color.accent1,
	color: tokens.color.surface0,
	selectors: {
		'&:hover': {
			background: tokens.color.accent1,
		},
	},
})

export const ellipsis = style({
	minWidth: '2rem',
	height: '2rem',
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	fontSize: tokens.fontSize.sm,
	color: tokens.color.text3,
})
