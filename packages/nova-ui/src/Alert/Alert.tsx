import type { ReactNode } from 'react'
import { alertRecipe } from './Alert.css'

export interface AlertProps {
	variant: 'success' | 'error' | 'warning'
	children: ReactNode
	className?: string
}

/**
 * Alert component for feedback messages with semantic variants.
 * Uses role="alert" for error/warning (assertive) and role="status" for success (polite).
 */
export function Alert({ variant, children, className }: AlertProps) {
	const cls = alertRecipe({ variant })

	return (
		<div
			className={className ? `${cls} ${className}` : cls}
			role={variant === 'success' ? 'status' : 'alert'}
		>
			{children}
		</div>
	)
}
