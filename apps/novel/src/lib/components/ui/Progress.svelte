<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		value?: number;
		max?: number;
		size?: 'sm' | 'md' | 'lg';
		variant?: 'primary' | 'success' | 'warning' | 'error';
		indeterminate?: boolean;
		label?: string;
		showValue?: boolean;
		circular?: boolean;
		circularSize?: number;
		strokeWidth?: number;
		class?: string;
	}

	let {
		value = 0,
		max = 100,
		size = 'md',
		variant = 'primary',
		indeterminate = false,
		label,
		showValue = false,
		circular = false,
		circularSize = 48,
		strokeWidth = 4,
		class: className,
		...rest
	}: Props = $props();

	let percentage = $derived(Math.min(100, Math.max(0, (value / max) * 100)));

	let radius = $derived((circularSize - strokeWidth) / 2);
	let center = $derived(circularSize / 2);
	let circumference = $derived(2 * Math.PI * radius);
	let dashOffset = $derived(circumference - (percentage / 100) * circumference);

	let classes = $derived(
		[
			'progress',
			circular ? 'circular' : 'linear',
			size,
			variant,
			indeterminate && 'indeterminate',
			className
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

{#if circular}
	<div
		class={classes}
		role="progressbar"
		aria-valuenow={indeterminate ? undefined : value}
		aria-valuemin={0}
		aria-valuemax={max}
		{...rest}
	>
		<svg
			width={circularSize}
			height={circularSize}
			viewBox="0 0 {circularSize} {circularSize}"
		>
			<circle
				class="track"
				cx={center}
				cy={center}
				r={radius}
				stroke-width={strokeWidth}
				fill="none"
			/>
			<circle
				class="indicator"
				cx={center}
				cy={center}
				r={radius}
				stroke-width={strokeWidth}
				fill="none"
				stroke-dasharray={circumference}
				stroke-dashoffset={indeterminate ? circumference * 0.75 : dashOffset}
			/>
		</svg>
		{#if showValue && !indeterminate}
			<span class="circular-value">{Math.round(percentage)}%</span>
		{/if}
	</div>
{:else}
	<div
		class={classes}
		role="progressbar"
		aria-valuenow={indeterminate ? undefined : value}
		aria-valuemin={0}
		aria-valuemax={max}
		{...rest}
	>
		{#if label || showValue}
			<div class="progress-header">
				{#if label}<span class="progress-label">{label}</span>{/if}
				{#if showValue && !indeterminate}<span class="progress-value">{Math.round(percentage)}%</span>{/if}
			</div>
		{/if}
		<div class="progress-track">
			<div class="progress-fill" style:width="{percentage}%"></div>
		</div>
	</div>
{/if}

<style>
	/* ---- Shared ---- */
	.progress {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-1);
	}

	/* ---- Linear ---- */
	.progress-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.progress-label {
		font-size: var(--progress-label-font-size);
		font-weight: var(--progress-label-font-weight);
		color: var(--progress-label-color);
	}

	.progress-value {
		font-size: var(--progress-label-font-size);
		color: var(--text-muted);
		font-family: var(--font-mono, monospace);
	}

	.progress-track {
		width: 100%;
		background-color: var(--progress-bar-background);
		border-radius: var(--progress-bar-border-radius);
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		border-radius: var(--progress-bar-border-radius);
		transition: width var(--progress-bar-transition-duration) ease;
	}

	/* Size — track height */
	.linear.sm .progress-track {
		height: var(--progress-bar-height-sm);
	}

	.linear.md .progress-track {
		height: var(--progress-bar-height-md);
	}

	.linear.lg .progress-track {
		height: var(--progress-bar-height-lg);
	}

	/* Variant — fill color */
	.primary .progress-fill {
		background-color: var(--progress-variant-primary-fill-background);
	}

	.success .progress-fill {
		background-color: var(--progress-variant-success-fill-background);
	}

	.warning .progress-fill {
		background-color: var(--progress-variant-warning-fill-background);
	}

	.error .progress-fill {
		background-color: var(--progress-variant-error-fill-background);
	}

	/* Indeterminate animation — linear */
	.linear.indeterminate .progress-fill {
		width: 40% !important;
		animation: indeterminate-slide 1.5s ease-in-out infinite;
	}

	@keyframes indeterminate-slide {
		0% {
			transform: translateX(-100%);
		}
		50% {
			transform: translateX(150%);
		}
		100% {
			transform: translateX(-100%);
		}
	}

	/* ---- Circular ---- */
	.circular {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.circular svg {
		transform: rotate(-90deg);
	}

	.track {
		stroke: var(--progress-circular-track-color);
	}

	.indicator {
		transition: stroke-dashoffset var(--progress-bar-transition-duration) ease;
		stroke-linecap: round;
	}

	/* Variant — indicator stroke color */
	.primary .indicator {
		stroke: var(--progress-variant-primary-fill-background);
	}

	.success .indicator {
		stroke: var(--progress-variant-success-fill-background);
	}

	.warning .indicator {
		stroke: var(--progress-variant-warning-fill-background);
	}

	.error .indicator {
		stroke: var(--progress-variant-error-fill-background);
	}

	/* Indeterminate animation — circular */
	.circular.indeterminate svg {
		animation: circular-rotate 1.4s linear infinite;
	}

	@keyframes circular-rotate {
		100% {
			transform: rotate(270deg);
		}
	}

	/* Circular value text */
	.circular-value {
		position: absolute;
		font-size: var(--progress-circular-font-size);
		font-family: var(--font-mono, monospace);
		color: var(--progress-circular-text-color);
		line-height: 1;
	}
</style>
