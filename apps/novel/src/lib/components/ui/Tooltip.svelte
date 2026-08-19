<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		content: string;
		position?: 'top' | 'bottom' | 'left' | 'right';
		showDelay?: number;
		hideDelay?: number;
		disabled?: boolean;
		children: Snippet;
		class?: string;
		/** Controlled visibility. When provided, the parent controls show/hide. */
		visible?: boolean;
	}

	let {
		content,
		position = 'top',
		showDelay = 0,
		hideDelay = 0,
		disabled = false,
		children,
		class: className = '',
		visible,
	}: Props = $props();

	let internalVisible = $state(false);
	let isVisible = $derived(visible !== undefined ? visible : internalVisible);

	let showTimeout: ReturnType<typeof setTimeout> | null = null;
	let hideTimeout: ReturnType<typeof setTimeout> | null = null;

	function clearTimeouts() {
		if (showTimeout) {
			clearTimeout(showTimeout);
			showTimeout = null;
		}
		if (hideTimeout) {
			clearTimeout(hideTimeout);
			hideTimeout = null;
		}
	}

	function show() {
		if (disabled || visible !== undefined) return;
		clearTimeouts();
		if (showDelay > 0) {
			showTimeout = setTimeout(() => {
				internalVisible = true;
			}, showDelay);
		} else {
			internalVisible = true;
		}
	}

	function hide() {
		if (visible !== undefined) return;
		clearTimeouts();
		if (hideDelay > 0) {
			hideTimeout = setTimeout(() => {
				internalVisible = false;
			}, hideDelay);
		} else {
			internalVisible = false;
		}
	}

	$effect(() => {
		return () => clearTimeouts();
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="tooltip-wrapper {className}"
	onmouseenter={show}
	onmouseleave={hide}
	onfocusin={show}
	onfocusout={hide}
>
	{@render children()}
	{#if isVisible && !disabled}
		<div class="tooltip {position}" role="tooltip">
			{content}
			<span class="tooltip-arrow"></span>
		</div>
	{/if}
</div>

<style>
	.tooltip-wrapper {
		position: relative;
		display: inline-flex;
	}

	.tooltip {
		position: absolute;
		z-index: var(--tooltip-z-index);
		padding: var(--tooltip-padding-y) var(--tooltip-padding-x);
		background: var(--tooltip-background);
		color: var(--tooltip-color);
		font-size: var(--tooltip-font-size);
		font-weight: var(--tooltip-font-weight);
		line-height: var(--tooltip-line-height);
		border-radius: var(--tooltip-border-radius);
		max-width: var(--tooltip-max-width);
		white-space: nowrap;
		pointer-events: none;
		animation: tooltip-fade-in var(--tooltip-animation-duration) var(--tooltip-animation-easing);
	}

	.tooltip.top {
		bottom: 100%;
		left: 50%;
		transform: translateX(-50%);
		margin-bottom: var(--tooltip-offset);
	}

	.tooltip.bottom {
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		margin-top: var(--tooltip-offset);
	}

	.tooltip.left {
		right: 100%;
		top: 50%;
		transform: translateY(-50%);
		margin-right: var(--tooltip-offset);
	}

	.tooltip.right {
		left: 100%;
		top: 50%;
		transform: translateY(-50%);
		margin-left: var(--tooltip-offset);
	}

	.tooltip-arrow {
		position: absolute;
		width: 0;
		height: 0;
		border: calc(var(--tooltip-arrow-size) / 2) solid transparent;
	}

	.tooltip.top .tooltip-arrow {
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		border-top-color: var(--tooltip-arrow-background);
	}

	.tooltip.bottom .tooltip-arrow {
		bottom: 100%;
		left: 50%;
		transform: translateX(-50%);
		border-bottom-color: var(--tooltip-arrow-background);
	}

	.tooltip.left .tooltip-arrow {
		left: 100%;
		top: 50%;
		transform: translateY(-50%);
		border-left-color: var(--tooltip-arrow-background);
	}

	.tooltip.right .tooltip-arrow {
		right: 100%;
		top: 50%;
		transform: translateY(-50%);
		border-right-color: var(--tooltip-arrow-background);
	}

	@keyframes tooltip-fade-in {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
	}

	.tooltip.left {
		animation-name: tooltip-fade-in-horizontal;
	}

	.tooltip.right {
		animation-name: tooltip-fade-in-horizontal;
	}

	@keyframes tooltip-fade-in-horizontal {
		from {
			opacity: 0;
			transform: translateY(-50%) translateX(4px);
		}
		to {
			opacity: 1;
			transform: translateY(-50%) translateX(0);
		}
	}
</style>
