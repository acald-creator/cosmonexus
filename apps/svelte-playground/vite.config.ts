import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [sveltekit()],
	ssr: {
		noExternal: ['@cosmonexus/cm', '@cosmonexus/stellate', '@cosmonexus/nova-store', '@cosmonexus/nova-svelte'],
	},
})
