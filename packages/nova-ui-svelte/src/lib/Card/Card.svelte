<script lang="ts">
	import * as styles from './Card.css'
	import type { HTMLAttributes } from 'svelte/elements'

	interface Props extends HTMLAttributes<HTMLDivElement> {
		title?: string
	}

	let { title, class: className, children, ...rest }: Props = $props()
</script>

<div class={className ? `${styles.card} ${className}` : styles.card} {...rest}>
	{#if title}
		<h3 class={styles.cardTitle}>{title}</h3>
	{/if}
	{@render children?.()}
</div>
