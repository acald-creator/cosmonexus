<script>
	import { onMount } from 'svelte'
	import { seed, isSeeded } from '$lib/data/seed'
	import '$lib/styles/tokens.css'

	let { children } = $props()

	onMount(() => {
		if (!isSeeded()) {
			seed()
		}
	})
</script>

<div class="app">
	{@render children()}
</div>

<style>
	:global(:root) {
		--bg: var(--color-bg-body, #0f0f14);
		--surface: var(--color-bg-surface, #1a1b26);
		--surface-raised: var(--color-bg-raised, #24283b);
		--border: var(--color-border, #2f3347);
		--text: var(--color-text-primary, #c0caf5);
		--text-dim: var(--color-text-secondary, #a9b1d6);
		--muted: var(--color-text-muted, #565f89);
		--primary: var(--color-accent-primary, #7aa2f7);
		--primary-dim: rgba(122, 162, 247, 0.1);
		--secondary: var(--color-accent-secondary, #bb9af7);
		--accent: #7dcfff;
		--success: var(--color-success, #9ece6a);
		--warning: var(--color-warning, #e0af68);
		--error: var(--color-error, #f7768e);
		--font-sans: var(--font-family-sans, 'Inter', -apple-system, sans-serif);
		--font-serif: var(--font-family-display, 'Georgia', serif);
		--font-mono: var(--font-family-mono, 'JetBrains Mono', monospace);
	}

	:global(*, *::before, *::after) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	:global(body) {
		font-family: var(--font-sans);
		background: var(--bg);
		color: var(--text);
		min-height: 100vh;
		line-height: 1.6;
	}

	:global(a) {
		color: inherit;
	}

	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}
</style>
