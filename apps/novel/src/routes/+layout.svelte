<script>
	import { onMount } from 'svelte'
	import { seed, isSeeded } from '$lib/data/seed'
	import { initTheme } from '$lib/state/theme.svelte'
	import '$lib/styles/tokens.css'
	import '$lib/styles/tokens-dark.css'
	import '$lib/styles/globals.css'

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
	.app {
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
	}
</style>
