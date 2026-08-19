<script lang="ts">
	import * as styles from './Checkbox.css'
	import type { HTMLInputAttributes } from 'svelte/elements'

	interface Props extends Omit<HTMLInputAttributes, 'type'> {
		label?: string
	}

	let {
		label,
		class: className,
		id,
		disabled,
		...rest
	}: Props = $props()

	let inputId = $derived(id ?? `checkbox-${Math.random().toString(36).slice(2, 8)}`)
</script>

<label class={className ? `${styles.wrapper} ${className}` : styles.wrapper}>
	<input
		{...rest}
		type="checkbox"
		id={inputId}
		class={styles.input}
		{disabled}
	/>
	{#if label}
		<span class={disabled ? `${styles.label} ${styles.labelDisabled}` : styles.label}>
			{label}
		</span>
	{/if}
</label>
