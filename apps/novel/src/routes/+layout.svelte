<script>
	import { onMount } from 'svelte'
	import { seed, isSeeded } from '$lib/data/seed'
	import '@cosmonexus/design-tokens/css'
	import '@cosmonexus/design-tokens/css/dark'

	let { children } = $props()

	onMount(() => {
		if (!isSeeded()) {
			seed()
		}
		// Apply dark theme by default
		document.documentElement.setAttribute('data-theme', 'dark')
	})
</script>

<div class="app">
	{@render children()}
</div>

<style>
	:global(*, *::before, *::after) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	:global(body) {
		font-family: var(--font-sans, 'Inter', -apple-system, sans-serif);
		background: var(--bg, #0f0f14);
		color: var(--text, #c0caf5);
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
