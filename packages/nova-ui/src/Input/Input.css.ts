import { tokens } from '@cosmonexus/design-tokens/contract'
import { style } from '@vanilla-extract/css'

export const wrapper = style({
	display: 'flex',
	flexDirection: 'column',
	gap: tokens.space[1],
})

export const label = style({
	fontSize: tokens.fontSize.sm,
	fontWeight: tokens.fontWeight.medium,
	color: tokens.color.text2,
})

export const input = style({
	background: tokens.color.surface3,
	border: `1px solid ${tokens.color.surface4}`,
	borderRadius: tokens.radius.md,
	color: tokens.color.text1,
	fontFamily: tokens.font.sans,
	fontSize: tokens.fontSize.base,
	padding: `${tokens.space[2]} ${tokens.space[3]}`,
	transition: `border-color ${tokens.transition.fast} ${tokens.easing.out}`,
	outline: 'none',
	width: '100%',
	':focus': {
		borderColor: tokens.color.accent1,
		boxShadow: tokens.focusRing,
	},
	'::placeholder': {
		color: tokens.color.text3,
	},
})

export const inputError = style({
	borderColor: tokens.color.error,
})

export const errorMessage = style({
	fontSize: tokens.fontSize.xs,
	color: tokens.color.error,
})
