import type { JSX } from 'solid-js'
import { alertRecipe } from './Alert.css'

export interface AlertProps {
	variant: 'success' | 'error' | 'warning'
	children: JSX.Element
}

/**
 * Alert component for feedback messages with semantic variants.
 * Uses role="alert" for error/warning (assertive) and role="status" for success (polite).
 */
export function Alert(props: AlertProps): JSX.Element {
	return (
		<div
			class={alertRecipe({ variant: props.variant })}
			role={props.variant === 'success' ? 'status' : 'alert'}
		>
			{props.children}
		</div>
	)
}
