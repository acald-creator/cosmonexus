<script lang="ts">
	import { skeletonRecipe } from './Skeleton.css'

	interface Props {
		variant?: 'text' | 'row'
		width?: string
		height?: string
		class?: string
	}

	let { variant = 'text', width, height, class: className }: Props = $props()

	let cls = $derived(skeletonRecipe({ variant }))
</script>

<div
	class={className ? `${cls} ${className}` : cls}
	style:width={width}
	style:height={height}
	aria-hidden="true"
></div>
