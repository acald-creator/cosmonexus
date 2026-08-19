<script>
	import { onMount } from 'svelte'
	import { seed, isSeeded } from '$lib/data/seed'

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
		--bg: #0f0f14;
		--surface: #1a1b26;
		--surface-raised: #24283b;
		--border: #2f3347;
		--text: #c0caf5;
		--text-dim: #a9b1d6;
		--muted: #565f89;
		--primary: #7aa2f7;
		--primary-dim: rgba(122, 162, 247, 0.1);
		--secondary: #bb9af7;
		--accent: #7dcfff;
		--success: #9ece6a;
		--warning: #e0af68;
		--error: #f7768e;
		--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
		--font-serif: 'Georgia', 'Times New Roman', serif;
		--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
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
