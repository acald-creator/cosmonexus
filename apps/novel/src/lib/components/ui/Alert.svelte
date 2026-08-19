<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		variant?: 'info' | 'success' | 'warning' | 'error';
		title?: string;
		icon?: Snippet;
		showIcon?: boolean;
		onclose?: () => void;
		children: Snippet;
		class?: string;
	}

	let {
		variant = 'info',
		title,
		icon,
		showIcon = true,
		onclose,
		children,
		class: className,
		...rest
	}: Props = $props();

	let classes = $derived(
		['alert', `alert--${variant}`, className].filter(Boolean).join(' ')
	);
</script>

<div class={classes} role="alert" {...rest}>
	{#if showIcon}
		<span class="alert-icon">
			{#if icon}
				{@render icon()}
			{:else if variant === 'info'}
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="12" cy="12" r="10" />
					<line x1="12" y1="16" x2="12" y2="12" />
					<line x1="12" y1="8" x2="12.01" y2="8" />
				</svg>
			{:else if variant === 'success'}
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="12" cy="12" r="10" />
					<path d="M9 12l2 2 4-4" />
				</svg>
			{:else if variant === 'warning'}
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
					<line x1="12" y1="9" x2="12" y2="13" />
					<line x1="12" y1="17" x2="12.01" y2="17" />
				</svg>
			{:else if variant === 'error'}
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="12" cy="12" r="10" />
					<line x1="15" y1="9" x2="9" y2="15" />
					<line x1="9" y1="9" x2="15" y2="15" />
				</svg>
			{/if}
		</span>
	{/if}
	<div class="alert-content">
		{#if title}<h4 class="alert-title">{title}</h4>{/if}
		<div class="alert-description">{@render children()}</div>
	</div>
	{#if onclose}
		<button type="button" class="alert-close" onclick={onclose} aria-label="Close">
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M18 6L6 18M6 6l12 12" />
			</svg>
		</button>
	{/if}
</div>

<style>
	.alert {
		display: flex;
		gap: var(--alert-gap);
		padding: var(--alert-padding);
		border-radius: var(--alert-border-radius);
		border: 1px solid var(--border-default);
		position: relative;
		overflow: hidden;
	}

	/* Top accent line — 2px gradient, variant-colored */
	.alert::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
	}

	/* --- Info --- */
	.alert--info {
		background-color: var(--alert-soft-info-background);
	}
	.alert--info::before {
		background: linear-gradient(90deg, var(--alert-info-icon-color), var(--color-info-border));
	}
	.alert--info .alert-icon {
		color: var(--alert-info-icon-color);
	}

	/* --- Success --- */
	.alert--success {
		background-color: var(--alert-soft-success-background);
	}
	.alert--success::before {
		background: linear-gradient(90deg, var(--alert-success-icon-color), var(--color-success-border));
	}
	.alert--success .alert-icon {
		color: var(--alert-success-icon-color);
	}

	/* --- Warning --- */
	.alert--warning {
		background-color: var(--alert-soft-warning-background);
	}
	.alert--warning::before {
		background: linear-gradient(90deg, var(--alert-warning-icon-color), var(--color-warning-border));
	}
	.alert--warning .alert-icon {
		color: var(--alert-warning-icon-color);
	}

	/* --- Error --- */
	.alert--error {
		background-color: var(--alert-soft-error-background);
	}
	.alert--error::before {
		background: linear-gradient(90deg, var(--alert-error-icon-color), var(--color-error-border));
	}
	.alert--error .alert-icon {
		color: var(--alert-error-icon-color);
	}

	.alert-icon {
		flex-shrink: 0;
		width: var(--alert-icon-size);
		height: var(--alert-icon-size);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.alert-content {
		flex: 1;
		min-width: 0;
	}

	.alert-title {
		font-weight: var(--alert-title-font-weight);
		font-size: var(--alert-title-font-size);
		margin: 0 0 var(--alert-title-margin-bottom) 0;
	}

	.alert-description {
		opacity: var(--alert-description-opacity);
		font-size: var(--alert-description-font-size);
	}

	.alert-close {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		color: currentColor;
		opacity: var(--alert-close-opacity);
		transition: opacity var(--duration-150) ease;
		width: var(--alert-close-size);
		height: var(--alert-close-size);
	}

	.alert-close:hover {
		opacity: var(--alert-close-hover-opacity);
	}
</style>
