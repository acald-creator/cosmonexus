<script>
	import { onMount } from 'svelte'
	import { seed, isSeeded } from '$lib/data/seed'
	import { initTheme } from '$lib/state/theme.svelte'
	import '$lib/styles/tokens.css'
	import '$lib/styles/tokens-dark.css'

	let { children } = $props()

	onMount(() => {
		if (!isSeeded()) {
			seed()
		}
		initTheme()
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
		font-family: var(--font-family-sans);
		background: var(--background-body);
		color: var(--text-primary);
		min-height: 100dvh;
		line-height: var(--line-height-normal);
		transition: background-color var(--duration-200) ease, color var(--duration-200) ease;
	}

	:global(a) {
		color: inherit;
	}

	.app {
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
	}
</style>
