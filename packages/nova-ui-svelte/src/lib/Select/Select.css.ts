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

export const select = style({
	appearance: 'none',
	background: tokens.color.surface3,
	border: `1px solid ${tokens.color.surface4}`,
	borderRadius: tokens.radius.md,
	color: tokens.color.text1,
	fontFamily: tokens.font.sans,
	fontSize: tokens.fontSize.base,
	padding: `${tokens.space[2]} ${tokens.space[3]}`,
	paddingRight: tokens.space[8],
	transition: `border-color ${tokens.transition.fast} ${tokens.easing.out}`,
	outline: 'none',
	width: '100%',
	cursor: 'pointer',
	backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m4 6 4 4 4-4'/%3E%3C/svg%3E")`,
	backgroundRepeat: 'no-repeat',
	backgroundPosition: `right ${tokens.space[2]} center`,
	':focus-visible': {
		borderColor: tokens.color.accent1,
		boxShadow: tokens.focusRing,
	},
	':disabled': {
		opacity: 0.5,
		cursor: 'not-allowed',
	},
})

export const selectError = style({
	borderColor: tokens.color.error,
})

export const errorMessage = style({
	fontSize: tokens.fontSize.xs,
	color: tokens.color.error,
})
