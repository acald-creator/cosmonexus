<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'default' | 'elevated' | 'outlined' | 'ghost' | 'gradient';
		padding?: 'none' | 'sm' | 'md' | 'lg';
		interactive?: boolean;
		fullWidth?: boolean;
		header?: Snippet;
		footer?: Snippet;
		children: Snippet;
		class?: string;
		onclick?: (e: MouseEvent) => void;
		asChild?: boolean;
		child?: Snippet<[string]>;
	}

	let {
		variant = 'default',
		padding = 'md',
		interactive = false,
		fullWidth = false,
		header,
		footer,
		children,
		class: className = '',
		onclick,
		asChild = false,
		child
	}: Props = $props();

	let classes = $derived(
		[
			'card',
			`card--${variant}`,
			`card--padding-${padding}`,
			interactive && 'card--interactive',
			fullWidth && 'card--full-width',
			className
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

{#if asChild && child}
	{@render child(classes)}
{:else}
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		class={classes}
		onclick={interactive ? onclick : undefined}
		onkeydown={interactive
			? (e: KeyboardEvent) => {
					if ((e.key === 'Enter' || e.key === ' ') && onclick) {
						e.preventDefault();
						onclick(e as unknown as MouseEvent);
					}
				}
			: undefined}
		role={interactive ? 'button' : undefined}
		tabindex={interactive ? 0 : undefined}
	>
		{#if header}
			<div class="card-header">
				{@render header()}
			</div>
		{/if}
		<div class="card-body">
			{@render children()}
		</div>
		{#if footer}
			<div class="card-footer">
				{@render footer()}
			</div>
		{/if}
	</div>
{/if}

<style>
	.card {
		background: var(--card-background);
		border: 1px solid var(--card-border);
		border-radius: var(--card-border-radius);
		overflow: hidden;
		transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
	}

	/* Padding variants */
	.card--padding-none .card-body {
		padding: 0;
	}

	.card--padding-sm .card-body {
		padding: var(--spacing-3);
	}

	.card--padding-md .card-body {
		padding: var(--card-body-padding);
	}

	.card--padding-lg .card-body {
		padding: var(--spacing-8);
	}

	/* Variant: elevated */
	.card--elevated {
		background: var(--card-elevated-background);
		box-shadow: var(--card-elevated-shadow);
	}

	.card--elevated:hover {
		box-shadow: var(--card-elevated-hover-shadow);
		transform: var(--card-elevated-hover-transform);
	}

	/* Variant: outlined (same as default) */

	/* Variant: ghost */
	.card--ghost {
		background: transparent;
		border-color: transparent;
	}

	/* Variant: gradient */
	.card--gradient {
		border-top: 3px solid transparent;
		border-image: linear-gradient(to right, var(--card-gradient-border-gradient)) 1;
		border-image-slice: 1 0 0 0;
	}

	/* Interactive */
	.card--interactive {
		cursor: pointer;
	}

	.card--interactive:hover {
		border-color: var(--card-interactive-hover-border);
		box-shadow: var(--card-interactive-hover-shadow);
		transform: var(--card-interactive-hover-transform);
	}

	.card--interactive:active {
		box-shadow: var(--card-interactive-active-shadow);
		transform: var(--card-interactive-active-transform);
	}

	/* Full width */
	.card--full-width {
		width: 100%;
	}

	/* Header */
	.card-header {
		padding: var(--card-header-padding);
		border-bottom: 1px solid var(--card-header-border-bottom);
	}

	/* Footer */
	.card-footer {
		padding: var(--card-footer-padding);
		border-top: 1px solid var(--card-footer-border-top);
		background: var(--card-footer-background);
	}
</style>
