<script lang="ts">
	import { badgeRecipe } from './Badge.css'

	interface Props {
		variant?: 'default' | 'accent' | 'success' | 'warning' | 'error'
		size?: 'default' | 'small'
		class?: string
		children?: import('svelte').Snippet
	}

	let { variant, size, class: className, children }: Props = $props()

	let cls = $derived(badgeRecipe({ variant, size }))
</script>

<span class={className ? `${cls} ${className}` : cls}>
	{@render children?.()}
</span>
