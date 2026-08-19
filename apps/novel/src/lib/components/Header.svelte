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
		padding: 0.75rem 1.5rem;
		border-bottom: 1px solid var(--border);
		background: var(--surface);
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.logo {
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--text);
		text-decoration: none;
	}

	.nav {
		display: flex;
		gap: 1.5rem;
	}

	.nav-link {
		color: var(--muted);
		text-decoration: none;
		font-size: 0.9rem;
		transition: color 0.15s;
	}

	.nav-link:hover {
		color: var(--text);
	}

	.right {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.theme-toggle {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		border: 1px solid var(--border);
		background: transparent;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.9rem;
		transition: background 0.15s;
	}

	.theme-toggle:hover {
		background: var(--surface-raised);
	}

	.badge {
		font-size: 0.7rem;
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		background: var(--primary);
		color: var(--bg);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.avatar {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		border: 1px solid var(--border);
		background: transparent;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.9rem;
	}
</style>
