import { tokens } from '@cosmonexus/design-tokens/contract'
import { recipe } from '@vanilla-extract/recipes'

export const badgeRecipe = recipe({
	base: {
		display: 'inline-flex',
		alignItems: 'center',
		fontSize: tokens.fontSize.xs,
		fontWeight: tokens.fontWeight.medium,
		lineHeight: tokens.lineHeight.tight,
		borderRadius: tokens.radius.full,
		padding: `${tokens.space[1]} ${tokens.space[2]}`,
		whiteSpace: 'nowrap',
	},
	variants: {
		variant: {
			default: {
				background: tokens.color.surface3,
				color: tokens.color.text2,
			},
			accent: {
				background: tokens.color.accent1,
				color: tokens.color.surface0,
			},
			success: {
				background: tokens.color.success,
				color: tokens.color.surface0,
			},
			warning: {
				background: tokens.color.warning,
				color: tokens.color.surface0,
			},
			error: {
				background: tokens.color.error,
				color: tokens.color.surface0,
			},
		},
		size: {
			default: {
				padding: `2px ${tokens.space[2]}`,
			},
			small: {
				padding: `1px ${tokens.space[1]}`,
				fontSize: '0.65rem',
			},
		},
	},
	defaultVariants: {
		variant: 'default',
		size: 'default',
	},
})
