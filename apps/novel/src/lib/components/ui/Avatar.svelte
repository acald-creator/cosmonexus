<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
		shape?: 'circle' | 'square';
		src?: string;
		alt?: string;
		initials?: string;
		status?: 'online' | 'offline' | 'busy' | 'away';
		fallback?: Snippet;
		class?: string;
	}

	let {
		size = 'md',
		shape = 'circle',
		src,
		alt,
		initials,
		status,
		fallback,
		class: className,
	}: Props = $props();

	let classes = $derived(
		['avatar', `avatar-${size}`, `avatar-${shape}`, className].filter(Boolean).join(' ')
	);
</script>

<div class={classes}>
	{#if src}
		<img {src} alt={alt || ''} class="avatar-img" />
	{:else if initials}
		<span class="avatar-initials">{initials}</span>
	{:else if fallback}
		{@render fallback()}
	{:else}
		<svg class="avatar-placeholder" viewBox="0 0 24 24" fill="currentColor">
			<path
				d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
			/>
		</svg>
	{/if}
	{#if status}
		<span class="avatar-status {status}"></span>
	{/if}
</div>

<style>
	.avatar {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		background: var(--background-muted);
		color: var(--text-secondary);
		vertical-align: middle;
		flex-shrink: 0;
	}

	/* Sizes */
	.avatar-xs {
		width: var(--avatar-size-xs);
		height: var(--avatar-size-xs);
		font-size: var(--avatar-font-size-xs);
	}

	.avatar-sm {
		width: var(--avatar-size-sm);
		height: var(--avatar-size-sm);
		font-size: var(--avatar-font-size-sm);
	}

	.avatar-md {
		width: var(--avatar-size-md);
		height: var(--avatar-size-md);
		font-size: var(--avatar-font-size-md);
	}

	.avatar-lg {
		width: var(--avatar-size-lg);
		height: var(--avatar-size-lg);
		font-size: var(--avatar-font-size-lg);
	}

	.avatar-xl {
		width: var(--avatar-size-xl);
		height: var(--avatar-size-xl);
		font-size: var(--avatar-font-size-xl);
	}

	.avatar-2xl {
		width: var(--avatar-size-2xl);
		height: var(--avatar-size-2xl);
		font-size: var(--avatar-font-size-2xl);
	}

	/* Shapes */
	.avatar-circle {
		border-radius: var(--avatar-border-radius-circle);
	}

	.avatar-square {
		border-radius: var(--avatar-border-radius-square);
	}

	/* Image */
	.avatar-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* Initials */
	.avatar-initials {
		font-weight: var(--avatar-font-weight);
		line-height: 1;
		text-transform: uppercase;
		user-select: none;
	}

	/* Placeholder SVG */
	.avatar-placeholder {
		width: 60%;
		height: 60%;
	}

	/* Status dot */
	.avatar-status {
		position: absolute;
		bottom: 0;
		right: 0;
		width: var(--avatar-status-size);
		height: var(--avatar-status-size);
		border-radius: var(--radius-full);
		border: var(--avatar-status-border-width) solid var(--avatar-status-border-color);
	}

	.avatar-status.online {
		background-color: var(--avatar-status-online);
	}

	.avatar-status.offline {
		background-color: var(--avatar-status-offline);
	}

	.avatar-status.busy {
		background-color: var(--avatar-status-busy);
	}

	.avatar-status.away {
		background-color: var(--avatar-status-away);
	}
</style>
