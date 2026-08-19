<script>
	import { onMount } from 'svelte'
	import { seed, isSeeded } from '$lib/data/seed'
	import '$lib/styles/tokens.css'

	let { children } = $props()

	onMount(() => {
		if (!isSeeded()) {
			seed()
		}
		document.documentElement.setAttribute('data-theme', 'dark')
	})
</script>

<div class="app">
	{@render children()}
</div>

<style>
	:global([data-theme="dark"]) {
		/* Bridge acaldwell-dev tokens to novel app shorthand variables */
		--bg: var(--background-body);
		--surface: var(--background-surface);
		--surface-raised: var(--background-muted);
		--border: var(--border-light);
		--text: var(--text-primary);
		--text-dim: var(--text-secondary);
		--muted: var(--text-muted);
		--primary: var(--color-accent-main);
		--primary-dim: var(--color-accent-soft);
		--secondary: var(--color-accent-pink);
		--accent: var(--color-accent-blue);
		--success: var(--color-success-text);
		--warning: var(--color-warning-text);
		--error: var(--color-error-text);
		--font-sans: var(--font-family-sans);
		--font-serif: var(--font-family-display);
		--font-mono: var(--font-family-mono);
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
