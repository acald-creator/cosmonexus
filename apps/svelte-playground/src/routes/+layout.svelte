<script lang="ts">
	import { setTheme } from '@cosmonexus/nova-svelte'

	const theme = setTheme({
		colors: {
			bg: '#1a1b26',
			surface: '#24283b',
			text: '#c0caf5',
			primary: '#7aa2f7',
			secondary: '#bb9af7',
			accent: '#7dcfff',
			border: '#414868',
			muted: '#565f89',
		},
		fonts: {
			mono: "'JetBrains Mono', 'Fira Code', monospace",
			sans: "'Inter', -apple-system, sans-serif",
		},
	})
</script>

<div class="app">
	<slot />
</div>

<style>
	:global(*, *::before, *::after) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	:global(body) {
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
		background-color: #1a1b26;
		color: #c0caf5;
		min-height: 100vh;
	}

	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}
</style>
