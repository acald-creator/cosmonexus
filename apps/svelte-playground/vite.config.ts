import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import path from 'node:path'

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		conditions: ['browser', 'import', 'module', 'default'],
		alias: {
			'@cosmonexus/nova-svelte': path.resolve('../..', 'packages/nova-svelte/src/lib'),
		},
	},
	optimizeDeps: {
		exclude: ['svelte'],
	},
	ssr: {
		noExternal: ['@cosmonexus/cm', '@cosmonexus/stellate', '@cosmonexus/nova-store', '@cosmonexus/nova-svelte'],
	},
})
