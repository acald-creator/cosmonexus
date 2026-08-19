<script>
	import { toggleTheme, getTheme } from '$lib/state/theme.svelte'

	let { variant = 'reader' } = $props()
	let theme = $derived(getTheme())
</script>

<header class="header" class:author={variant === 'author'}>
	<div class="left">
		<a href="/" class="logo">📚 Cosmonexus</a>
	</div>
	<nav class="nav">
		{#if variant === 'author'}
			<a href="/author" class="nav-link">Dashboard</a>
		{:else}
			<a href="/" class="nav-link">Library</a>
		{/if}
	</nav>
	<div class="right">
		<button class="theme-toggle" onclick={toggleTheme} aria-label="Toggle theme">
			{theme === 'dark' ? '☀️' : '🌙'}
		</button>
		{#if variant === 'author'}
			<span class="badge">Author</span>
		{/if}
		<button class="avatar" aria-label="Account">👤</button>
	</div>
</header>

<style>
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-block: var(--spacing-3);
		padding-inline: var(--spacing-6);
		border-block-end: 1px solid var(--border-light);
		background: var(--background-surface);
		position: sticky;
		inset-block-start: 0;
		z-index: 100;
	}

	.logo {
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-bold);
		color: var(--text-primary);
		text-decoration: none;
	}

	.nav {
		display: flex;
		gap: var(--spacing-6);
	}

	.nav-link {
		color: var(--text-muted);
		text-decoration: none;
		font-size: var(--font-size-sm);
		transition: color var(--duration-150) ease;
	}

	.nav-link:hover {
		color: var(--text-primary);
	}

	.nav-link:focus-visible {
		outline: none;
		box-shadow: var(--focus-ring);
		border-radius: var(--radius-sm);
	}

	.right {
		display: flex;
		align-items: center;
		gap: var(--spacing-3);
	}

	.theme-toggle {
		width: var(--size-button-sm);
		height: var(--size-button-sm);
		border-radius: var(--radius-full);
		border: 1px solid var(--border-light);
		background: transparent;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--font-size-sm);
		transition: background-color var(--duration-150) ease;
	}

	.theme-toggle:hover {
		background: var(--background-muted);
	}

	.theme-toggle:focus-visible {
		outline: none;
		box-shadow: var(--focus-ring);
	}

	.badge {
		font-size: var(--font-size-xs);
		padding: var(--spacing-0-5) var(--spacing-2);
		border-radius: var(--radius-md);
		background: var(--color-accent-main);
		color: var(--background-body);
		font-weight: var(--font-weight-semibold);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.avatar {
		width: var(--size-button-sm);
		height: var(--size-button-sm);
		border-radius: var(--radius-full);
		border: 1px solid var(--border-light);
		background: transparent;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--font-size-sm);
	}

	.avatar:focus-visible {
		outline: none;
		box-shadow: var(--focus-ring);
	}
</style>
