<script lang="ts">
	import * as styles from './Input.css'
	import type { HTMLInputAttributes } from 'svelte/elements'

	interface Props extends HTMLInputAttributes {
		label?: string
		error?: string
	}

	let {
		label,
		error,
		class: className,
		id,
		...rest
	}: Props = $props()

	let inputId = $derived(id ?? `input-${Math.random().toString(36).slice(2, 8)}`)
	let errorId = $derived(error ? `${inputId}-error` : undefined)
</script>

<div class={className ? `${styles.wrapper} ${className}` : styles.wrapper}>
	{#if label}
		<label class={styles.label} for={inputId}>{label}</label>
	{/if}
	<input
		{...rest}
		id={inputId}
		class={error ? `${styles.input} ${styles.inputError}` : styles.input}
		aria-invalid={error ? true : undefined}
		aria-describedby={errorId}
	/>
	{#if error}
		<span id={errorId} class={styles.errorMessage} role="alert">{error}</span>
	{/if}
</div>
