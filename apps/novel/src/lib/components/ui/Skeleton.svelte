<script lang="ts">
	interface Props {
		variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
		width?: string;
		height?: string;
		lines?: number;
		animate?: boolean;
		class?: string;
		[key: string]: unknown;
	}

	let {
		variant = 'text',
		width,
		height,
		lines = 1,
		animate = true,
		class: className,
		...rest
	}: Props = $props();

	let classes = $derived(
		[
			'skeleton',
			`skeleton-${variant}`,
			animate && 'skeleton-animate',
			className
		]
			.filter(Boolean)
			.join(' ')
	);

	let lineClasses = $derived(
		[
			'skeleton',
			'skeleton-text',
			animate && 'skeleton-animate',
			className
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

{#if variant === 'text' && lines > 1}
	<div class="skeleton-text-group" {...rest}>
		{#each Array(lines) as _, i (i)}
			<div
				class={lineClasses}
				class:last-line={i === lines - 1}
				style:width={i === lines - 1 ? '60%' : width || '100%'}
				style:height={height || '16px'}
			></div>
		{/each}
	</div>
{:else}
	<div class={classes} style:width={width} style:height={height} {...rest}></div>
{/if}

<style>
	.skeleton {
		position: relative;
		overflow: hidden;
		background: var(--skeleton-base-background);
	}

	.skeleton-text {
		border-radius: var(--skeleton-text-border-radius);
		height: var(--skeleton-text-height);
	}

	.skeleton-circular {
		border-radius: var(--skeleton-avatar-border-radius);
	}

	.skeleton-rectangular {
		border-radius: var(--radius-none);
	}

	.skeleton-rounded {
		border-radius: var(--skeleton-base-border-radius);
	}

	.skeleton-text-group {
		display: flex;
		flex-direction: column;
		gap: var(--skeleton-paragraph-line-gap);
	}

	.last-line {
		width: var(--skeleton-paragraph-last-line-width);
	}

	@keyframes shimmer {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}

	.skeleton-animate::after {
		content: '';
		position: absolute;
		inset: 0;
		background: var(--skeleton-shimmer);
		animation: shimmer var(--skeleton-pulse-duration) infinite;
	}
</style>
