import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { buttonRecipe } from './Button.css'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary'
	size?: 'default' | 'small'
	loading?: boolean
	fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ variant, size, loading, fullWidth, className, disabled, children, ...rest }, ref) => {
		const cls = buttonRecipe({
			variant,
			size,
			loading: loading || undefined,
			fullWidth: fullWidth || undefined,
		})

		return (
			<button
				ref={ref}
				className={className ? `${cls} ${className}` : cls}
				disabled={disabled || loading}
				aria-busy={loading || undefined}
				{...rest}
			>
				{children}
			</button>
		)
	},
)

Button.displayName = 'Button'
