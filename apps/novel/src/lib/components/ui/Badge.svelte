<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
		size?: 'sm' | 'md' | 'lg';
		dot?: boolean;
		icon?: Snippet;
		onremove?: () => void;
		children: Snippet;
		class?: string;
		asChild?: boolean;
		child?: Snippet<[string]>;
	}

	let {
		variant = 'default',
		size = 'md',
		dot = false,
		icon,
		onremove,
		children,
		class: className,
		asChild = false,
		child,
		...rest
	}: Props = $props();

	let classes = $derived(
		['badge', variant, size, className].filter(Boolean).join(' ')
	);
</script>

{#if asChild && child}
	{@render child(classes)}
{:else}
	<span class={classes} {...rest}>
		{#if dot}<span class="dot"></span>{/if}
		{#if icon}<span class="icon">{@render icon()}</span>{/if}
		<span class="content">{@render children()}</span>
		{#if onremove}
			<button type="button" class="remove-btn" onclick={onremove} aria-label="Remove">
				<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M18 6L6 18M6 6l12 12" />
				</svg>
			</button>
		{/if}
	</span>
{/if}

<style>
	.badge {
		display: inline-flex;
		align-items: center;
		gap: var(--badge-gap);
		font-weight: var(--badge-font-weight);
		line-height: 1;
		border-radius: var(--badge-border-radius-pill);
		transition: background-color var(--duration-150) ease, color var(--duration-150) ease, border-color var(--duration-150) ease;
		white-space: nowrap;
	}

	/* Size variants */
	.sm {
		padding: var(--badge-padding-sm);
		font-size: var(--badge-font-size-sm);
	}

	.md {
		padding: var(--badge-padding-md);
		font-size: var(--badge-font-size-md);
	}

	.lg {
		padding: var(--badge-padding-lg);
		font-size: var(--badge-font-size-lg);
	}

	/* Variant styles */
	.default {
		background-color: var(--badge-neutral-background);
		color: var(--badge-neutral-color);
	}

	.primary {
		background-color: var(--badge-primary-background);
		color: var(--badge-primary-color);
	}

	.secondary {
		background-color: var(--badge-neutral-background);
		color: var(--badge-neutral-color);
	}

	.success {
		background-color: var(--badge-success-background);
		color: var(--badge-success-color);
	}

	.warning {
		background-color: var(--badge-warning-background);
		color: var(--badge-warning-color);
	}

	.danger {
		background-color: var(--badge-error-background);
		color: var(--badge-error-color);
	}

	.info {
		background-color: var(--badge-info-background);
		color: var(--badge-info-color);
	}

	.outline {
		background-color: var(--badge-outline-default-background);
		border: 1px solid var(--badge-outline-default-border);
		color: var(--badge-outline-default-color);
	}

	/* Dot indicator */
	.dot {
		width: var(--badge-dot-size);
		height: var(--badge-dot-size);
		border-radius: var(--radius-full);
		background-color: currentColor;
		flex-shrink: 0;
	}

	/* Icon wrapper */
	.icon {
		display: inline-flex;
		align-items: center;
		flex-shrink: 0;
	}

	/* Content wrapper */
	.content {
		display: inline-flex;
		align-items: center;
	}

	/* Remove button */
	.remove-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		margin-left: var(--spacing-0-5);
		background: none;
		border: none;
		color: currentColor;
		cursor: pointer;
		opacity: 0.6;
		transition: opacity var(--duration-150) ease;
		border-radius: var(--radius-full);
		flex-shrink: 0;
	}

	.remove-btn:hover {
		opacity: 1;
	}
</style>
