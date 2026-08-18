import { tokens } from '@cosmonexus/design-tokens/contract'
import { keyframes } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

const shimmer = keyframes({
	'0%': { backgroundPosition: '-200% 0' },
	'100%': { backgroundPosition: '200% 0' },
})

export const skeletonRecipe = recipe({
	base: {
		borderRadius: tokens.radius.sm,
		background: `linear-gradient(90deg, ${tokens.color.surface3} 25%, ${tokens.color.surface4} 50%, ${tokens.color.surface3} 75%)`,
		backgroundSize: '200% 100%',
		animation: `${shimmer} 1.5s infinite`,
	},
	variants: {
		variant: {
			text: {
				height: '1rem',
				width: '75%',
			},
			row: {
				height: '2.5rem',
				width: '100%',
				borderRadius: tokens.radius.md,
				marginBottom: tokens.space[2],
			},
		},
	},
	defaultVariants: {
		variant: 'text',
	},
})
