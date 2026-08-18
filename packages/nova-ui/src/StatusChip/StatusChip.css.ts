import { tokens } from '@cosmonexus/design-tokens/contract'
import { recipe } from '@vanilla-extract/recipes'

export const statusChipRecipe = recipe({
	base: {
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: tokens.radius.full,
		padding: `${tokens.space[1]} ${tokens.space[2]}`,
		fontSize: tokens.fontSize.xs,
		fontWeight: tokens.fontWeight.medium,
		fontFamily: tokens.font.sans,
		lineHeight: tokens.lineHeight.tight,
		whiteSpace: 'nowrap',
	},
	variants: {
		status: {
			created: {
				color: tokens.color.success,
				background: tokens.color.successBg,
			},
			accessed: {
				color: tokens.color.accent1,
				background: tokens.color.accentBg,
			},
			modified: {
				color: tokens.color.warning,
				background: tokens.color.warningBg,
			},
			deleted: {
				color: tokens.color.error,
				background: tokens.color.errorBg,
			},
		},
	},
	defaultVariants: {
		status: 'created',
	},
})
