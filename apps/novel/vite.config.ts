import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import path from 'node:path'

const workspaceRoot = path.resolve('../..')

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		conditions: ['browser', 'import', 'module', 'default'],
		alias: {
			'@cosmonexus/nova-svelte': path.resolve(workspaceRoot, 'packages/nova-svelte/src/lib'),
		},
	},
	optimizeDeps: {
		exclude: ['svelte'],
	},
	server: {
		port: 4000,
		fs: {
			allow: [workspaceRoot],
		},
	},
	ssr: {
		noExternal: [
			'@cosmonexus/prose',
			'@cosmonexus/nova-store',
			'@cosmonexus/nova-svelte',
		],
	},
})
