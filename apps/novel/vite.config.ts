import { sveltekit } from '@sveltejs/kit/vite'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import { defineConfig } from 'vite'
import path from 'node:path'

const workspaceRoot = path.resolve('../..')

export default defineConfig({
	plugins: [
		vanillaExtractPlugin({
			identifiers: 'debug',
		}),
		sveltekit(),
	],
	root: undefined,
	resolve: {
		conditions: ['browser', 'import', 'module', 'default'],
		alias: {
			'@cosmonexus/nova-svelte': path.resolve(workspaceRoot, 'packages/nova-svelte/src/lib'),
			'@cosmonexus/nova-ui-svelte': path.resolve(workspaceRoot, 'packages/nova-ui-svelte/src/lib'),
			'@cosmonexus/design-tokens/contract': path.resolve(workspaceRoot, 'packages/design-tokens/src/contract.css.ts'),
			'@cosmonexus/design-tokens': path.resolve(workspaceRoot, 'packages/design-tokens/src/index.ts'),
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
			'@cosmonexus/nova-ui-svelte',
			'@cosmonexus/design-tokens',
		],
	},
})
