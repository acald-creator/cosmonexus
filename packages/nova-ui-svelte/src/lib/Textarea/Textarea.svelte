<script lang="ts">
	import * as styles from './Textarea.css'
	import type { HTMLTextareaAttributes } from 'svelte/elements'

	interface Props extends HTMLTextareaAttributes {
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

	let textareaId = $derived(id ?? `textarea-${Math.random().toString(36).slice(2, 8)}`)
	let errorId = $derived(error ? `${textareaId}-error` : undefined)
</script>

<div class={className ? `${styles.wrapper} ${className}` : styles.wrapper}>
	{#if label}
		<label class={styles.label} for={textareaId}>{label}</label>
	{/if}
	<textarea
		{...rest}
		id={textareaId}
		class={error ? `${styles.textarea} ${styles.textareaError}` : styles.textarea}
		aria-invalid={error ? true : undefined}
		aria-describedby={errorId}
	></textarea>
	{#if error}
		<span id={errorId} class={styles.errorMessage} role="alert">{error}</span>
	{/if}
</div>
