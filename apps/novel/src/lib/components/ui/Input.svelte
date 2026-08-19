<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		defaultValue?: string;
		value?: string;
		label?: string;
		size?: 'sm' | 'md' | 'lg';
		state?: 'default' | 'error' | 'success';
		helperText?: string;
		errorMessage?: string;
		leftIcon?: Snippet;
		rightIcon?: Snippet;
		required?: boolean;
		fullWidth?: boolean;
		disabled?: boolean;
		placeholder?: string;
		type?: string;
		name?: string;
		id?: string;
		class?: string;
	}

	let {
		defaultValue = '',
		value = $bindable(defaultValue),
		label,
		size = 'md',
		state = 'default',
		helperText,
		errorMessage,
		leftIcon,
		rightIcon,
		required = false,
		fullWidth = false,
		disabled = false,
		placeholder,
		type = 'text',
		name,
		id,
		class: className = '',
		...rest
	}: Props = $props();

	let inputId = $derived(id ?? (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined));
	let descId = $derived(inputId ? `${inputId}-desc` : undefined);

	let wrapperClasses = $derived(
		[
			'input-container',
			`size-${size}`,
			state !== 'default' && `state-${state}`,
			fullWidth && 'full-width',
			disabled && 'is-disabled',
			leftIcon && 'has-left-icon',
			rightIcon && 'has-right-icon',
			className
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

<div class={wrapperClasses}>
	{#if label}
		<label for={inputId} class="input-label">
			{label}
			{#if required}<span class="required">*</span>{/if}
		</label>
	{/if}
	<div class="input-wrapper">
		{#if leftIcon}<span class="input-icon left">{@render leftIcon()}</span>{/if}
		<input
			bind:value
			{type}
			id={inputId}
			{name}
			{placeholder}
			{disabled}
			{required}
			class="input"
			aria-invalid={state === 'error'}
			aria-describedby={helperText || errorMessage ? descId : undefined}
			{...rest}
		/>
		{#if rightIcon}<span class="input-icon right">{@render rightIcon()}</span>{/if}
	</div>
	{#if state === 'error' && errorMessage}
		<p class="input-message error" id={descId}>{errorMessage}</p>
	{:else if helperText}
		<p class="input-message helper" id={descId}>{helperText}</p>
	{/if}
</div>

<style>
	.input-container {
		display: flex;
		flex-direction: column;
		gap: var(--input-label-gap);
	}

	.full-width {
		width: 100%;
	}

	/* ----- Label ----- */

	.input-label {
		font-size: var(--input-label-font-size);
		font-weight: var(--input-label-font-weight);
		color: var(--input-label-color);
	}

	.required {
		color: var(--input-error-message-color);
		margin-left: var(--spacing-0-5);
	}

	/* ----- Input wrapper (for icon positioning) ----- */

	.input-wrapper {
		position: relative;
		display: flex;
		align-items: center;
	}

	/* ----- Input element ----- */

	.input {
		width: 100%;
		background: var(--input-background);
		border: 1.5px solid var(--input-border);
		border-radius: var(--input-border-radius);
		color: var(--input-color);
		font-family: inherit;
		font-size: var(--input-font-size-md);
		line-height: 1;
		padding: 0 var(--input-padding-x-md);
		transition:
			border-color var(--duration-150) ease,
			box-shadow var(--duration-150) ease;
	}

	.input::placeholder {
		color: var(--input-placeholder);
	}

	/* ----- Size variants ----- */

	.size-sm .input {
		height: var(--input-height-sm);
		font-size: var(--input-font-size-sm);
		padding: 0 var(--input-padding-x-sm);
	}

	.size-md .input {
		height: var(--input-height-md);
		font-size: var(--input-font-size-md);
		padding: 0 var(--input-padding-x-md);
	}

	.size-lg .input {
		height: var(--input-height-lg);
		font-size: var(--input-font-size-lg);
		padding: 0 var(--input-padding-x-lg);
	}

	/* ----- Focus ----- */

	.input:focus {
		outline: none;
		border-color: var(--input-focus-border);
		box-shadow: var(--input-focus-ring);
	}

	/* ----- State: Error ----- */

	.state-error .input {
		border-color: var(--input-error-border);
	}

	.state-error .input:focus {
		border-color: var(--input-error-border);
		box-shadow: var(--input-error-ring);
	}

	/* ----- State: Success ----- */

	.state-success .input {
		border-color: var(--input-success-border);
	}

	.state-success .input:focus {
		border-color: var(--input-success-border);
		box-shadow: var(--input-success-ring);
	}

	/* ----- Disabled ----- */

	.is-disabled .input {
		opacity: var(--opacity-disabled);
		background: var(--input-disabled-background);
		color: var(--input-disabled-color);
		cursor: not-allowed;
	}

	/* ----- Icons ----- */

	.input-icon {
		position: absolute;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: var(--input-icon-color);
		width: var(--input-icon-size);
		height: var(--input-icon-size);
		pointer-events: none;
		z-index: 1;
	}

	.input-icon.left {
		left: var(--input-icon-offset);
	}

	.input-icon.right {
		right: var(--input-icon-offset);
	}

	/* Adjust input padding when icons are present */

	.has-left-icon .input {
		padding-left: var(--spacing-10);
	}

	.has-right-icon .input {
		padding-right: var(--spacing-10);
	}

	/* ----- Helper / Error messages ----- */

	.input-message {
		font-size: var(--input-helper-font-size);
		margin: var(--input-helper-margin-top) 0 0;
	}

	.input-message.error {
		color: var(--input-error-message-color);
	}

	.input-message.helper {
		color: var(--input-helper-color);
	}
</style>
