<script lang="ts">
	import { alertRecipe } from './Alert.css'

	interface Props {
		variant: 'success' | 'error' | 'warning'
		class?: string
		children?: any
	}

	let { variant, class: className, children }: Props = $props()

	let cls = $derived(alertRecipe({ variant }))
	let role = $derived(variant === 'success' ? 'status' : 'alert')
</script>

<div
	class={className ? `${cls} ${className}` : cls}
	{role}
>
	{@render children?.()}
</div>
