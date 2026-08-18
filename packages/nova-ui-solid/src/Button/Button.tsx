import { type JSX, splitProps } from 'solid-js'
import { buttonRecipe } from './Button.css'

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary'
	size?: 'default' | 'small'
	loading?: boolean
	fullWidth?: boolean
}

export function Button(props: ButtonProps) {
	const [local, native] = splitProps(props, [
		'variant',
		'size',
		'loading',
		'fullWidth',
		'children',
		'class',
		'disabled',
	])

	const className = () =>
		buttonRecipe({
			variant: local.variant,
			size: local.size,
			loading: local.loading || undefined,
			fullWidth: local.fullWidth || undefined,
		})

	return (
		<button
			{...native}
			class={local.class ? `${className()} ${local.class}` : className()}
			disabled={local.disabled || local.loading}
			aria-busy={local.loading || undefined}
		>
			{local.children}
		</button>
	)
}
