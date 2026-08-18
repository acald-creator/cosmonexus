import { type JSX, splitProps } from 'solid-js'
import { skeletonRecipe } from './Skeleton.css'

export interface SkeletonProps extends JSX.HTMLAttributes<HTMLDivElement> {
	variant?: 'text' | 'row'
}

/**
 * Skeleton placeholder with shimmer animation.
 * Use variant="text" for inline text and variant="row" for table/list rows.
 */
export function Skeleton(props: SkeletonProps) {
	const [local, rest] = splitProps(props, ['variant', 'class'])

	const className = () => skeletonRecipe({ variant: local.variant })

	return (
		<div
			{...rest}
			class={local.class ? `${className()} ${local.class}` : className()}
			aria-hidden="true"
		/>
	)
}
