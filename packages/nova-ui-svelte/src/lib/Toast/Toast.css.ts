import { tokens } from '@cosmonexus/design-tokens/contract'
import { style, keyframes } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

const slideIn = keyframes({
	from: { transform: 'translateX(100%)', opacity: 0 },
	to: { transform: 'translateX(0)', opacity: 1 },
})

const slideOut = keyframes({
	from: { transform: 'translateX(0)', opacity: 1 },
	to: { transform: 'translateX(100%)', opacity: 0 },
})

export const container = style({
	position: 'fixed',
	top: tokens.space[4],
	right: tokens.space[4],
	display: 'flex',
	flexDirection: 'column',
	gap: tokens.space[2],
	zIndex: 9999,
	pointerEvents: 'none',
	maxWidth: '24rem',
})

export const toastRecipe = recipe({
	base: {
		display: 'flex',
		alignItems: 'center',
		gap: tokens.space[3],
		padding: `${tokens.space[3]} ${tokens.space[4]}`,
		borderRadius: tokens.radius.md,
		fontSize: tokens.fontSize.sm,
		fontFamily: tokens.font.sans,
		boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
		pointerEvents: 'auto',
		animation: `${slideIn} 200ms ${tokens.easing.out}`,
		border: '1px solid transparent',
	},
	variants: {
		variant: {
			info: {
				background: tokens.color.surface3,
				color: tokens.color.text1,
				borderColor: tokens.color.surface4,
			},
			success: {
				background: tokens.color.surface3,
				color: tokens.color.success,
				borderColor: tokens.color.success,
			},
			warning: {
				background: tokens.color.surface3,
				color: tokens.color.warning,
				borderColor: tokens.color.warning,
			},
			error: {
				background: tokens.color.surface3,
				color: tokens.color.error,
				borderColor: tokens.color.error,
			},
		},
	},
	defaultVariants: {
		variant: 'info',
	},
})

export const dismissBtn = style({
	background: 'none',
	border: 'none',
	color: tokens.color.text3,
	cursor: 'pointer',
	padding: tokens.space[1],
	marginLeft: 'auto',
	lineHeight: 1,
	fontSize: tokens.fontSize.base,
	':hover': {
		color: tokens.color.text1,
	},
})

export { slideOut }
