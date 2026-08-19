<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'ghost' | 'soft' | 'gradient' | 'danger' | 'success';
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
		fullWidth?: boolean;
		loading?: boolean;
		iconOnly?: boolean;
		disabled?: boolean;
		class?: string;
		onclick?: (e: MouseEvent) => void;
		type?: 'button' | 'submit' | 'reset';
		href?: string;
		leftIcon?: Snippet;
		rightIcon?: Snippet;
		children?: Snippet;
		/** When true, the component doesn't render its own element. Use the `child` snippet instead, which receives the computed class string. */
		asChild?: boolean;
		/** Snippet that receives (className: string) — only used with asChild */
		child?: Snippet<[string]>;
	}

	let {
		variant = 'primary',
		size = 'md',
		fullWidth = false,
		loading = false,
		iconOnly = false,
		disabled = false,
		class: className = '',
		onclick,
		type = 'button',
		href,
		leftIcon,
		rightIcon,
		children,
		asChild = false,
		child,
		...rest
	}: Props = $props();

	let classes = $derived(
		[
			'btn',
			variant,
			size,
			fullWidth && 'block',
			iconOnly && 'icon-only',
			loading && 'loading',
			className
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

{#if asChild && child}
	{@render child(classes)}
{:else if href}
	<a class={classes} {href} {...rest}>
		{#if loading}
			<span class="spinner">
				<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="31.4 31.4" />
				</svg>
			</span>
		{/if}
		{#if !loading && leftIcon}
			<span class="icon">{@render leftIcon()}</span>
		{/if}
		{#if children}
			<span class="label">{@render children()}</span>
		{/if}
		{#if !loading && rightIcon}
			<span class="icon">{@render rightIcon()}</span>
		{/if}
	</a>
{:else}
	<button class={classes} disabled={disabled || loading} {onclick} {type} {...rest}>
		{#if loading}
			<span class="spinner">
				<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="31.4 31.4" />
				</svg>
			</span>
		{/if}
		{#if !loading && leftIcon}
			<span class="icon">{@render leftIcon()}</span>
		{/if}
		{#if children}
			<span class="label">{@render children()}</span>
		{/if}
		{#if !loading && rightIcon}
			<span class="icon">{@render rightIcon()}</span>
		{/if}
	</button>
{/if}

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--button-gap);
		font-family: inherit;
		font-weight: var(--font-weight-semibold);
		line-height: 1;
		border: none;
		border-radius: var(--button-border-radius-md);
		cursor: pointer;
		text-decoration: none;
		position: relative;
		overflow: hidden;
		white-space: nowrap;
		user-select: none;
		transition:
			background-color var(--duration-150) ease,
			color var(--duration-150) ease,
			border-color var(--duration-150) ease,
			box-shadow var(--duration-150) ease,
			filter var(--duration-150) ease;
	}

	/* ----- Size variants ----- */

	.xs {
		height: var(--button-height-xs);
		padding: 0 var(--button-padding-x-xs);
		font-size: var(--button-font-size-xs);
		border-radius: var(--button-border-radius-xs);
	}

	.sm {
		height: var(--button-height-sm);
		padding: 0 var(--button-padding-x-sm);
		font-size: var(--button-font-size-sm);
		border-radius: var(--button-border-radius-sm);
	}

	.md {
		height: var(--button-height-md);
		padding: 0 var(--button-padding-x-md);
		font-size: var(--button-font-size-md);
	}

	.lg {
		height: var(--button-height-lg);
		padding: 0 var(--button-padding-x-lg);
		font-size: var(--button-font-size-lg);
	}

	.xl {
		height: var(--button-height-xl);
		padding: 0 var(--button-padding-x-xl);
		font-size: var(--button-font-size-xl);
		border-radius: var(--button-border-radius-xl);
	}

	/* ----- Variant: Primary ----- */

	.primary {
		background: var(--button-primary-background);
		color: var(--button-primary-color);
		border: 1px solid var(--button-primary-border);
	}

	.primary:hover {
		background: var(--button-primary-hover-background);
	}

	.primary:active {
		background: var(--button-primary-active-background);
	}

	/* ----- Variant: Secondary (outlined) ----- */

	.secondary {
		background: var(--button-secondary-background);
		color: var(--button-secondary-color);
		border: 1.5px solid var(--button-secondary-border);
	}

	.secondary:hover {
		background: var(--button-secondary-hover-background);
		color: var(--button-secondary-hover-color);
		border-color: var(--button-secondary-hover-border);
	}

	.secondary:active {
		background: var(--button-secondary-active-background);
		color: var(--button-secondary-active-color);
	}

	/* ----- Variant: Ghost ----- */

	.ghost {
		background: var(--button-ghost-background);
		color: var(--button-ghost-color);
		border: 1px solid var(--button-ghost-border);
	}

	.ghost:hover {
		background: var(--button-ghost-hover-background);
		color: var(--button-ghost-hover-color);
	}

	.ghost:active {
		background: var(--button-ghost-active-background);
	}

	/* ----- Variant: Soft ----- */

	.soft {
		background: var(--button-soft-background);
		color: var(--button-soft-color);
		border: 1px solid var(--button-soft-border);
	}

	.soft:hover {
		background: var(--button-soft-hover-background);
	}

	.soft:active {
		background: var(--button-soft-active-background);
	}

	/* ----- Variant: Gradient ----- */

	.gradient {
		background: linear-gradient(135deg, var(--color-accent-pink), var(--primary));
		color: var(--button-primary-color);
	}

	.gradient:hover {
		filter: brightness(1.1);
	}

	.gradient:active {
		filter: brightness(0.95);
	}

	/* ----- Variant: Danger ----- */

	.danger {
		background: var(--button-danger-background);
		color: var(--button-danger-color);
		border: 1px solid var(--button-danger-border);
	}

	.danger:hover {
		background: var(--button-danger-hover-background);
	}

	.danger:active {
		filter: brightness(0.9);
	}

	/* ----- Variant: Success ----- */

	.success {
		background: var(--button-success-background);
		color: var(--button-success-color);
		border: 1px solid var(--button-success-border);
	}

	.success:hover {
		background: var(--button-success-hover-background);
	}

	.success:active {
		filter: brightness(0.9);
	}

	/* ----- Modifiers ----- */

	.block {
		display: flex;
		width: 100%;
	}

	.icon-only.xs { width: var(--size-button-xs); padding: 0; }
	.icon-only.sm { width: var(--size-button-sm); padding: 0; }
	.icon-only.md { width: var(--size-button-md); padding: 0; }
	.icon-only.lg { width: var(--size-button-lg); padding: 0; }
	.icon-only.xl { width: var(--size-button-xl); padding: 0; }

	/* ----- Loading state ----- */

	.loading {
		pointer-events: none;
	}

	.spinner {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1em;
		height: 1em;
		animation: spin 0.75s linear infinite;
	}

	.spinner svg {
		width: 100%;
		height: 100%;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	/* ----- Icon wrapper ----- */

	.icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1em;
		height: 1em;
		flex-shrink: 0;
	}

	/* ----- Label wrapper ----- */

	.label {
		display: inline-flex;
		align-items: center;
	}

	/* ----- Focus ----- */

	.btn:focus-visible {
		outline: var(--focus-width, 2px) solid var(--focus-ring);
		outline-offset: var(--focus-offset, 2px);
	}

	/* ----- Disabled ----- */

	.btn:disabled,
	.btn[aria-disabled='true'] {
		opacity: 0.5;
		cursor: not-allowed;
		pointer-events: none;
	}
</style>
