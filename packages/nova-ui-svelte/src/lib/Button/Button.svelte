<script lang="ts">
	import { buttonRecipe } from './Button.css'
	import type { HTMLButtonAttributes } from 'svelte/elements'

	interface Props extends HTMLButtonAttributes {
		variant?: 'primary' | 'secondary'
		size?: 'default' | 'small'
		loading?: boolean
		fullWidth?: boolean
	}

	let {
		variant,
		size,
		loading = false,
		fullWidth = false,
		class: className,
		disabled,
		children,
		...rest
	}: Props = $props()

	let cls = $derived(
		buttonRecipe({
			variant,
			size,
			loading: loading || undefined,
			fullWidth: fullWidth || undefined,
		})
	)
</script>

<button
	class={className ? `${cls} ${className}` : cls}
	disabled={disabled || loading}
	aria-busy={loading || undefined}
	{...rest}
>
	{@render children?.()}
</button>
