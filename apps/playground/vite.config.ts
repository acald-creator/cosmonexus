import { resolve } from 'node:path'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [react(), vanillaExtractPlugin()],
	server: { port: 4000 },
	resolve: {
		alias: {
			'@cosmonexus/design-tokens/themes/dark': resolve(
				__dirname,
				'../../packages/design-tokens/src/themes/dark.css.ts',
			),
			'@cosmonexus/design-tokens/global': resolve(
				__dirname,
				'../../packages/design-tokens/src/global.css.ts',
			),
			'@cosmonexus/design-tokens/contract': resolve(
				__dirname,
				'../../packages/design-tokens/src/contract.css.ts',
			),
			'@cosmonexus/design-tokens': resolve(__dirname, '../../packages/design-tokens/src/index.ts'),
			'@cosmonexus/nova-ui': resolve(__dirname, '../../packages/nova-ui/src/index.ts'),
		},
	},
})
