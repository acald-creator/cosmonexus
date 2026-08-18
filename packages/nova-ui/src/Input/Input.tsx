import { type InputHTMLAttributes, forwardRef, useId } from 'react'
import * as styles from './Input.css'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string
	error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ label, error, id: propId, className, ...rest }, ref) => {
		const generatedId = useId()
		const id = propId ?? generatedId

		return (
			<div className={styles.wrapper}>
				{label && (
					<label className={styles.label} htmlFor={id}>
						{label}
					</label>
				)}
				<input
					ref={ref}
					id={id}
					className={`${styles.input}${error ? ` ${styles.inputError}` : ''}${className ? ` ${className}` : ''}`}
					aria-invalid={error ? true : undefined}
					aria-describedby={error ? `${id}-error` : undefined}
					{...rest}
				/>
				{error && (
					<span id={`${id}-error`} className={styles.errorMessage} role="alert">
						{error}
					</span>
				)}
			</div>
		)
	},
)

Input.displayName = 'Input'
