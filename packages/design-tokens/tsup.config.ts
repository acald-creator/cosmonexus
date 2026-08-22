import { defineConfig } from 'tsup'

export default defineConfig({
	entry: [
		'src/index.ts',
		'src/contract.css.ts',
		'src/themes/dark.css.ts',
		'src/themes/light.css.ts',
		'src/global.css.ts',
	],
	format: ['esm', 'cjs'],
	dts: true,
	target: 'es2022',
	sourcemap: true,
	// Style Dictionary writes dist/css/; tsup clean would delete it.
	clean: false,
	external: ['@vanilla-extract/css'],
})
