import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['src/index.ts', 'src/contract.css.ts', 'src/themes/dark.css.ts', 'src/global.css.ts'],
	format: ['esm', 'cjs'],
	dts: true,
	target: 'es2022',
	sourcemap: true,
	clean: true,
	external: ['@vanilla-extract/css'],
})
