import { svelte } from '@sveltejs/vite-plugin-svelte'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
	plugins: [vanillaExtractPlugin(), svelte()],
	resolve: {
		alias: {
			'@cosmonexus/design-tokens/contract': resolve(__dirname, '../design-tokens/src/contract.css.ts'),
		},
	},
	build: {
		lib: {
			entry: resolve(__dirname, 'src/lib/styles-entry.ts'),
			formats: ['es'],
			fileName: 'styles-runtime',
		},
		cssFileName: 'styles',
		outDir: 'dist',
		emptyOutDir: false,
		rollupOptions: {
			external: ['svelte', 'svelte/internal'],
		},
	},
})
