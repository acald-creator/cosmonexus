import { tokens } from '@cosmonexus/design-tokens/contract'
import { style } from '@vanilla-extract/css'

export const tabList = style({
	display: 'inline-flex',
	gap: tokens.space[1],
	background: tokens.color.surface2,
	border: `1px solid ${tokens.color.surface4}`,
	borderRadius: tokens.radius.md,
	padding: tokens.space[1],
})

export const tab = style({
	padding: `${tokens.space[1]} ${tokens.space[3]}`,
	fontSize: tokens.fontSize.sm,
	fontWeight: tokens.fontWeight.medium,
	color: tokens.color.text3,
	borderRadius: tokens.radius.sm,
	border: 'none',
	background: 'transparent',
	cursor: 'pointer',
	transition: `background ${tokens.transition.fast} ${tokens.easing.out}, color ${tokens.transition.fast} ${tokens.easing.out}`,
	':hover': {
		color: tokens.color.text2,
		background: tokens.color.surface3,
	},
	':focus-visible': {
		outline: 'none',
		boxShadow: tokens.focusRing,
	},
})

export const tabActive = style({
	background: tokens.color.surface3,
	color: tokens.color.accent1,
})

export const panel = style({
	marginTop: tokens.space[4],
})
