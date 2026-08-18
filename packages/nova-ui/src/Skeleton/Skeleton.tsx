import { skeletonRecipe } from './Skeleton.css'

export interface SkeletonProps {
	variant?: 'text' | 'row'
	width?: string
	height?: string
	className?: string
}

/**
 * Skeleton placeholder with shimmer animation for loading states.
 */
export function Skeleton({ variant = 'text', width, height, className }: SkeletonProps) {
	const cls = skeletonRecipe({ variant })

	return (
		<div
			className={className ? `${cls} ${className}` : cls}
			style={{ width, height }}
			aria-hidden="true"
		/>
	)
}
