import { tokens } from '@cosmonexus/design-tokens/contract'
import { keyframes } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

const spin = keyframes({
	from: { transform: 'rotate(0deg)' },
	to: { transform: 'rotate(360deg)' },
})

export const buttonRecipe = recipe({
	base: {
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: tokens.space[2],
		fontFamily: tokens.font.sans,
		fontSize: tokens.fontSize.base,
		fontWeight: tokens.fontWeight.medium,
		lineHeight: tokens.lineHeight.tight,
		borderRadius: tokens.radius.md,
		border: 'none',
		cursor: 'pointer',
		transition: `background ${tokens.transition.fast} ${tokens.easing.out}, transform ${tokens.transition.fast} ${tokens.easing.out}, opacity ${tokens.transition.fast} ${tokens.easing.out}`,
		userSelect: 'none',
		textDecoration: 'none',
		':focus-visible': {
			outline: 'none',
			boxShadow: tokens.focusRing,
		},
		':active': {
			transform: 'scale(0.98)',
		},
		':disabled': {
			opacity: 0.5,
			cursor: 'not-allowed',
			transform: 'none',
		},
	},
	variants: {
		variant: {
			primary: {
				background: tokens.color.accent1,
				color: tokens.color.surface0,
				':hover': {
					background: tokens.color.accent2,
				},
			},
			secondary: {
				background: tokens.color.surface3,
				color: tokens.color.text1,
				':hover': {
					background: tokens.color.surface4,
				},
			},
		},
		size: {
			default: {
				padding: `${tokens.space[3]} ${tokens.space[5]}`,
			},
			small: {
				padding: `${tokens.space[2]} ${tokens.space[3]}`,
				fontSize: tokens.fontSize.sm,
			},
		},
		loading: {
			true: {
				opacity: 0.7,
				cursor: 'wait',
				pointerEvents: 'none' as const,
			},
		},
		fullWidth: {
			true: {
				width: '100%',
			},
		},
	},
	defaultVariants: {
		variant: 'primary',
		size: 'default',
	},
})

export { spin }
