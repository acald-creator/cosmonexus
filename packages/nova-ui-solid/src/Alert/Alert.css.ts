import { tokens } from '@cosmonexus/design-tokens/contract'
import { recipe } from '@vanilla-extract/recipes'

export const alertRecipe = recipe({
	base: {
		padding: tokens.space[4],
		borderRadius: tokens.radius.md,
		fontSize: tokens.fontSize.sm,
		fontFamily: tokens.font.sans,
		marginBottom: tokens.space[4],
		borderWidth: '1px',
		borderStyle: 'solid',
	},
	variants: {
		variant: {
			success: {
				background: tokens.color.successBg,
				color: tokens.color.success,
				borderColor: tokens.color.success,
			},
			error: {
				background: tokens.color.errorBg,
				color: tokens.color.error,
				borderColor: tokens.color.errorBorder,
			},
			warning: {
				background: tokens.color.warningBg,
				color: tokens.color.warning,
				borderColor: tokens.color.warningBorder,
			},
		},
	},
	defaultVariants: {
		variant: 'error',
	},
})
