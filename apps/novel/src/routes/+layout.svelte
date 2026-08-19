<script>
	import { onMount } from 'svelte'
	import { initDataLayer } from '$lib/data/init'
	import '$lib/styles/tokens.css'
	import '$lib/styles/tokens-dark.css'
	import '$lib/styles/globals.css'

	let { children } = $props()
	let ready = $state(false)

	onMount(async () => {
		await initDataLayer()
		ready = true

		// Apply theme
		const saved = localStorage.getItem('theme')
		document.documentElement.setAttribute('data-theme', saved ?? 'dark')
	})
</script>

{#if ready}
	<div class="app">
		{@render children()}
	</div>
{:else}
	<div class="loading">Loading...</div>
{/if}

<style>
	.app {
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
	}

	.loading {
		min-height: 100dvh;
		display: grid;
		place-items: center;
		font-family: var(--font-family-sans);
		color: var(--text-muted);
	}
</style>
