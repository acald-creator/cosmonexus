<script lang="ts">
	import * as styles from './Select.css'
	import type { HTMLSelectAttributes } from 'svelte/elements'

	interface Props extends HTMLSelectAttributes {
		label?: string
		error?: string
	}

	let {
		label,
		error,
		class: className,
		id,
		children,
		...rest
	}: Props = $props()

	let selectId = $derived(id ?? `select-${Math.random().toString(36).slice(2, 8)}`)
	let errorId = $derived(error ? `${selectId}-error` : undefined)
</script>

<div class={className ? `${styles.wrapper} ${className}` : styles.wrapper}>
	{#if label}
		<label class={styles.label} for={selectId}>{label}</label>
	{/if}
	<select
		{...rest}
		id={selectId}
		class={error ? `${styles.select} ${styles.selectError}` : styles.select}
		aria-invalid={error ? true : undefined}
		aria-describedby={errorId}
	>
		{@render children?.()}
	</select>
	{#if error}
		<span id={errorId} class={styles.errorMessage} role="alert">{error}</span>
	{/if}
</div>
